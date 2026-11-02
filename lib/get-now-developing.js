import raw from "@/content/now-developing.json";

/** Shown if JSON items are missing or empty — safe generic copy. */
export const NOW_DEVELOPING_FALLBACK_ITEMS = [
  "Track how anti-dynasty debates, local elections, and coalition politics interact week to week.",
  "Compare the dynasty map with the timeline when a headline breaks—timing and territory often explain outcomes.",
  "Start from the weekly review when you need narrative context before diving into structured data.",
];

/**
 * @returns {{ label: string, updated: string, items: string[], weeklyReviewHref: string }}
 */
export function getNowDeveloping() {
  const items = Array.isArray(raw?.items) ? raw.items.filter((s) => typeof s === "string" && s.trim()) : [];
  return {
    label: typeof raw?.label === "string" && raw.label.trim() ? raw.label.trim() : "Now Developing",
    updated: typeof raw?.updated === "string" ? raw.updated.trim() : "",
    items: items.length ? items : NOW_DEVELOPING_FALLBACK_ITEMS,
    weeklyReviewHref:
      typeof raw?.weekly_review_href === "string" && raw.weekly_review_href.trim()
        ? raw.weekly_review_href.trim()
        : "/weekly-reviews/index.html",
  };
}
