import { notFound } from "next/navigation";
import DynastiesIndexPage from "@/app/native/dynasties-index-page";
import WeeklyReviewsIndexPage from "@/app/native/weekly-reviews-index-page";
import {
  collectHtmlFiles,
  fileFromSlug,
  computeBaseHref,
  prepareSrcDoc,
  readLegacyHtml,
} from "@/app/lib/legacy";

const ROOT = process.cwd();

export const dynamic = "force-static";

export async function generateStaticParams() {
  const files = await collectHtmlFiles(ROOT);
  return files
    .filter((f) => f !== "index.html")
    .map((f) => ({ slug: f.split("/") }));
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
