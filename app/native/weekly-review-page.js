import { notFound } from "next/navigation";
import { readWeeklyManifest, readWeeklyReviewByDate } from "@/app/lib/weekly-reviews";

const pageStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "32px 24px 48px",
  fontFamily: '"Source Serif Pro", Georgia, serif',
  color: "#1a1a1a",
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
    <main style={pageStyle}>
      <nav style={{ marginBottom: 16, fontFamily: '"Source Sans Pro", sans-serif', fontSize: 13 }}>
        <a href="/" style={{ color: "#666", textDecoration: "none" }}>← OpenPinas</a>
      </nav>

      <h1 style={{ margin: 0, fontSize: "clamp(28px,4vw,42px)" }}>OpenPinas: Weekly News Review</h1>
      <p style={{ marginTop: 8, color: "#5e5e5e", fontSize: 18 }}>Week of {review.weekLabel}</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "16px 0 24px", fontFamily: '"Source Sans Pro", sans-serif' }}>
        <a href="/interactive-timeline/index.html">📅 Full Timeline</a>
        <a href="/dynasties-network-visualization.html">🗺️ Dynasty Map</a>
        <a href="/weekly-reviews/index.html">📚 All Reviews</a>
        {previous ? <a href={`/weekly-reviews/weekly-review-${previous}.html`}>← Previous Week</a> : null}
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginBottom: 20 }}>
        {(review.stats ?? []).map((s) => (
          <article key={s.label} style={{ background: "#fff", border: "1px solid #eadfce", borderRadius: 10, padding: 12 }}>
            <p style={{ margin: 0, fontSize: 24, color: "#124559", fontWeight: 700 }}>{s.number}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#666", fontFamily: '"Source Sans Pro", sans-serif' }}>{s.label}</p>
          </article>
        ))}
      </section>

      {review.exchangeRate ? (
        <section style={{ background: "#fff", border: "1px solid #eadfce", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <h2 style={{ marginTop: 0 }}>{review.exchangeRate.title}</h2>
          <p style={{ margin: "0 0 8px", fontSize: 22, color: "#124559" }}>{review.exchangeRate.currentRate}</p>
          <p style={{ margin: "0 0 8px", color: "#666", fontFamily: '"Source Sans Pro", sans-serif' }}>{review.exchangeRate.trend}</p>
          <HtmlBlock html={review.exchangeRate.contextHtml} />
          <p style={{ marginBottom: 0, color: "#666", fontSize: 12, fontFamily: '"Source Sans Pro", sans-serif' }}>{review.exchangeRate.sourceNote}</p>
        </section>
      ) : null}

      {(review.eventSections ?? []).map((section) => (
        <section key={section.title} style={{ marginBottom: 28 }}>
          <h2 style={{ borderBottom: "1px solid #e5e5e5", paddingBottom: 8 }}>{section.title}</h2>
          {(section.articles ?? []).map((article) => (
            <article key={`${article.timeDatetime}-${article.headline}`} style={{ borderLeft: `4px solid ${article.borderColor || "#124559"}`, background: "#fff", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 6, color: "#666", fontFamily: '"Source Sans Pro", sans-serif', fontSize: 12 }}>
                <time dateTime={article.timeDatetime}>{article.timeDisplay}</time>
                <span>{article.category}</span>
              </div>
              <h3 style={{ margin: "0 0 8px", fontSize: 21 }}>
                <a href={article.headlineHref} style={{ color: "#222", textDecoration: "none" }}>{article.headline}</a>
              </h3>
              <HtmlBlock html={article.descriptionHtml} />
              {article.significance ? <p><strong>Significance:</strong> {article.significance}</p> : null}
              {article.diasporaImpact ? <p><strong>Diaspora Impact:</strong> {article.diasporaImpact}</p> : null}
              {article.sourceLinks?.length ? (
                <p style={{ marginBottom: 0, fontSize: 14 }}>
                  <strong>Sources:</strong>{" "}
                  {article.sourceLinks.map((src, idx) => (
                    <span key={src.href + src.label}>
                      {idx > 0 ? ", " : null}
                      <a href={src.href} target="_blank" rel="noopener noreferrer">{src.label}</a>
                    </span>
                  ))}
                </p>
              ) : null}
            </article>
          ))}
        </section>
      ))}

      {review.ofwSection ? (
        <section style={{ background: "#fff", border: "1px solid #eadfce", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <h2 style={{ marginTop: 0 }}>{review.ofwSection.title}</h2>
          {(review.ofwSection.stories ?? []).map((story) => (
            <article key={story.title} style={{ marginBottom: 12 }}>
              <h3 style={{ margin: "0 0 4px" }}>{story.title}</h3>
              <HtmlBlock html={story.bodyHtml} />
            </article>
          ))}
        </section>
      ) : null}

      {review.dynastyHighlights ? (
        <section style={{ background: "#fff", border: "1px solid #eadfce", borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>{review.dynastyHighlights.title}</h2>
          {(review.dynastyHighlights.items ?? []).map((item) => (
            <article key={item.title} style={{ marginBottom: 12 }}>
              <h3 style={{ marginBottom: 4 }}>
                <a href={item.titleHref}>{item.title}</a>
              </h3>
              <HtmlBlock html={item.bodyHtml} />
              {item.bullets?.length ? (
                <ul>
                  {item.bullets.map((b) => (
                    <li key={b.href + b.text}><a href={b.href}>{b.text}</a></li>
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
