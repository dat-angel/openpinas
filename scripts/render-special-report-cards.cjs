/**
 * Renders the Instagram (1080×1350) and TikTok/Reels (1080×1920) share cards for a
 * special report from its content JSON, into public/special-reports/<slug>/.
 *
 * Usage: node scripts/render-special-report-cards.cjs pax-silica
 * Needs Playwright with Chromium available (npx playwright install chromium).
 * Not part of the build: rerun it after editing the report JSON and commit the PNGs.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const slug = process.argv[2] || "pax-silica";
const report = JSON.parse(
  fs.readFileSync(path.join(root, "content/special-reports", `${slug}.json`), "utf8")
);
const outDir = path.join(root, "public/special-reports", slug);

const SIZES = { ig: [1080, 1350], tiktok: [1080, 1920] };
const esc = (v) =>
  String(v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function outlets(ids) {
  return [...new Set(ids.map((id) => report.sources[id]?.outlet).filter(Boolean))].join(" · ");
}

function shell(body, footerSources, h) {
  const tall = h > 1500;
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
body{margin:0;width:1080px;height:${h}px;background:#1a1a72;color:#fff;font-family:Inter,system-ui,sans-serif;
display:flex;flex-direction:column;justify-content:space-between;padding:${tall ? "200px 160px 400px 90px" : "90px"}}
.k{font-size:30px;letter-spacing:.14em;text-transform:uppercase;color:#b9b9ff;font-weight:700}
h1{font-size:${tall ? 124 : 108}px;line-height:.98;letter-spacing:-.035em;margin:28px 0 0;font-weight:800}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:32px}
.n{background:rgba(255,255,255,.08);border-radius:20px;padding:34px}
.n b{display:block;font-size:76px;letter-spacing:-.03em;line-height:1.05}.n span{font-size:29px;color:#d8d8ff;line-height:1.3}
.rows{display:flex;flex-direction:column;gap:${tall ? 26 : 18}px}
.r{display:flex;gap:24px;align-items:flex-start;font-size:${tall ? 36 : 32}px;line-height:1.3}
.p{flex:none;width:210px;font-size:22px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:10px 12px;border-radius:8px;text-align:center}
.done{background:#c9f0dc;color:#0b5c37}.pending{background:#ffe4b8;color:#6b3d00}.flag{background:#ffd5d0;color:#8f1a10}
.claim{font-size:${tall ? 64 : 56}px;font-weight:700;line-height:1.15;letter-spacing:-.02em}
.stamp{display:inline-block;margin:36px 0 28px;font-size:34px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;background:#ffe4b8;color:#6b3d00;padding:14px 22px;border-radius:10px;transform:rotate(-2deg)}
.rec{font-size:${tall ? 38 : 34}px;line-height:1.4;color:#e4e4ff}
.f{display:flex;justify-content:space-between;gap:24px;font-size:25px;color:#b9b9ff}.f b{color:#fff;white-space:nowrap}
.draft{font-size:22px;color:#ffe4b8;margin-top:10px}
</style></head><body>${body}
<div><div class="f"><span>Sources: ${esc(footerSources)}</span><b>openpinas.dev · link in bio</b></div>
${report.status === "draft" ? '<div class="draft">Draft figures, being verified</div>' : ""}</div>
</body></html>`;
}

function cardSigned(h) {
  const items = report.signed_vs_planned;
  const rows = items
    .map((i) => `<div class="r"><span class="p ${i.state}">${esc(i.pill)}</span><span>${esc(i.text)}</span></div>`)
    .join("");
  const body = `<div><div class="k">Pax Silica</div><h1>Signed vs.<br>planned.</h1></div><div class="rows">${rows}</div>`;
  return shell(body, outlets(items.flatMap((i) => i.sources)), h);
}

function cardNumbers(h) {
  const tiles = [
    ["190k", "jobs projected by BCDA"],
    ["₱180B", "a year in revenue, at full build"],
    ["3–5 yrs", "until site work starts"],
    ["10–15 yrs", "until full build-out"],
  ];
  const grid = tiles.map(([b, t]) => `<div class="n"><b>${esc(b)}</b><span>${esc(t)}</span></div>`).join("");
  const body = `<div><div class="k">Pax Silica</div><h1>${esc(report.numbers_headline).replace(", ", ",<br>")}</h1></div><div class="grid">${grid}</div>`;
  const ids = report.numbers.flatMap((n) => n.sources).concat(report.signed_vs_planned.flatMap((i) => i.sources));
  return shell(body, outlets(["inq-jobs", "inq-3to5", "pna-3to5"].filter((id) => ids.includes(id))), h);
}

function cardViral(h) {
  const v = report.viral[0];
  const body = `<div><div class="k">Pax Silica · Viral vs. the record</div></div>
<div><div class="claim">${esc(v.claim)}</div><div class="stamp">${esc(v.label)}</div><div class="rec">${esc(v.record)}</div></div>`;
  return shell(body, outlets(v.sources), h);
}

const CARDS = { signed: cardSigned, numbers: cardNumbers, viral: cardViral };

(async () => {
  const { chromium } = require("playwright");
  fs.mkdirSync(outDir, { recursive: true });
  // Set CHROMIUM_PATH to use a Chromium other than the one bundled with Playwright.
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
  );
  for (const [name, build] of Object.entries(CARDS)) {
    for (const [size, [w, h]] of Object.entries(SIZES)) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      await page.setContent(build(h), { waitUntil: "networkidle" }).catch(() => page.setContent(build(h)));
      const file = path.join(outDir, `${name}-${size}.png`);
      await page.screenshot({ path: file });
      await page.close();
      console.log("wrote", path.relative(root, file));
    }
  }
  await browser.close();
})();
