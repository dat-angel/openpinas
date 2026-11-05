import paxSilica from "@/content/special-reports/pax-silica.json";

export const SPECIAL_REPORTS = [paxSilica];

export function specialReportHref(report) {
  return `/special-reports/${report.slug}`;
}

/**
 * The special report to feature on the homepage and nav, if any.
 * Controlled by `feature.active` in the report JSON, so the same commit always
 * builds the same site. Turn it off by setting `active` to false; `planned_end`
 * is a reminder, not a switch.
 */
export function getFeaturedSpecialReport() {
  const hit = SPECIAL_REPORTS.find((r) => r.feature && r.feature.active === true);
  if (!hit) return null;
  return { ...hit.feature, href: specialReportHref(hit) };
}

/** Attach full source records to each item's source ids. */
export function resolveSources(report, ids = []) {
  return ids.map((id) => ({ id, ...report.sources[id] })).filter((s) => s.url);
}
