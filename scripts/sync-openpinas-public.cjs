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

const dynastySrc = path.join(root, "dynasties-network-visualization.html");
let dynastyHtml = fs.readFileSync(dynastySrc, "utf8");
dynastyHtml = dynastyHtml.split('href="../index.html"').join('href="/"');
dynastyHtml = dynastyHtml.split('href="../interactive-timeline/"').join('href="/interactive-timeline/index.html"');
const dynastyDestDir = path.join(root, "public/dynasty-map");
fs.mkdirSync(dynastyDestDir, { recursive: true });
fs.writeFileSync(path.join(dynastyDestDir, "index.html"), dynastyHtml);

copy(
  "philippine-political-dynasties-network-2025.json",
  "public/dynasty-map/philippine-political-dynasties-network-2025.json"
);
copy("philippines-2026-timeline.json", "public/dynasty-map/philippines-2026-timeline.json");
