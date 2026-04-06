import { notFound } from "next/navigation";
import AliceGuoCasePage from "@/app/native/alice-guo-case-page";
import CorruptionTrackerIndexPage from "@/app/native/corruption-tracker-index-page";
import DynastyNetworkMapPage from "@/app/native/dynasty-network-map-page";
import DynastiesIndexPage from "@/app/native/dynasties-index-page";
import InteractiveTimelinePage from "@/app/native/interactive-timeline-page";
import SourcesRelatedProjectsPage from "@/app/native/sources-related-projects-page";
import WeeklyReviewPage from "@/app/native/weekly-review-page";
import WeeklyReviewsIndexPage from "@/app/native/weekly-reviews-index-page";
import WhenToGoManilaPage from "@/app/native/when-to-go-manila-page";
import {
  collectHtmlFiles,
  fileFromSlug,
  computeBaseHref,
  prepareSrcDoc,
  readLegacyHtml,
} from "@/app/lib/legacy";
import { readWeeklyManifest } from "@/app/lib/weekly-reviews";

const ROOT = process.cwd();

export const dynamic = "force-static";

export async function generateStaticParams() {
  const files = await collectHtmlFiles(ROOT);
  const htmlSlugs = files
    .filter((f) => f !== "index.html")
    .map((f) => f.split("/"));

  // Also generate routes for JSON-only weekly reviews (no matching HTML file needed)
  const manifest = readWeeklyManifest();
  const existingWeeklyFiles = new Set(files);
  const manifestSlugs = manifest
    .map((r) => `weekly-reviews/weekly-review-${r.weekEnding}.html`)
    .filter((f) => !existingWeeklyFiles.has(f))
    .map((f) => f.split("/"));

  return [...htmlSlugs, ...manifestSlugs];
}

export default async function LegacyPage({ params }) {
  const resolvedParams = await params;
  const file = fileFromSlug(resolvedParams.slug);
  if (file === "weekly-reviews/index.html") {
    return <WeeklyReviewsIndexPage />;
  }
  if (file === "dynasties/index.html") {
    return <DynastiesIndexPage />;
  }
  if (file === "interactive-timeline/index.html") {
    return <InteractiveTimelinePage />;
  }
  if (file === "sources-and-related-projects.html") {
    return <SourcesRelatedProjectsPage />;
  }
  if (file === "corruption-tracker/index.html") {
    return <CorruptionTrackerIndexPage />;
  }
  if (file === "when-to-go-manila.html") {
    return <WhenToGoManilaPage />;
  }
  if (file === "dynasties-network-visualization.html") {
    return <DynastyNetworkMapPage />;
  }
  if (file === "corruption-tracker/cases/alice-guo.html") {
    return <AliceGuoCasePage />;
  }
  const weeklyMatch = file.match(/^weekly-reviews\/weekly-review-(\d{4}-\d{2}-\d{2})\.html$/);
  if (weeklyMatch) {
    return <WeeklyReviewPage weekEnding={weeklyMatch[1]} />;
  }

  const all = await collectHtmlFiles(ROOT);
  if (!all.includes(file)) {
    notFound();
  }

  const raw = await readLegacyHtml(ROOT, file);
  const srcDoc = prepareSrcDoc(raw, computeBaseHref(file));

  return (
    <iframe
      title={file}
      srcDoc={srcDoc}
      style={{ border: 0, width: "100vw", height: "100vh", display: "block" }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    />
  );
}
