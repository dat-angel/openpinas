import timelineData from "@/philippines-2026-timeline.json";
import dynastyData from "@/philippine-political-dynasties-network-2025.json";
import { readWeeklyManifest, readWeeklyReviewByDate } from "@/app/lib/weekly-reviews";

const CATEGORY_COLORS = {
  Political: "#3a0ca3",
  Legal: "#1e3a5f",
  Economic: "#3a0ca3",
  "Natural Disasters": "#7b4f12",
  "International Relations": "#0d7377",
  Cultural: "#b23a48",
  Religious: "#d4a017",
  "OFW/Diaspora": "#0b6e4f",
};

const DYNASTIES = dynastyData?.philippine_political_dynasties_network?.nodes?.dynasties ?? [];
const TIMELINE = timelineData?.timeline ?? [];

function reviewSlug(weekEnding) {
  return `weekly-review-${weekEnding}.html`;
}

function timelineHref(event) {
  const q = encodeURIComponent(event.title.slice(0, 60));
  return `/interactive-timeline/index.html?date=${event.date}&search=${q}`;
}

function dynastyHref(id) {
  return `/dynasties-network-visualization.html#dynasty-${id}`;
}

function collectReviewArticles(review) {
  if (!review?.eventSections) return [];
  return review.eventSections.flatMap((section) =>
    (section.articles ?? []).map((a) => ({
      date: a.timeDatetime,
      displayDate: a.timeDisplay,
      category: a.category,
      title: a.headline,
      href: a.headlineHref,
      borderColor: a.borderColor,
    }))
  );
}

function collectDynastyHeadlinesAfter(prevWeekEnding, weekEnding) {
  if (!prevWeekEnding || !weekEnding) return [];
  const items = [];
  for (const dynasty of DYNASTIES) {
    const headlines = dynasty?.["2026_rumors_headlines"] ?? [];
    for (const h of headlines) {
      const d = h.date;
      if (!d || d <= prevWeekEnding || d > weekEnding) continue;
      items.push({
        date: d,
        dynastyId: dynasty.id,
        dynastyName: dynasty.name,
        headline: h.headline,
        category: h.category ?? "update",
        href: dynastyHref(dynasty.id),
        sourceUrl: h.url,
      });
    }
  }
  return items.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * @param {string} weekEnding YYYY-MM-DD
 * @param {string|null} [prevWeekEnding]
 */
export function getWeekChanges(weekEnding, prevWeekEnding = null) {
  const manifest = readWeeklyManifest();
  const meta = manifest.find((r) => r.weekEnding === weekEnding) ?? null;
  const prev = prevWeekEnding ?? meta?.prevWeekEnding ?? null;
  const slug = reviewSlug(weekEnding);

  const timelineThisWeek = TIMELINE.filter((e) => e.weekly_review?.includes(slug)).map((e) => ({
    date: e.date,
    title: e.title,
    category: e.category,
    href: timelineHref(e),
    color: CATEGORY_COLORS[e.category] ?? "#2d2de8",
    dynasties: e.mentioned_dynasties ?? [],
  }));

  const prevSlug = prev ? reviewSlug(prev) : null;
  const prevTitles = new Set(
    prevSlug ? TIMELINE.filter((e) => e.weekly_review?.includes(prevSlug)).map((e) => e.title) : []
  );
  const timelineNew = timelineThisWeek.filter((e) => !prevTitles.has(e.title));

  const review = readWeeklyReviewByDate(weekEnding);
  const prevReview = prev ? readWeeklyReviewByDate(prev) : null;
  const stories = collectReviewArticles(review);
  const prevStoryTitles = new Set(collectReviewArticles(prevReview).map((s) => s.title));
  const storiesNew = stories.filter((s) => !prevStoryTitles.has(s.title));

  const dynastyUpdates = collectDynastyHeadlinesAfter(prev, weekEnding);

  const categoryCounts = {};
  for (const e of timelineNew) {
    categoryCounts[e.category] = (categoryCounts[e.category] ?? 0) + 1;
  }

  return {
    weekEnding,
    weekLabel: review?.weekLabel ?? meta?.weekLabel ?? weekEnding,
    prevWeekEnding: prev,
    prevWeekLabel: prevReview?.weekLabel ?? manifest.find((r) => r.weekEnding === prev)?.weekLabel ?? null,
    counts: {
      timelineNew: timelineNew.length,
      timelineThisWeek: timelineThisWeek.length,
      storiesNew: storiesNew.length,
      storiesTotal: stories.length,
      dynastyUpdates: dynastyUpdates.length,
    },
    categoryCounts,
    timelineNew,
    timelineThisWeek,
    storiesNew,
    dynastyUpdates,
    weeklyReviewHref: `/weekly-reviews/${slug}`,
  };
}
