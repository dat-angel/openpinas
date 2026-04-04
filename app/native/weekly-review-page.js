import { notFound } from "next/navigation";
import { readWeeklyManifest, readWeeklyReviewByDate } from "@/app/lib/weekly-reviews";

const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  surface: "#f7f7f5",
  accent: "#2d2de8",
};

function HtmlBlock({ html }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function WeeklyReviewPage({ weekEnding }) {
  const review = readWeeklyReviewByDate(weekEnding);
  if (!review) notFound();

  const manifest = readWeeklyManifest();
  const currentMeta = manifest.find((r) => r.weekEnding === weekEnding);
  const previous = currentMeta?.prevWeekEnding ?? null;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 64px" }}>
      <h1 style={{ margin: "0 0 6px", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
        OpenPinas: Weekly Review
      </h1>
      <p style={{ marginTop: 0, marginBottom: 20, color: T.muted, fontSize: 17, fontWeight: 500 }}>
        Week of {review.weekLabel}
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "0 0 28px", fontSize: 13, fontWeight: 600 }}>
        <a href="/interactive-timeline/index.html" style={{ color: T.ink }}>Timeline</a>
        <a href="/dynasties-network-visualization.html" style={{ color: T.ink }}>Dynasty Map</a>
        <a href="/weekly-reviews/index.html" style={{ color: T.ink }}>All Reviews</a>
        {previous ? <a href={`/weekly-reviews/weekly-review-${previous}.html`} style={{ color: T.muted }}>← Previous Week</a> : null}
      </div>

      {(review.stats ?? []).length > 0 && (
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 1, background: T.subtle, marginBottom: 28, border: `1px solid ${T.subtle}` }}>
          {(review.stats ?? []).map((s) => (
            <article key={s.label} style={{ background: "#fff", padding: "20px 16px" }}>
              <p style={{ margin: 0, fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.03em", color: T.ink }}>{s.number}</p>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
            </article>
          ))}
        </section>
      )}

      {review.exchangeRate ? (
        <section style={{ background: T.surface, border: `1px solid ${T.subtle}`, padding: 20, marginBottom: 24 }}>
          <h2 style={{ marginTop: 0, fontSize: 16, fontWeight: 700 }}>{review.exchangeRate.title}</h2>
          <p style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: T.ink }}>{review.exchangeRate.currentRate}</p>
          <p style={{ margin: "0 0 8px", color: T.muted, fontSize: 14 }}>{review.exchangeRate.trend}</p>
          <HtmlBlock html={review.exchangeRate.contextHtml} />
          <p style={{ marginBottom: 0, color: T.muted, fontSize: 12 }}>{review.exchangeRate.sourceNote}</p>
        </section>
      ) : null}

      {(review.eventSections ?? []).map((section) => (
        <section key={section.title} style={{ marginBottom: 32 }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, paddingBottom: 10, borderBottom: `1px solid ${T.subtle}` }}>{section.title}</h2>
          {(section.articles ?? []).map((article) => (
            <article
              key={`${article.timeDatetime}-${article.headline}`}
              style={{ borderLeft: `3px solid ${article.borderColor || T.accent}`, background: "#fff", border: `1px solid ${T.subtle}`, borderLeft: `3px solid ${article.borderColor || T.accent}`, padding: "16px 18px", marginBottom: 12 }}
            >
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 6, color: T.muted, fontSize: 12 }}>
                <time dateTime={article.timeDatetime}>{article.timeDisplay}</time>
                <span>{article.category}</span>
              </div>
              <h3 style={{ margin: "0 0 8px", fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em" }}>
                <a href={article.headlineHref} style={{ color: T.ink, textDecoration: "none" }}>{article.headline}</a>
              </h3>
              <HtmlBlock html={article.descriptionHtml} />
              {article.significance ? <p style={{ color: T.muted, fontSize: 14 }}><strong style={{ color: T.ink }}>Significance:</strong> {article.significance}</p> : null}
              {article.diasporaImpact ? <p style={{ color: T.muted, fontSize: 14 }}><strong style={{ color: T.ink }}>Diaspora Impact:</strong> {article.diasporaImpact}</p> : null}
              {article.sourceLinks?.length ? (
                <p style={{ marginBottom: 0, fontSize: 13, color: T.muted }}>
                  <strong style={{ color: T.ink }}>Sources:</strong>{" "}
                  {article.sourceLinks.map((src, idx) => (
                    <span key={src.href + src.label}>
                      {idx > 0 ? ", " : null}
                      <a href={src.href} target="_blank" rel="noopener noreferrer" style={{ color: T.accent }}>{src.label}</a>
                    </span>
                  ))}
                </p>
              ) : null}
            </article>
          ))}
        </section>
      ))}

      {review.ofwSection ? (
        <section style={{ background: T.surface, border: `1px solid ${T.subtle}`, padding: 20, marginBottom: 24 }}>
          <h2 style={{ marginTop: 0, fontSize: 18, fontWeight: 700 }}>{review.ofwSection.title}</h2>
          {(review.ofwSection.stories ?? []).map((story) => (
            <article key={story.title} style={{ marginBottom: 12 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>{story.title}</h3>
              <HtmlBlock html={story.bodyHtml} />
            </article>
          ))}
        </section>
      ) : null}

      {review.dynastyHighlights ? (
        <section style={{ background: T.surface, border: `1px solid ${T.subtle}`, padding: 20 }}>
          <h2 style={{ marginTop: 0, fontSize: 18, fontWeight: 700 }}>{review.dynastyHighlights.title}</h2>
          {(review.dynastyHighlights.items ?? []).map((item) => (
            <article key={item.title} style={{ marginBottom: 12 }}>
              <h3 style={{ marginBottom: 4, fontSize: 16, fontWeight: 600 }}>
                <a href={item.titleHref} style={{ color: T.ink }}>{item.title}</a>
              </h3>
              <HtmlBlock html={item.bodyHtml} />
              {item.bullets?.length ? (
                <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                  {item.bullets.map((b) => (
                    <li key={b.href + b.text} style={{ marginBottom: 4 }}>
                      <a href={b.href} style={{ color: T.accent }}>{b.text}</a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
