const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const nextRoutesManifest = path.join(repoRoot, ".next", "routes-manifest.json");
const outRoutesManifest = path.join(repoRoot, "out", "routes-manifest.json");

try {
  if (!fs.existsSync(nextRoutesManifest)) {
    console.warn(
      "[postbuild] .next/routes-manifest.json not found; skipping out/routes-manifest.json copy."
    );
    process.exit(0);
  }

  fs.mkdirSync(path.dirname(outRoutesManifest), { recursive: true });
  fs.copyFileSync(nextRoutesManifest, outRoutesManifest);
  console.log("[postbuild] Copied out/routes-manifest.json from .next/");
} catch (err) {
  console.warn("[postbuild] Failed to copy out/routes-manifest.json:", err?.message || err);
}

