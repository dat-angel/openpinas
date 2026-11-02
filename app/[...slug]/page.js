import { notFound } from "next/navigation";
import AliceGuoCasePage from "@/app/native/alice-guo-case-page";
import BusinessConnectionsPage from "@/app/native/business-connections-page";
import CorruptionTrackerIndexPage from "@/app/native/corruption-tracker-index-page";
import CorruptionMapPage from "@/app/native/corruption-map-page";
import CorruptionNetworkPage from "@/app/native/corruption-network-page";
import DynastyNetworkMapPage from "@/app/native/dynasty-network-map-page";
import DynastiesIndexPage from "@/app/native/dynasties-index-page";
import EliteSchoolsPage from "@/app/native/elite-schools-page";
import InteractiveTimelinePage from "@/app/native/interactive-timeline-page";
import LegacyVisualizationShellPage from "@/app/native/legacy-visualization-shell-page";
import SourcesRelatedProjectsPage from "@/app/native/sources-related-projects-page";
import VisualizationsIndexPage from "@/app/native/visualizations-index-page";
import WeeklyReviewPage from "@/app/native/weekly-review-page";
import WeeklyReviewsIndexPage from "@/app/native/weekly-reviews-index-page";
import WhenToGoManilaPage from "@/app/native/when-to-go-manila-page";
import fs from "node:fs";
import path from "node:path";
import {
  collectHtmlFiles,
  fileFromSlug,
  computeBaseHref,
  prepareSrcDoc,
  readLegacyHtml,
} from "@/app/lib/legacy";

const ROOT = process.cwd();
const MANUAL_NATIVE_ROUTES = ["visualizations/index.html"];

export const dynamic = "force-static";

async function renderLegacyVisualization(file, meta) {
  const raw = await readLegacyHtml(ROOT, file);
  const srcDoc = prepareSrcDoc(raw, computeBaseHref(file));
  return (
    <LegacyVisualizationShellPage
      title={meta.title}
      kicker={meta.kicker}
      description={meta.description}
      srcDoc={srcDoc}
      dataLinks={meta.dataLinks}
      relatedLinks={meta.relatedLinks}
    />
  );
}

export async function generateStaticParams() {
  const files = await collectHtmlFiles(ROOT);
  const htmlSlugs = files
    .filter((f) => f !== "index.html")
    .map((f) => ({ slug: f.split("/") }));

  // Also generate routes for JSON-only weekly reviews (no matching HTML file needed)
  const existingWeeklyFiles = new Set(files);
  try {
    const raw = fs.readFileSync(
      path.join(ROOT, "weekly-reviews", "data", "manifest.json"),
      "utf8"
    );
    const manifestSlugs = (JSON.parse(raw).reviews ?? [])
      .map((r) => `weekly-reviews/weekly-review-${r.weekEnding}.html`)
      .filter((f) => !existingWeeklyFiles.has(f))
      .map((f) => ({ slug: f.split("/") }));
    const manualSlugs = MANUAL_NATIVE_ROUTES.map((f) => ({ slug: f.split("/") }));
    return [...htmlSlugs, ...manifestSlugs, ...manualSlugs];
  } catch {
    const manualSlugs = MANUAL_NATIVE_ROUTES.map((f) => ({ slug: f.split("/") }));
    return [...htmlSlugs, ...manualSlugs];
  }
}

export default async function LegacyPage({ params }) {
  const resolvedParams = await params;
  const file = fileFromSlug(resolvedParams.slug);
  if (file === "weekly-reviews/index.html") {
    return <WeeklyReviewsIndexPage />;
  }
  if (file === "visualizations/index.html") {
    return <VisualizationsIndexPage />;
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
  if (file === "business-connections-network-visualization.html") {
    return <BusinessConnectionsPage />;
  }
  if (file === "elite-schools-influence-visualization.html") {
    return <EliteSchoolsPage />;
  }
  if (file === "corruption-tracker/network.html") {
    return <CorruptionNetworkPage />;
  }
  if (file === "corruption-tracker/map.html") {
    return <CorruptionMapPage />;
  }
  if (file === "corruption-tracker/cases/alice-guo.html") {
    return <AliceGuoCasePage />;
  }
  if (file === "startup-ecosystem-visualization.html") {
    return renderLegacyVisualization(file, {
      title: "Startup Ecosystem Visualization",
      kicker: "Capital and founders",
      description:
        "Explore Philippine startups, founders, investors, and funding patterns, including cross-links to business networks and elite schools.",
      dataLinks: [
        { href: "/philippine-startup-ecosystem-2025.json", label: "Startup ecosystem JSON" },
        { href: "/elite-schools-influence-2025.json", label: "Elite schools JSON" },
      ],
      relatedLinks: [
        { href: "/business-connections-network-visualization.html", label: "Business connections" },
        { href: "/elite-schools-influence-visualization.html", label: "Elite schools" },
      ],
    });
  }
  if (file === "regional-visualization.html") {
    return renderLegacyVisualization(file, {
      title: "Regional Visualization",
      kicker: "Geographic power",
      description:
        "Compare regional power patterns, geography, and subnational concentration across the Philippine political landscape.",
      dataLinks: [
        { href: "/regional-data.json", label: "Regional data JSON" },
      ],
      relatedLinks: [
        { href: "/dynasties-network-visualization.html", label: "Dynasty network map" },
      ],
    });
  }
  if (file === "corruption-tracker/flood-control-network.html") {
    return renderLegacyVisualization(file, {
      title: "Flood Control Scandal Network",
      kicker: "Case-specific network",
      description:
        "Focus on the flood-control scandal’s actors, contractors, and institutional relationships in a dedicated network view.",
      dataLinks: [
        { href: "/pogo-corruption-cases-2025.json", label: "Corruption cases JSON" },
      ],
      relatedLinks: [
        { href: "/corruption-tracker/cases/flood-control.html", label: "Flood-control case file" },
        { href: "/corruption-tracker/index.html", label: "Corruption tracker" },
      ],
    });
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
