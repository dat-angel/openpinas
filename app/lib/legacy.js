import path from 'node:path';
import { promises as fs } from 'node:fs';

const IGNORE_DIRS = new Set(['.git', 'node_modules', '.next', 'out']);

export async function collectHtmlFiles(rootDir) {
  const out = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (IGNORE_DIRS.has(entry.name)) continue;
        await walk(path.join(dir, entry.name));
        continue;
      }
      if (!entry.name.endsWith('.html')) continue;
      const abs = path.join(dir, entry.name);
      const rel = path.relative(rootDir, abs).replaceAll('\\', '/');
      out.push(rel);
    }
  }

  await walk(rootDir);
  return out.sort();
}

export function routeFromFile(rel) {
  if (rel === 'index.html') return '/';
  return '/' + rel;
}

export function fileFromSlug(slug) {
  if (!slug || slug.length === 0) return 'index.html';
  return slug.join('/');
}

export function computeBaseHref(filePath) {
  const idx = filePath.lastIndexOf('/');
  if (idx === -1) return '/';
  return '/' + filePath.slice(0, idx + 1);
}

export function prepareSrcDoc(rawHtml, baseHref) {
  const baseTag = `<base href="${baseHref}" target="_top" />`;
  const analyticsTag = '<script defer src="/_vercel/insights/script.js"></script>';
  const mobileFixTag = '<link rel="stylesheet" href="/legacy-mobile-fix.css" />';
  if (rawHtml.includes('<head>')) {
    let out = rawHtml.replace('<head>', `<head>\n    ${baseTag}`, 1);
    if (!out.includes('/_vercel/insights/script.js')) {
      out = out.replace('<head>', `<head>\n    ${analyticsTag}`, 1);
    }
    if (!out.includes('legacy-mobile-fix.css')) {
      out = out.replace('</head>', `  ${mobileFixTag}\n  </head>`);
    }
    return out;
  }
  return `${baseTag}\n${analyticsTag}\n${mobileFixTag}\n${rawHtml}`;
}

export async function readLegacyHtml(rootDir, relPath) {
  const abs = path.join(rootDir, relPath);
  return fs.readFile(abs, 'utf8');
}

// Helpful for auditing path parity during migration.
export const KNOWN_HTML_PATHS = [
  'business-connections-network-visualization.html',
  'corruption-tracker/cases/alice-guo.html',
  'corruption-tracker/cases/flood-control.html',
  'corruption-tracker/cases/index.html',
  'corruption-tracker/cases/pogo-tax.html',
  'corruption-tracker/cases/pogo-trafficking.html',
  'corruption-tracker/flood-control-network.html',
  'corruption-tracker/index.html',
  'corruption-tracker/map.html',
  'corruption-tracker/network.html',
  'docs/business-connections/index.html',
  'dynasties-network-visualization.html',
  'dynasties/aquino.html',
  'dynasties/arroyo.html',
  'dynasties/binay.html',
  'dynasties/duterte.html',
  'dynasties/dy.html',
  'dynasties/estrada.html',
  'dynasties/index.html',
  'dynasties/marcos-romualdez.html',
  'dynasties/pacquiao.html',
  'dynasties/revilla-tolentino.html',
  'dynasties/singson.html',
  'dynasties/tulfo.html',
  'dynasties/villar.html',
  'elite-schools-influence-visualization.html',
  'interactive-timeline/index.html',
  'monthly-reviews/index.html',
  'monthly-reviews/monthly-review-2026-01.html',
  'monthly-reviews/monthly-review-template.html',
  'regional-visualization.html',
  'sources-and-related-projects.html',
  'startup-ecosystem-visualization.html',
  'weekly-reviews/index.html',
  'weekly-reviews/weekly-review-2026-01-02.html',
  'weekly-reviews/weekly-review-2026-01-09.html',
  'weekly-reviews/weekly-review-2026-01-16.html',
  'weekly-reviews/weekly-review-2026-01-24.html',
  'weekly-reviews/weekly-review-2026-01-31.html',
  'weekly-reviews/weekly-review-2026-02-08.html',
  'weekly-reviews/weekly-review-2026-02-15.html',
  'weekly-reviews/weekly-review-2026-02-22.html',
  'weekly-reviews/weekly-review-2026-02-28.html',
  'weekly-reviews/weekly-review-2026-03-07.html',
  'weekly-reviews/weekly-review-2026-03-14.html',
  'weekly-reviews/weekly-review-2026-03-21.html',
  'weekly-reviews/weekly-review-2026-03-29.html',
  'weekly-reviews/weekly-review-template.html',
  'when-to-go-manila.html'
];
