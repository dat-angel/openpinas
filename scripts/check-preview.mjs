#!/usr/bin/env node
// After a pull request's Vercel preview is up:
//   node scripts/check-preview.mjs --url https://<preview> --visual --resolve
// Fetches the latest review surfaces, checks links, checks layout, then
// resolves that branch's open Vercel toolbar threads when the check passes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BROWSER_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}
const hasFlag = (name) => process.argv.includes(name);

const preview = arg("--url") ?? process.env.PREVIEW_URL;
if (!preview) {
  console.error("Pass --url or PREVIEW_URL");
  process.exit(1);
}
const base = new URL(preview);
base.hash = "";
base.search = "";
if (!base.pathname.endsWith("/")) base.pathname = "/";
const origin = base.origin;
const branch = (arg("--branch") ?? process.env.PREVIEW_BRANCH ?? "").replace(/^refs\/heads\//, "");
const wantVisual = hasFlag("--visual");
const wantResolve = hasFlag("--resolve");
const shotDir = path.resolve(arg("--shots") ?? path.join(ROOT, "preview-check-artifacts"));
const summaryPath = arg("--summary") ?? path.join(shotDir, "summary.md");

const failures = [];
const warnings = [];
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
}

const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? "";
function headersFor(url, extra = {}) {
  const headers = { "user-agent": BROWSER_UA, accept: "text/html,application/xhtml+xml", ...extra };
  if (bypass && new URL(url).origin === origin) headers["x-vercel-protection-bypass"] = bypass;
  return headers;
}

async function request(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, { method, redirect: "follow", headers: headersFor(url), signal: controller.signal });
    await response.body?.cancel();
    return response.status;
  } finally {
    clearTimeout(timer);
  }
}

async function statusOf(url) {
  let status = await request(url, "HEAD");
  if (status === 405 || status === 403 || status === 401 || status === 429) {
    const getStatus = await request(url, "GET");
    if (getStatus) status = getStatus;
  }
  return status;
}

async function fetchHtml(pathname) {
  const url = new URL(pathname, origin).href;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, { redirect: "follow", headers: headersFor(url), signal: controller.signal });
    const html = await response.text();
    return { url, status: response.status, html };
  } finally {
    clearTimeout(timer);
  }
}

function pageText(html) {
  return cheerio.load(html).text().replace(/\s+/g, " ");
}

function mustContain(label, html, text) {
  if (!pageText(html).includes(text)) fail(`${label} is missing “${text}”`);
}

const now = readJson("content/now-developing.json");
const manifest = readJson("weekly-reviews/data/manifest.json");
const regular = manifest.reviews.filter((entry) => entry.editionType !== "special");
const latest = regular[0];
const previous = regular[1];
const latestReview = readJson(`weekly-reviews/data/${latest.weekEnding}.json`);
const headlines = latestReview.eventSections.flatMap((section) => section.articles.map((article) => article.headline));

const pages = [
  { path: "/", label: "homepage" },
  { path: "/weekly-reviews/index.html", label: "archive" },
  { path: now.weekly_review_href, label: "latest review" },
  { path: `/weekly-reviews/weekly-review-${previous.weekEnding}.html`, label: "previous review" },
  { path: latestReview.eventSections[0].articles[0].headlineHref, label: "timeline entry" },
];

const htmlByLabel = new Map();
const internal = new Set();
let protectedPreview = false;
for (const page of pages) {
  let result;
  try {
    result = await fetchHtml(page.path);
  } catch (error) {
    fail(`${page.label} fetch failed: ${error.message}`);
    continue;
  }
  if (result.status !== 200) fail(`${page.label} returned ${result.status} (${result.url})`);
  if (/Authentication Required|vercel\.com\/sso-api|Deployment Protection/i.test(result.html)) {
    protectedPreview = true;
    fail(`${page.label} is behind Vercel Deployment Protection. Set the VERCEL_AUTOMATION_BYPASS_SECRET repository secret.`);
    continue;
  }
  const heading = cheerio.load(result.html)("h1").first().text();
  if (/could not be found|application error/i.test(heading)) fail(`${page.label} rendered an error page`);
  htmlByLabel.set(page.label, result.html);
  const $ = cheerio.load(result.html);
  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    let url;
    try {
      url = new URL(href, origin);
    } catch {
      return;
    }
    if (url.origin !== origin) return;
    url.hash = "";
    internal.add(url.href);
  });
}

const home = htmlByLabel.get("homepage") ?? "";
if (!protectedPreview) {
mustContain("homepage", home, latest.weekLabel);
for (const item of now.items) mustContain("homepage", home, item);
const reviewHtml = htmlByLabel.get("latest review") ?? "";
mustContain("latest review", reviewHtml, latest.weekLabel);
mustContain("latest review", reviewHtml, latestReview.lastUpdated);
for (const headline of headlines) mustContain("latest review", reviewHtml, headline);
mustContain("archive", htmlByLabel.get("archive") ?? "", latest.weekEnding);
mustContain("previous review", htmlByLabel.get("previous review") ?? "", previous.weekLabel);
mustContain("timeline entry", htmlByLabel.get("timeline entry") ?? "", headlines[0]);
}

let internalOk = 0;
for (const url of internal) {
  try {
    const status = await statusOf(url);
    if (status >= 200 && status < 400) internalOk += 1;
    else fail(`internal ${status} ${url}`);
  } catch (error) {
    fail(`internal fetch failed ${url}: ${error.message}`);
  }
}

const sourceHrefs = new Set();
for (const week of [latest.weekEnding, previous.weekEnding]) {
  const data = readJson(`weekly-reviews/data/${week}.json`);
  for (const article of data.eventSections.flatMap((section) => section.articles)) {
    for (const source of article.sourceLinks ?? []) sourceHrefs.add(source.href);
  }
}
let externalOk = 0;
let externalBlocked = 0;
for (const url of sourceHrefs) {
  try {
    const status = await statusOf(url);
    if (status >= 200 && status < 400) externalOk += 1;
    else if (status === 401 || status === 403 || status === 429) {
      externalBlocked += 1;
      warn(`source blocked ${status} ${url}`);
    } else fail(`source ${status} ${url}`);
  } catch (error) {
    fail(`source fetch failed ${url}: ${error.message}`);
  }
}

async function checkVisuals() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    if (wantVisual) fail("playwright is not installed; run npx playwright install chromium");
    else warn("visual browser check skipped (pass --visual after installing playwright)");
    return;
  }
  fs.mkdirSync(shotDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const targets = [
      { path: "/", name: "home" },
      { path: now.weekly_review_href, name: "review" },
    ];
    for (const viewport of [
      { width: 1440, height: 900, suffix: "desktop" },
      { width: 390, height: 844, suffix: "mobile" },
    ]) {
      const page = await browser.newPage({ viewport });
      if (bypass) await page.setExtraHTTPHeaders({ "x-vercel-protection-bypass": bypass });
      for (const target of targets) {
        const url = new URL(target.path, origin).href;
        let response;
        try {
          response = await page.goto(url, { waitUntil: "load", timeout: 30000 });
        } catch (error) {
          fail(`visual ${target.name} ${viewport.suffix} did not load: ${error.message}`);
          continue;
        }
        if (!response || response.status() !== 200) fail(`visual ${target.name} ${viewport.suffix} status ${response?.status()}`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (overflow > 1) fail(`${target.name} overflows by ${overflow}px at ${viewport.width}px`);
        await page.screenshot({ path: path.join(shotDir, `${target.name}-${viewport.suffix}.png`), fullPage: false });
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

await checkVisuals();

async function vercelApi(pathname, { method = "GET", body, query = {} } = {}) {
  const url = new URL(pathname, "https://api.vercel.com");
  url.searchParams.set("teamId", process.env.VERCEL_TEAM_ID);
  for (const [key, value] of Object.entries(query)) {
    if (value == null) continue;
    url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      "content-type": "application/json",
    },
  });
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }
  if (!response.ok) {
    const error = new Error(`Vercel ${response.status} ${pathname}: ${text.slice(0, 240)}`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function resolveThreads() {
  if (!wantResolve) return "not requested";
  if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_TEAM_ID || !process.env.VERCEL_PROJECT_ID) {
    warn("toolbar resolve skipped: set VERCEL_TOKEN, VERCEL_TEAM_ID, and VERCEL_PROJECT_ID");
    return "skipped";
  }
  if (!branch) {
    warn("toolbar resolve skipped: pass --branch");
    return "skipped";
  }
  if (failures.length) return "blocked by failures";
  const query = {
    projectId: process.env.VERCEL_PROJECT_ID,
    branch,
    status: "unresolved",
    limit: 100,
  };
  let listed;
  try {
    listed = await vercelApi("/toolbar/threads", { query });
  } catch (error) {
    if (error.status !== 404) throw error;
    listed = await vercelApi("/v1/toolbar/threads", { query });
  }
  const threads = Array.isArray(listed?.threads) ? listed.threads : [];
  const message = "Preview check passed: pages fetched, links checked, and visuals checked. Resolving this thread.";
  for (const thread of threads) {
    const id = thread.id ?? thread.threadId;
    if (!id) continue;
    try {
      await vercelApi(`/toolbar/threads/${encodeURIComponent(id)}/messages`, {
        method: "POST",
        body: { markdown: message },
      });
    } catch (error) {
      warn(`could not reply on ${id}: ${error.message}`);
    }
    await vercelApi(`/toolbar/threads/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: { resolved: true },
    });
  }
  return `${threads.length} resolved`;
}

let resolveResult = "not run";
try {
  resolveResult = await resolveThreads();
} catch (error) {
  fail(`toolbar resolve failed: ${error.message}`);
  resolveResult = "failed";
}

const lines = [
  `# Preview check`,
  ``,
  `- URL: ${origin}`,
  `- Latest week: ${latest.weekEnding}`,
  `- Pages fetched: ${htmlByLabel.size}`,
  `- Internal links ok: ${internalOk}`,
  `- Source links ok: ${externalOk}`,
  `- Source links blocked by the host: ${externalBlocked}`,
  `- Visuals: ${wantVisual ? "browser" : "html markers"}`,
  `- Toolbar threads: ${resolveResult}`,
  ``,
];
if (warnings.length) {
  lines.push(`## Warnings`, ``, ...warnings.map((item) => `- ${item}`), ``);
}
if (failures.length) {
  lines.push(`## Failures`, ``, ...failures.map((item) => `- ${item}`), ``);
} else {
  lines.push(`Passed.`);
}
fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
fs.writeFileSync(summaryPath, `${lines.join("\n")}\n`);
console.log(lines.join("\n"));
process.exit(failures.length ? 1 : 0);
