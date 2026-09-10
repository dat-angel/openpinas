#!/usr/bin/env node
// Audit a contiguous range of Saturday editions and their timeline references.
// Usage: node scripts/validate-weekly-coverage.mjs 2026-06-27 2026-09-05
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const [first, last] = process.argv.slice(2);
const date = (value) => {
  assert.match(value ?? "", /^\d{4}-\d{2}-\d{2}$/);
  const result = new Date(`${value}T00:00:00Z`);
  assert.equal(result.toISOString().slice(0, 10), value);
  return result;
};
const begin = date(first);
const finish = date(last);
assert(begin <= finish, "Range must be ascending");
assert.equal(begin.getUTCDay(), 6, "Start must be Saturday");
assert.equal(finish.getUTCDay(), 6, "End must be Saturday");
const manifest = read("weekly-reviews/data/manifest.json");
assert.equal(manifest.version, 1);
const entries = manifest.reviews;
const dates = entries.map((entry) => entry.weekEnding);
assert.equal(new Set(dates).size, dates.length, "Duplicate manifest date");
assert.deepEqual(dates, [...dates].sort().reverse(), "Manifest order");
const regular = entries.filter((entry) => entry.editionType !== "special");
const timeline = read("philippines-2026-timeline.json");
assert.equal(timeline.metadata.total_events, timeline.timeline.length);
const dynastyIds = new Set(read("philippine-political-dynasties-network-2025.json")
  .philippine_political_dynasties_network.nodes.dynasties.map((d) => d.id));
const storyKeys = new Set();
let editions = 0;
let stories = 0;
for (const cursor = new Date(begin); cursor <= finish; cursor.setUTCDate(cursor.getUTCDate() + 7)) {
  const week = cursor.toISOString().slice(0, 10);
  const entry = regular.find((item) => item.weekEnding === week);
  assert(entry, `Missing regular edition ${week}`);
  const data = read(`weekly-reviews/data/${week}.json`);
  assert.equal(data.version, 1);
  assert.equal(data.weekEnding, week);
  assert.equal(data.weekLabel, entry.weekLabel);
  assert(Number.isFinite(Date.parse(data.lastUpdated)), `${week}: preparation date`);
  assert(Date.parse(data.lastUpdated) >= cursor.getTime(), `${week}: prepared before close`);
  const earlier = regular[regular.indexOf(entry) + 1]?.weekEnding ?? null;
  assert.equal(entry.prevWeekEnding, earlier, `${week}: manifest previous edition`);
  assert.equal(data.prevWeekEnding, earlier, `${week}: review previous edition`);
  const articles = data.eventSections.flatMap((s) => s.articles);
  assert(articles.length >= 5 && articles.length <= 8, `${week}: grouped story count`);
  assert.equal(entry.eventCount, articles.length, `${week}: manifest article count`);
  assert.equal(Number(data.stats.find((s) => s.label === "Stories")?.number), articles.length);
  const start = new Date(cursor);
  start.setUTCDate(start.getUTCDate() - 6);
  const startISO = start.toISOString().slice(0, 10);
  const reviewPath = `weekly-reviews/weekly-review-${week}.html`;
  const assigned = timeline.timeline.filter((event) => event.weekly_review === reviewPath);
  assert.equal(assigned.length, articles.length, `${week}: timeline count`);
  for (const article of articles) {
    const key = `${article.timeDatetime}|${article.headline}`;
    assert(!storyKeys.has(key), `${week}: duplicate story ${key}`);
    storyKeys.add(key);
    assert(article.timeDatetime >= startISO && article.timeDatetime <= week, `${key}: outside week`);
    const matching = timeline.timeline.filter((e) => e.date === article.timeDatetime && e.title === article.headline);
    assert.equal(matching.length, 1, `${key}: missing or duplicate timeline event`);
    const event = matching[0];
    assert.equal(event.weekly_review, reviewPath);
    assert.equal(event.category, article.category);
    const href = new URL(article.headlineHref, "https://openpinas.test");
    assert.equal(href.pathname, "/interactive-timeline/index.html");
    assert.equal(href.searchParams.get("date"), event.date);
    assert.equal(href.searchParams.get("search"), event.title);
    assert(article.sourceLinks.length, `${key}: no sources`);
    for (const source of article.sourceLinks) {
      assert.equal(new URL(source.href).protocol, "https:");
      assert([...event.sources.local, ...event.sources.international].includes(source.href), `${key}: source missing from timeline`);
    }
    const linkedIds = (article.dynastyLinks ?? []).map((link) => link.href.split("#dynasty-")[1]).sort();
    assert.deepEqual(linkedIds, [...event.mentioned_dynasties].sort(), `${key}: dynasty link mismatch`);
    for (const id of linkedIds) assert(dynastyIds.has(id), `${key}: unknown dynasty ${id}`);
  }
  editions++;
  stories += articles.length;
}
const now = read("content/now-developing.json");
assert.equal(now.weekly_review_href, `/weekly-reviews/weekly-review-${regular[0].weekEnding}.html`, "Homepage must use newest regular edition");
assert.equal(now.updated, regular[0].weekEnding, "Homepage coverage date");
console.log(`✓ ${editions} contiguous editions, ${stories} stories: dates, counts, ordering, navigation, timeline/source/dynasty links and homepage verified`);
