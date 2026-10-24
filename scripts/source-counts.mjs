#!/usr/bin/env node
/**
 * Count external citation URLs in published OpenPinas JSON datasets.
 *
 * Counting rule: every http(s) URL occurrence is counted. The same URL
 * repeated in one file or across files counts each time. Relative paths
 * and OpenPinas self-links are ignored.
 *
 * generated_date is the latest last_updated / lastUpdated value found in
 * the scanned files (not the clock). Same inputs always write the same bytes.
 *
 * Usage: node scripts/source-counts.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_FILE = path.join(ROOT, "data", "source-counts.json");

const URL_RE = /https?:\/\/[^\s"'<>\\)\]]+/gi;

const PUBLIC_SUFFIXES = new Set([
  "com.ph",
  "gov.ph",
  "edu.ph",
  "org.ph",
  "net.ph",
  "co.uk",
]);

const OUTLET_BY_DOMAIN = {
  "gmanetwork.com": "GMA",
  "philstar.com": "Philstar",
  "rappler.com": "Rappler",
  "inquirer.net": "Inquirer",
  "pna.gov.ph": "PNA",
  "mb.com.ph": "Manila Bulletin",
  "abs-cbn.com": "ABS-CBN",
  "bilyonaryo.com": "Bilyonaryo",
  "pcij.org": "PCIJ",
  "reuters.com": "Reuters",
  "apnews.com": "AP",
  "scmp.com": "SCMP",
  "theguardian.com": "The Guardian",
  "time.com": "Time",
  "verafiles.org": "Vera Files",
  "cmfr-phil.org": "CMFR",
  "politiko.com.ph": "Politiko",
  "diskurso.ph": "Diskurso",
  "manilatimes.net": "Manila Times",
  "tribune.net.ph": "Tribune",
  "bworldonline.com": "BusinessWorld",
  "businessmirror.com.ph": "BusinessMirror",
  "pia.gov.ph": "PIA",
  "pco.gov.ph": "PCO",
  "aljazeera.com": "Al Jazeera",
  "bloomberg.com": "Bloomberg",
  "wikipedia.org": "Wikipedia",
  "senate.gov.ph": "Senate of the Philippines",
  "congress.gov.ph": "House of Representatives",
};

const SKIP_HOST_SUFFIXES = [
  "openpinas.dev",
  "localhost",
  "127.0.0.1",
];

const SKIP_HOSTS = new Set([
  "github.com",
  "raw.githubusercontent.com",
  "dat-angel.github.io",
]);

const DATASET_FILES = [
  "philippines-2026-timeline.json",
  "philippines-2025-timeline.json",
  "philippine-political-dynasties-network-2025.json",
  "business-connections-2025.json",
  "elite-schools-influence-2025.json",
  "regional-data.json",
  "pogo-corruption-cases-2025.json",
  "philippine-startup-ecosystem-2025.json",
  "data/php-usd-weekly-2025.json",
  "data/airport-passenger-summary.json",
];

function walkWeeklyReviewFiles() {
  const dir = path.join(ROOT, "weekly-reviews/data");
  return fs
    .readdirSync(dir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort()
    .map((name) => path.join("weekly-reviews/data", name));
}

function extractUrls(value, acc) {
  if (typeof value === "string") {
    const matches = value.match(URL_RE) || [];
    for (const raw of matches) {
      acc.push(raw.replace(/[.,;:]+$/, ""));
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) extractUrls(item, acc);
    return;
  }
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) extractUrls(child, acc);
  }
}

function collectUpdateDates(value, acc) {
  if (!value || typeof value !== "object") return;
  if (typeof value.last_updated === "string") acc.push(value.last_updated);
  if (typeof value.lastUpdated === "string") acc.push(value.lastUpdated);
  if (Array.isArray(value)) {
    for (const item of value) collectUpdateDates(item, acc);
    return;
  }
  for (const child of Object.values(value)) {
    if (child && typeof child === "object") collectUpdateDates(child, acc);
  }
}

function parseFlexibleDate(raw) {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed).toISOString().slice(0, 10);
}

function registrableDomain(hostname) {
  const host = hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  const last2 = parts.slice(-2).join(".");
  if (PUBLIC_SUFFIXES.has(last2)) return parts.slice(-3).join(".");
  return last2;
}

function outletName(domain) {
  if (OUTLET_BY_DOMAIN[domain]) return OUTLET_BY_DOMAIN[domain];
  if (domain.endsWith(".inquirer.net") || domain === "inquirer.net") return "Inquirer";
  if (domain.endsWith(".philstar.com") || domain === "philstar.com") return "Philstar";
  if (domain.endsWith(".gmanetwork.com") || domain === "gmanetwork.com") return "GMA";
  return domain;
}

function shouldSkipHost(hostname) {
  const host = hostname.toLowerCase();
  if (SKIP_HOSTS.has(host)) return true;
  return SKIP_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
}

function isExternalHttpUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
  if (shouldSkipHost(parsed.hostname)) return false;
  return true;
}

function compareOutlet(a, b) {
  if (b.count !== a.count) return b.count - a.count;
  return a.name.localeCompare(b.name);
}

function main() {
  const files = [...DATASET_FILES, ...walkWeeklyReviewFiles()];
  const counts = new Map();
  const dates = [];
  let totalLinks = 0;

  for (const rel of files) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) continue;
    const data = JSON.parse(fs.readFileSync(abs, "utf8"));
    collectUpdateDates(data, dates);
    const urls = [];
    extractUrls(data, urls);
    for (const url of urls) {
      if (!isExternalHttpUrl(url)) continue;
      const domain = registrableDomain(new URL(url).hostname);
      const name = outletName(domain);
      counts.set(name, (counts.get(name) ?? 0) + 1);
      totalLinks += 1;
    }
  }

  const parsedDates = dates.map(parseFlexibleDate).filter(Boolean).sort();
  const generatedDate = parsedDates.at(-1) ?? "unknown";

  const ranked = [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort(compareOutlet);

  const top = ranked.slice(0, 15);
  const otherCount = ranked.slice(15).reduce((sum, row) => sum + row.count, 0);
  const chart = otherCount > 0 ? [...top, { name: "Other", count: otherCount }] : top;

  const output = {
    generated_date: generatedDate,
    generated_date_note:
      "Latest last_updated/lastUpdated date among scanned JSON files. Not a build timestamp.",
    counting_rule:
      "Every external http(s) URL occurrence is counted. A URL repeated across files or within a file counts each time. Relative paths and OpenPinas/GitHub self-links are excluded.",
    total_links: totalLinks,
    outlet_count: ranked.length,
    files_scanned: files.filter((rel) => fs.existsSync(path.join(ROOT, rel))),
    chart,
    outlets: ranked,
  };

  const json = `${JSON.stringify(output, null, 2)}\n`;
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, json);
  console.log(`Wrote ${path.relative(ROOT, OUT_FILE)} (${totalLinks} links, ${ranked.length} outlets, date ${generatedDate})`);
}

main();
