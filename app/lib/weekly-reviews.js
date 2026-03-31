import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "weekly-reviews", "data");

export function readWeeklyManifest() {
  const p = path.join(DATA_DIR, "manifest.json");
  const raw = fs.readFileSync(p, "utf8");
  const parsed = JSON.parse(raw);
  return parsed.reviews ?? [];
}

export function readWeeklyReviewByDate(weekEnding) {
  const p = path.join(DATA_DIR, `${weekEnding}.json`);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export function isWeeklyReviewDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s ?? "");
}
