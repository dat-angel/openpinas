#!/usr/bin/env node
/**
 * apply-theme.cjs
 * Batch-applies the OpenPinas global design theme to all static HTML files:
 *   1. Replaces Source Serif/Sans Pro Google Fonts URL with Inter
 *   2. Adds <link rel="stylesheet" href="/openpinas-theme.css"> (last in <head>)
 *   3. Adds <script src="/openpinas-nav.js" defer></script> (before </body>)
 *
 * Safe to re-run — skips files already themed.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EXCLUDE_DIRS = new Set(["node_modules", ".next", "out", ".git"]);

function findHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findHtmlFiles(full));
    else if (entry.name.endsWith(".html")) results.push(full);
  }
  return results;
}

const INTER_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
const THEME_LINK = '    <link rel="stylesheet" href="/openpinas-theme.css" />';
const NAV_SCRIPT = '  <script src="/openpinas-nav.js" defer></script>';

// Matches the Google Fonts URL for Source Serif/Sans Pro (inline, no newlines in URL)
const SOURCE_FONT_URL_RE =
  /https:\/\/fonts\.googleapis\.com\/css2\?[^"']*Source[^"']*/g;

const files = findHtmlFiles(ROOT);
let updated = 0;
let skipped = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, "utf8");

  // Skip if already themed
  if (content.includes("/openpinas-theme.css")) {
    skipped++;
    continue;
  }

  // 1. Replace Source font URL with Inter
  if (SOURCE_FONT_URL_RE.test(content)) {
    content = content.replace(SOURCE_FONT_URL_RE, INTER_URL);
  }
  // Reset lastIndex after test()
  SOURCE_FONT_URL_RE.lastIndex = 0;

  // 2. Add theme CSS as last link before </head>
  content = content.replace("</head>", THEME_LINK + "\n  </head>");

  // 3. Add nav script before </body>
  content = content.replace("</body>", NAV_SCRIPT + "\n</body>");

  fs.writeFileSync(filePath, content, "utf8");
  updated++;
  console.log("  updated:", path.relative(ROOT, filePath));
}

console.log(`\nDone. ${updated} files updated, ${skipped} already themed.`);
