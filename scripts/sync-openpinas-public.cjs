/**
 * Copies assets needed for static export + dev into public/.
 * Run via predev/prebuild from package.json.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function copy(srcRel, destRel) {
  const src = path.join(root, srcRel);
  const dest = path.join(root, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

copy("interactive-timeline/styles.css", "public/interactive-timeline/styles.css");
copy("corruption-tracker/css/styles.css", "public/corruption-tracker/css/styles.css");

// Legacy visualizations fetch these by root-relative path at runtime, and the
// visualization shells link to them as downloadable data.
for (const file of [
  "business-connections-2025.json",
  "elite-schools-influence-2025.json",
  "philippine-political-dynasties-network-2025.json",
  "philippine-startup-ecosystem-2025.json",
  "pogo-corruption-cases-2025.json",
  "regional-data.json",
]) {
  copy(file, path.join("public", file));
}

const dynastyDestDir = path.join(root, "public/dynasty-map");
fs.mkdirSync(dynastyDestDir, { recursive: true });

copy(
  "philippine-political-dynasties-network-2025.json",
  "public/dynasty-map/philippine-political-dynasties-network-2025.json"
);
copy("philippines-2026-timeline.json", "public/dynasty-map/philippines-2026-timeline.json");
