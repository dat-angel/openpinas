import paxSilica from "@/content/special-reports/pax-silica.json";

export const SPECIAL_REPORTS = [paxSilica];

export function specialReportHref(report) {
  return `/special-reports/${report.slug}`;
}

/** Today's date as YYYY-MM-DD in Manila time. Static export evaluates this at build time. */
function manilaToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(now);
}

/**
 * The special report to feature on the homepage and nav, if one is inside its window.
 * The site is a static export, so the window is checked when the site builds.
 */
export function getFeaturedSpecialReport(now = new Date()) {
  const today = manilaToday(now);
  const hit = SPECIAL_REPORTS.find(
    (r) => r.feature && r.feature.show_from <= today && today <= r.feature.show_until
  );
  if (!hit) return null;
  return { ...hit.feature, href: specialReportHref(hit) };
}

/** Attach full source records to each item's source ids. */
export function resolveSources(report, ids = []) {
  return ids.map((id) => ({ id, ...report.sources[id] })).filter((s) => s.url);
}
