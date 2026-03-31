#!/usr/bin/env node
/**
 * OpenPinas data + weekly-review manifest validation (replaces Python in validate-openpinas.sh).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function readJson(relPath) {
  const abs = path.join(ROOT, relPath);
  const raw = fs.readFileSync(abs, "utf8");
  return JSON.parse(raw);
}

function tryReadJson(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  const raw = fs.readFileSync(abs, "utf8");
  return JSON.parse(raw);
}

const errors = [];
const warnings = [];

function validateDynasty() {
  try {
    const dynData = readJson("philippine-political-dynasties-network-2025.json");
    const network = dynData.philippine_political_dynasties_network;
    const dynasties = network.nodes.dynasties;
    const metadata = network.metadata;
    const edges = network.edges.relationships;

    const actualCount = dynasties.length;
    const metadataCount = metadata.total_dynasties ?? 0;
    if (actualCount !== metadataCount) {
      errors.push(
        `Dynasty count mismatch: ${actualCount} dynasties in data vs ${metadataCount} in metadata`
      );
    }

    const ids = dynasties.map((d) => d.id);
    if (ids.length !== new Set(ids).size) {
      errors.push("Duplicate dynasty IDs found");
    }

    const dynastyIds = new Set(ids);
    const allowExtra = new Set(["FLOOD_CONTROL_CORRUPTION"]);
    for (const edge of edges) {
      if (!dynastyIds.has(edge.source) && !allowExtra.has(edge.source)) {
        errors.push(`Invalid relationship source: ${edge.source} in ${edge.id ?? "unknown"}`);
      }
      if (!dynastyIds.has(edge.target) && !allowExtra.has(edge.target)) {
        errors.push(`Invalid relationship target: ${edge.target} in ${edge.id ?? "unknown"}`);
      }
    }

    const totalMembers = dynasties.reduce((n, d) => n + (d.key_members?.length ?? 0), 0);
    const metadataMembers = metadata.total_members_tracked ?? 0;
    if (totalMembers !== metadataMembers) {
      warnings.push(
        `Key members count: ${totalMembers} actual vs ${metadataMembers} in metadata`
      );
    }

    console.log(`✓ Dynasties: ${actualCount}`);
    console.log(`✓ Relationships: ${edges.length}`);
    console.log(`✓ Key members: ${totalMembers}`);

    return dynData;
  } catch (e) {
    errors.push(`Dynasty JSON error: ${e.message}`);
    return null;
  }
}

function validateTimeline2025(dynData) {
  try {
    const timelineData = readJson("philippines-2025-timeline.json");
    const events = timelineData.timeline ?? [];
    const metadataEvents = timelineData.metadata?.total_events ?? 0;
    if (events.length !== metadataEvents) {
      warnings.push(
        `2025 timeline events: ${events.length} actual vs ${metadataEvents} in metadata`
      );
    }
    console.log(`✓ 2025 timeline events: ${events.length}`);

    if (dynData) {
      const dynastyIds = new Set(
        dynData.philippine_political_dynasties_network.nodes.dynasties.map((d) => d.id)
      );
      for (const event of events) {
        for (const dynId of event.mentioned_dynasties ?? []) {
          if (!dynastyIds.has(dynId)) {
            errors.push(
              `2025 event '${event.title ?? "unknown"}' (${event.date ?? "unknown"}) references unknown dynasty: ${dynId}`
            );
          }
        }
      }
    }
  } catch (e) {
    errors.push(`2025 timeline JSON error: ${e.message}`);
  }
}

function validateTimeline2026(dynData) {
  try {
    const timeline2026 = readJson("philippines-2026-timeline.json");
    const events = timeline2026.timeline ?? [];
    const metadataCount = timeline2026.metadata?.total_events ?? 0;
    if (events.length !== metadataCount) {
      warnings.push(`2026 timeline events: ${events.length} actual vs ${metadataCount} in metadata`);
    }

    const dates = events.map((e) => e.date ?? "");
    if (dates.join() !== [...dates].sort().join()) {
      errors.push("2026 timeline events are not sorted by date");
    }

    if (dynData) {
      const dynastyIds = new Set(
        dynData.philippine_political_dynasties_network.nodes.dynasties.map((d) => d.id)
      );
      for (const event of events) {
        for (const dynId of event.mentioned_dynasties ?? []) {
          if (!dynastyIds.has(dynId)) {
            errors.push(
              `2026 event '${event.title ?? "unknown"}' (${event.date ?? "unknown"}) references unknown dynasty: ${dynId}`
            );
          }
        }
      }
    }

    const required = ["date", "title", "category", "description"];
    for (const event of events) {
      for (const field of required) {
        if (!event[field]) {
          errors.push(`2026 event missing '${field}': ${event.title ?? "unknown"}`);
        }
      }
    }

    console.log(`✓ 2026 timeline events: ${events.length}`);
  } catch (e) {
    errors.push(`2026 timeline JSON error: ${e.message}`);
  }
}

function validateCorruptionTracker() {
  const corruptionPath = "corruption-tracker/data/pogo-corruption-cases-2025.json";
  try {
    if (!fs.existsSync(path.join(ROOT, corruptionPath))) {
      warnings.push("Corruption tracker JSON not found");
      return;
    }
    const data = readJson(corruptionPath);
    const cases = data.cases ?? [];
    const metadataCases = data.metadata?.total_cases ?? 0;
    if (cases.length !== metadataCases) {
      warnings.push(`Corruption cases: ${cases.length} actual vs ${metadataCases} in metadata`);
    }
    const caseIds = cases.map((c) => c.case_id ?? "");
    if (caseIds.length !== new Set(caseIds).size) {
      errors.push("Duplicate corruption case IDs found");
    }
    console.log(`✓ Corruption cases: ${cases.length}`);
  } catch (e) {
    errors.push(`Corruption tracker JSON error: ${e.message}`);
  }
}

function validateCorruptionRootCopy() {
  const rootPath = "pogo-corruption-cases-2025.json";
  if (!fs.existsSync(path.join(ROOT, rootPath))) return;
  try {
    readJson(rootPath);
    console.log(`✓ Root corruption JSON valid (${rootPath})`);
  } catch (e) {
    errors.push(`Root ${rootPath}: ${e.message}`);
  }
}

function validateRegionalOptional() {
  const p = "regional-data.json";
  if (!fs.existsSync(path.join(ROOT, p))) return;
  try {
    readJson(p);
    console.log(`✓ Regional data JSON valid (${p})`);
  } catch (e) {
    errors.push(`Regional data: ${e.message}`);
  }
}

function validateWeeklyReviews() {
  const manifestPath = "weekly-reviews/data/manifest.json";
  const dataDir = path.join(ROOT, "weekly-reviews/data");
  if (!fs.existsSync(path.join(ROOT, manifestPath))) {
    warnings.push(`Missing ${manifestPath} (weekly review index will not validate)`);
    return;
  }
  let manifest;
  try {
    manifest = readJson(manifestPath);
  } catch (e) {
    errors.push(`Weekly manifest invalid JSON: ${e.message}`);
    return;
  }
  const reviews = manifest.reviews;
  if (!Array.isArray(reviews)) {
    errors.push("weekly-reviews/data/manifest.json: missing reviews array");
    return;
  }
  const seen = new Set();
  for (const entry of reviews) {
    const week = entry.weekEnding;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(week ?? "")) {
      errors.push(`Invalid weekEnding in manifest: ${week}`);
      continue;
    }
    if (seen.has(week)) errors.push(`Duplicate weekEnding in manifest: ${week}`);
    seen.add(week);
    const jsonFile = path.join(dataDir, `${week}.json`);
    if (!fs.existsSync(jsonFile)) {
      errors.push(`Manifest lists ${week} but missing weekly-reviews/data/${week}.json`);
      continue;
    }
    try {
      const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
      if (data.version !== 1) {
        warnings.push(`${week}.json: expected version 1, got ${data.version}`);
      }
      if (data.weekEnding !== week) {
        errors.push(`${week}.json: weekEnding field mismatch (${data.weekEnding})`);
      }
    } catch (e) {
      errors.push(`weekly-reviews/data/${week}.json: ${e.message}`);
    }
  }
  const htmlGlob = fs
    .readdirSync(path.join(ROOT, "weekly-reviews"))
    .filter((f) => /^weekly-review-2026-\d{2}-\d{2}\.html$/.test(f));
  console.log(`✓ Weekly manifest entries: ${reviews.length}`);
  console.log(`✓ Weekly review HTML files: ${htmlGlob.length}`);
}

function main() {
  console.log("=== Validating OpenPinas Data ===\n");

  const dynData = validateDynasty();
  validateTimeline2025(dynData);
  validateTimeline2026(dynData);
  validateCorruptionTracker();
  validateCorruptionRootCopy();
  validateRegionalOptional();
  validateWeeklyReviews();

  console.log("");

  if (warnings.length) {
    console.log("⚠️  WARNINGS:");
    for (const w of warnings) console.log(`  - ${w}`);
    console.log("");
  }

  if (errors.length) {
    console.log("✗ ERRORS FOUND:");
    for (const e of errors) console.log(`  - ${e}`);
    console.log("");
    console.log("Please fix these errors before committing.");
    process.exit(1);
  }

  console.log("✓ All validations passed!");
  if (warnings.length) console.log("(Some metadata may need updating)");
  process.exit(0);
}

main();
