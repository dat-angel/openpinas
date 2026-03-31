#!/usr/bin/env node
/**
 * One-time / on-demand: convert weekly-reviews/weekly-review-*.html → weekly-reviews/data/*.json
 * Run from repo root: node scripts/import-weekly-html-to-json.mjs
 * Requires: npm install (devDependency cheerio)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function rewriteHref(href) {
  if (!href) return href;
  if (href.startsWith("../interactive-timeline/?")) {
    return "/interactive-timeline/index.html?" + href.slice("../interactive-timeline/?".length);
  }
  if (href === "../interactive-timeline/" || href === "../interactive-timeline") {
    return "/interactive-timeline/index.html";
  }
  if (href.startsWith("../interactive-timeline/")) {
    const rest = href.replace("../interactive-timeline/", "");
    return `/interactive-timeline/index.html/${rest}`.replace(/\/+$/, "");
  }
  if (href.startsWith("../dynasties-network-visualization.html")) {
    return "/dynasties-network-visualization.html" + href.slice("../dynasties-network-visualization.html".length);
  }
  if (href === "index.html") return "/weekly-reviews/index.html";
  if (href.startsWith("weekly-review-")) return "/weekly-reviews/" + href;
  if (href === "../") return "/";
  return href;
}

function textOrEmpty($el) {
  return $el.text().replace(/\s+/g, " ").trim();
}

function extractStats($, $root) {
  const stats = [];
  $root.find(".summary-stats .stat-card").each((_, el) => {
    const $c = $(el);
    stats.push({
      number: textOrEmpty($c.find(".number")),
      label: textOrEmpty($c.find(".label")),
    });
  });
  return stats;
}

function extractWeather($, $root) {
  const $w = $root.find(".weather-widget").first();
  if (!$w.length) return null;
  const days = [];
  $w.find(".weather-day").each((_, el) => {
    const $d = $(el);
    days.push({
      dateLabel: textOrEmpty($d.find(".day-date")),
      name: textOrEmpty($d.find(".day-name")),
      icon: textOrEmpty($d.find(".weather-icon")),
      high: textOrEmpty($d.find(".high")),
      low: textOrEmpty($d.find(".low")),
    });
  });
  return {
    title: textOrEmpty($w.find("h3").first()),
    days,
    sourceNote: textOrEmpty($w.find(".weather-source")),
  };
}

function extractExchange($, $root) {
  const $box = $root.find(".exchange-rate-box").first();
  if (!$box.length) return null;
  const details = [];
  $box.find(".rate-details .rate-item").each((_, el) => {
    const $r = $(el);
    details.push({
      label: textOrEmpty($r.find(".label")),
      value: textOrEmpty($r.find(".value")),
    });
  });
  const trend = textOrEmpty($box.find(".rate-trend"));
  return {
    title: textOrEmpty($box.find("h3").first()),
    currentRate: textOrEmpty($box.find(".rate-value")),
    trend,
    details,
    contextHtml: $box.find(".rate-context").html()?.trim() ?? "",
    sourceNote: textOrEmpty($box.find(".rate-source")),
  };
}

function extractArticles($, $section) {
  const articles = [];
  $section.find("article.event").each((_, el) => {
    const $a = $(el);
    const style = $a.attr("style") || "";
    const m = style.match(/border-left-color:\s*([^;]+)/);
    const borderColor = m ? m[1].trim() : "";
    const $time = $a.find(".event-header time").first();
    const $badge = $a.find(".category-badge").first();
    const $h2a = $a.find("h2 a").first();
    const dynastyLinks = [];
    $a.find(".dynasties a").each((__, ael) => {
      const $link = $(ael);
      dynastyLinks.push({
        label: textOrEmpty($link),
        href: rewriteHref($link.attr("href") || ""),
      });
    });
    const sourceLinks = [];
    $a.find(".sources a").each((__, ael) => {
      const $link = $(ael);
      sourceLinks.push({
        label: textOrEmpty($link),
        href: $link.attr("href") || "",
      });
    });
    articles.push({
      timeDatetime: $time.attr("datetime") || "",
      timeDisplay: textOrEmpty($time),
      category: textOrEmpty($badge),
      categoryClass: ($badge.attr("class") || "").replace("category-badge", "").trim(),
      borderColor,
      headline: textOrEmpty($h2a),
      headlineHref: rewriteHref($h2a.attr("href") || ""),
      descriptionHtml: $a.find("p.description").html()?.trim() ?? "",
      significance: textOrEmpty($a.find(".significance")).replace(/^Significance:\s*/i, ""),
      diasporaImpact: textOrEmpty($a.find(".diaspora-impact")).replace(/^Diaspora Impact:\s*/i, ""),
      dynastyLinks,
      sourceLinks,
    });
  });
  return articles;
}

function extractOfw($, $main) {
  const $ofw = $main.find("section.ofw-section").first();
  if (!$ofw.length) return null;
  const stats = [];
  $ofw.find(".ofw-stat").each((_, el) => {
    const $s = $(el);
    stats.push({
      number: textOrEmpty($s.find(".number")),
      label: textOrEmpty($s.find(".label")),
    });
  });
  const stories = [];
  $ofw.find("article.ofw-story").each((_, el) => {
    const $st = $(el);
    const $det = $st.find(".ofw-details");
    stories.push({
      title: textOrEmpty($st.find("h3").first()),
      bodyHtml: $st.find("p").first().html()?.trim() ?? "",
      details: {
        label: textOrEmpty($det.find("span").first()),
        href: $det.find("a").attr("href") || "",
      },
    });
  });
  const advisoryItems = [];
  $ofw.find(".travel-advisory li").each((_, el) => {
    advisoryItems.push(textOrEmpty($(el)));
  });
  return {
    title: textOrEmpty($ofw.find("> h2").first()),
    stats,
    stories,
    travelAdvisories: {
      title: textOrEmpty($ofw.find(".travel-advisory h4").first()),
      items: advisoryItems,
    },
  };
}

function extractDynastyHighlights($, $main) {
  const $dh = $main.find("section.dynasty-highlights").first();
  if (!$dh.length) return null;
  const items = [];
  $dh.find(".dynasty-item").each((_, el) => {
    const $it = $(el);
    const $strongA = $it.find("strong a").first();
    const bullets = [];
    $it.find("ul li a").each((__, ael) => {
      const $la = $(ael);
      bullets.push({
        text: textOrEmpty($la),
        href: rewriteHref($la.attr("href") || ""),
      });
    });
    const subHtml = $it.find("p").first().html()?.trim() ?? "";
    items.push({
      title: textOrEmpty($strongA),
      titleHref: rewriteHref($strongA.attr("href") || ""),
      bodyHtml: subHtml,
      bullets,
    });
  });
  return {
    title: textOrEmpty($dh.find("> h3").first()),
    items,
  };
}

function parseWeeklyHtml(html, weekEnding) {
  const $ = cheerio.load(html);
  const $main = $("main").first();
  const weekRange = textOrEmpty($(".week-range").first());
  const title = textOrEmpty($("header h1").first());
  let prevWeekFile = null;
  $("header nav.nav-links a").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (href.startsWith("weekly-review-") && href.endsWith(".html")) prevWeekFile = href;
  });

  const footerP = $("footer p").last().text();
  const lum = footerP.match(/Last updated:\s*(.+)/i);
  const lastUpdated = lum ? lum[1].trim() : "";

  const eventSections = [];
  $main.find("section.section").each((_, el) => {
    const $sec = $(el);
    const secTitle = textOrEmpty($sec.find("h2.section-title").first());
    if (!secTitle) return;
    eventSections.push({
      title: secTitle,
      articles: extractArticles($, $sec),
    });
  });

  return {
    version: 1,
    weekEnding,
    weekLabel: weekRange.replace(/^Week of\s+/i, ""),
    title,
    lastUpdated,
    prevWeekFile,
    stats: extractStats($, $main),
    weather: extractWeather($, $main),
    exchangeRate: extractExchange($, $main),
    eventSections,
    ofwSection: extractOfw($, $main),
    dynastyHighlights: extractDynastyHighlights($, $main),
  };
}

function main() {
  const weeklyDir = path.join(ROOT, "weekly-reviews");
  const outDir = path.join(ROOT, "weekly-reviews/data");
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs
    .readdirSync(weeklyDir)
    .filter((f) => /^weekly-review-\d{4}-\d{2}-\d{2}\.html$/.test(f))
    .sort();

  for (const file of files) {
    const m = file.match(/weekly-review-(\d{4}-\d{2}-\d{2})\.html/);
    const weekEnding = m[1];
    const abs = path.join(weeklyDir, file);
    const html = fs.readFileSync(abs, "utf8");
    const data = parseWeeklyHtml(html, weekEnding);
    const outPath = path.join(outDir, `${weekEnding}.json`);
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");
    console.log("Wrote", path.relative(ROOT, outPath));
  }

  const asc = files
    .map((f) => f.match(/weekly-review-(\d{4}-\d{2}-\d{2})\.html/)[1])
    .sort();
  const desc = [...asc].reverse();
  const reviews = desc.map((weekEnding, idx) => {
    const data = JSON.parse(fs.readFileSync(path.join(outDir, `${weekEnding}.json`), "utf8"));
    const stats = data.stats ?? [];
    const total = stats.find((s) => /total/i.test(s.label))?.number ?? "";
    const older = desc[idx + 1] ?? null;
    return {
      weekEnding,
      weekLabel: data.weekLabel,
      eventCount: total ? Number(total) : null,
      prevWeekEnding: older,
    };
  });

  const manifest = { version: 1, reviews };
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log("Wrote", path.relative(ROOT, path.join(outDir, "manifest.json")));
}

main();
