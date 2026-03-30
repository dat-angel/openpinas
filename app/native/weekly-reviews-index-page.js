const REVIEW_PATHS = [
  "weekly-review-2026-03-21.html",
  "weekly-review-2026-03-14.html",
  "weekly-review-2026-03-07.html",
  "weekly-review-2026-02-28.html",
  "weekly-review-2026-02-22.html",
  "weekly-review-2026-02-15.html",
  "weekly-review-2026-02-08.html",
  "weekly-review-2026-01-31.html",
  "weekly-review-2026-01-24.html",
  "weekly-review-2026-01-16.html",
  "weekly-review-2026-01-09.html",
  "weekly-review-2026-01-02.html",
];

function labelFor(file) {
  const date = file.replace("weekly-review-", "").replace(".html", "");
  return date;
}

export default function WeeklyReviewsIndexPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px", fontFamily: '"Source Serif Pro", Georgia, serif' }}>
      <nav style={{ marginBottom: 16, fontFamily: '"Source Sans Pro", sans-serif', fontSize: 13 }}>
        <a href="/" style={{ color: "#666" }}>← OpenPinas</a>
      </nav>
      <h1 style={{ margin: 0, fontSize: 34 }}>Weekly Reviews</h1>
      <p style={{ marginTop: 8, color: "#666" }}>
        Weekly digests summarizing major events, dynasties, weather, and exchange-rate context.
      </p>
      <div style={{ display: "flex", gap: 16, margin: "16px 0 24px", fontFamily: '"Source Sans Pro", sans-serif' }}>
        <a href="/interactive-timeline/index.html">Full Timeline</a>
        <a href="/dynasties-network-visualization.html">Dynasty Map</a>
      </div>
      <section style={{ borderTop: "1px solid #e5e5e5" }}>
        {REVIEW_PATHS.map((file) => (
          <article key={file} style={{ borderBottom: "1px solid #e5e5e5", padding: "12px 0" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 17 }}>
              <a href={`/weekly-reviews/${file}`} style={{ color: "#222", textDecoration: "none" }}>
                Weekly Review {labelFor(file)}
              </a>
            </h2>
            <p style={{ margin: 0, color: "#888", fontSize: 12, fontFamily: '"Source Sans Pro", sans-serif' }}>
              {labelFor(file)}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
