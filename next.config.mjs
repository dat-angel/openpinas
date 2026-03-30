import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  // Pin repo root so a parent-directory lockfile (e.g. pnpm) is not treated as the workspace root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
