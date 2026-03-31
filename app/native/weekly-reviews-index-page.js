import manifest from "@/weekly-reviews/data/manifest.json";

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
        {manifest.reviews.map((review) => (
          <article key={review.weekEnding} style={{ borderBottom: "1px solid #e5e5e5", padding: "12px 0" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 17 }}>
              <a href={`/weekly-reviews/weekly-review-${review.weekEnding}.html`} style={{ color: "#222", textDecoration: "none" }}>
                Weekly Review {review.weekEnding}
              </a>
            </h2>
            <p style={{ margin: 0, color: "#888", fontSize: 12, fontFamily: '"Source Sans Pro", sans-serif' }}>
              {review.weekLabel}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
