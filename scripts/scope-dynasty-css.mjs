import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const html = fs.readFileSync(
  path.join(root, "dynasties-network-visualization.html"),
  "utf8",
);
const m = html.match(/<style>\n([\s\S]*?)\n  <\/style>/);
if (!m) throw new Error("no style block");
const raw = m[1];

let out = "/* Scoped for Next.js — generated from dynasties-network-visualization.html */\n";
let depth = 0;
for (const line of raw.split("\n")) {
  const t = line.trim();
  if (!t) {
    out += line + "\n";
    continue;
  }
  if (t.startsWith("@media")) {
    out += line + "\n";
    depth += 1;
    continue;
  }
  if (t === "}") {
    depth = Math.max(0, depth - 1);
    out += line + "\n";
    continue;
  }
  const open = t.indexOf("{");
  if (open !== -1 && depth === 0) {
    const sel = t.slice(0, open).trim();
    const rest = t.slice(open);
    if (sel === "*") {
      out += line.replace("*", ".dynastyMapRoot *") + "\n";
    } else if (sel === "body") {
      out += line.replace(/body\s*\{/, ".dynastyMapRoot {") + "\n";
    } else if (!sel.startsWith(".dynastyMapRoot")) {
      const indent = line.match(/^\s*/)[0];
      out += `${indent}.dynastyMapRoot ${sel} ${rest}\n`;
    } else {
      out += line + "\n";
    }
    continue;
  }
  out += line + "\n";
}

const dest = path.join(root, "app/dynasty-map/dynasty-map.css");
fs.writeFileSync(dest, out);
console.log("Wrote", dest);
