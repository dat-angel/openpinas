import manifest from "@/weekly-reviews/data/manifest.json";

const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  accent: "#2d2de8",
};

export default function WeeklyReviewsIndexPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 64px" }}>
      <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.accent }}>
        Archive
      </p>
      <h1 style={{ margin: "0 0 12px", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
        Weekly Reviews
      </h1>
      <p style={{ marginTop: 0, marginBottom: 32, color: T.muted, fontSize: 16, lineHeight: 1.6 }}>
        Weekly digests summarizing major events, dynasties, weather, and exchange-rate context.
      </p>
      <section style={{ borderTop: `1px solid ${T.subtle}` }}>
        {manifest.reviews.map((review) => (
          <article key={review.weekEnding} style={{ borderBottom: `1px solid ${T.subtle}`, padding: "16px 0" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>
              <a href={`/weekly-reviews/weekly-review-${review.weekEnding}.html`} style={{ color: T.ink, textDecoration: "none" }}>
                {review.weekLabel || `Week of ${review.weekEnding}`}
              </a>
            </h2>
            <p style={{ margin: 0, color: T.muted, fontSize: 12 }}>
              {review.weekEnding}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
