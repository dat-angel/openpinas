import { getNowDeveloping } from "@/lib/get-now-developing";

const DESK_LINKS = [
  {
    href: "/dynasties-network-visualization.html",
    title: "Dynasty Network Desk",
    kicker: "Investigate power maps",
    description:
      "Trace alliances, rivalries, and territorial control in an interactive network + map view.",
  },
  {
    href: "/interactive-timeline/index.html",
    title: "Timeline Desk",
    kicker: "Follow events over time",
    description:
      "Review significant political events and dynasty mentions across a chronological timeline.",
  },
  {
    href: "/weekly-reviews/index.html",
    title: "Weekly Review Archive",
    kicker: "Read curated analysis",
    description:
      "Scan weekly briefs that connect headline events with shifting political influence.",
  },
];

const STATS = [
  { number: "50+", label: "Dynasties Tracked" },
  { number: "450+", label: "Members Tracked" },
  { number: "71", label: "Provinces Controlled" },
  { number: "67%", label: "Congressional Seats" },
];

const edgePad = "clamp(16px, 5vw, 56px)";

const pageStyle = {
  minHeight: "100vh",
  margin: 0,
  fontFamily: '"Source Serif Pro", Georgia, serif',
  color: "#1a1a1a",
  background:
    "radial-gradient(1200px 600px at 80% -10%, #f0e7d7 0%, transparent 60%), radial-gradient(800px 500px at 10% 10%, #e6efe7 0%, transparent 55%), #f8f5f0",
};

function formatStripDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function HomePageNative() {
  const { label, updated, items, weeklyReviewHref } = getNowDeveloping();
  const dateLine = formatStripDate(updated);

  return (
    <main style={pageStyle}>
      {/* Full-bleed hero + decorative rule */}
      <header
        style={{
          width: "100%",
          padding: `48px ${edgePad} 28px`,
          textAlign: "center",
          borderBottom: "1px solid rgba(18, 69, 89, 0.12)",
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            color: "#124559",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Editorial + Resource Hub
        </p>
        <h1 style={{ margin: "0 0 12px", fontSize: "clamp(30px, 5vw, 48px)" }}>OpenPinas</h1>
        <div
          aria-hidden
          style={{
            width: "min(180px, 40%)",
            height: 3,
            margin: "0 auto 20px",
            background: "linear-gradient(90deg, transparent, #124559 20%, #124559 80%, transparent)",
            borderRadius: 2,
          }}
        />
        <p
          style={{
            margin: "0 auto",
            color: "#5e5e5e",
            fontSize: 18,
            maxWidth: "42rem",
            lineHeight: 1.55,
          }}
        >
          A living newsroom for understanding Philippine political dynasties: who holds power, where
          influence is concentrated, and how weekly events reshape the map.
        </p>
      </header>

      {/* Editorial strip — update weekly via content/now-developing.json */}
      <section
        aria-label={label}
        style={{
          width: "100%",
          padding: `22px ${edgePad} 24px`,
          background: "rgba(18, 69, 89, 0.06)",
          borderTop: "1px solid rgba(18, 69, 89, 0.14)",
          borderBottom: "1px solid rgba(18, 69, 89, 0.14)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "12px 24px",
            marginBottom: 14,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#124559",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </p>
          {dateLine ? (
            <p style={{ margin: 0, fontSize: 13, color: "#5e5e5e" }}>Updated {dateLine}</p>
          ) : null}
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: 20,
            color: "#383838",
            fontSize: 16,
            lineHeight: 1.65,
            maxWidth: "58rem",
          }}
        >
          {items.map((line, i) => (
            <li key={`${i}-${line.slice(0, 40)}`} style={{ marginBottom: 6 }}>
              {line}
            </li>
          ))}
        </ul>
        <p style={{ margin: "14px 0 0", fontSize: 14 }}>
          <a href={weeklyReviewHref} style={{ color: "#124559", fontWeight: 700 }}>
            Read this week in the review archive →
          </a>
        </p>
      </section>

      {/* Full-bleed desk grid — no max-width container */}
      <section
        style={{
          width: "100%",
          padding: `32px ${edgePad} 28px`,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "1px",
          background: "rgba(18, 69, 89, 0.15)",
          borderTop: "1px solid rgba(18, 69, 89, 0.08)",
          borderBottom: "1px solid rgba(18, 69, 89, 0.08)",
        }}
      >
        {DESK_LINKS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: "block",
              background: "#faf8f4",
              padding: "24px 22px",
              color: "inherit",
              textDecoration: "none",
              borderLeft: "3px solid #124559",
              boxShadow: "none",
              transition: "background 0.15s ease",
            }}
          >
            <p style={{ margin: "0 0 6px", fontSize: 12, color: "#476a6f", fontWeight: 700 }}>
              {item.kicker}
            </p>
            <h2 style={{ margin: "0 0 8px", fontSize: 22, color: "#124559", lineHeight: 1.15 }}>
              {item.title}
            </h2>
            <p style={{ margin: 0, color: "#5e5e5e", fontSize: 15, lineHeight: 1.5 }}>
              {item.description}
            </p>
          </a>
        ))}
      </section>

      {/* Stats strip — full width */}
      <section
        style={{
          width: "100%",
          padding: `28px ${edgePad} 0`,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 0,
          borderTop: "1px solid rgba(18, 69, 89, 0.08)",
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            style={{
              textAlign: "center",
              padding: "20px 12px",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(18, 69, 89, 0.1)" : "none",
            }}
          >
            <p style={{ margin: 0, fontSize: 28, color: "#124559", fontWeight: 700 }}>{s.number}</p>
            <p
              style={{
                margin: "6px 0 0",
                color: "#5e5e5e",
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {/* Footer: flush, no card boxes — editorial + how-to */}
      <footer
        style={{
          width: "100%",
          marginTop: 40,
          padding: `40px ${edgePad} 56px`,
          background: "linear-gradient(180deg, #ede8df 0%, #e8e3da 100%)",
          borderTop: "1px solid rgba(18, 69, 89, 0.18)",
          color: "#2d2d2d",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(28px, 5vw, 48px)",
            alignItems: "start",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 6px",
                color: "#124559",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              This Week&apos;s Editorial Frame
            </p>
            <h2 style={{ margin: "0 0 12px", fontSize: "clamp(22px, 3vw, 30px)", lineHeight: 1.15 }}>
              Power is local, but narratives are national.
            </h2>
            <p style={{ margin: "0 0 16px", color: "#454545", fontSize: 16, lineHeight: 1.6 }}>
              Use OpenPinas to connect what happens in Congress and national headlines to provincial
              control, alliances, and long-running dynastic networks.
            </p>
            <a
              href="/weekly-reviews/index.html"
              style={{
                color: "#124559",
                textDecoration: "underline",
                fontWeight: 700,
                fontSize: 16,
                display: "inline-block",
                marginBottom: 20,
              }}
            >
              Start with the latest weekly review →
            </a>

            {/* Readme / note — distinct from body copy (not a floating card) */}
            <aside
              style={{
                marginTop: 8,
                padding: "16px 18px 16px 20px",
                background: "rgba(255, 252, 245, 0.85)",
                borderLeft: "4px solid #b8860b",
                borderTop: "1px solid rgba(184, 134, 11, 0.25)",
                borderBottom: "1px solid rgba(184, 134, 11, 0.2)",
                borderRight: "1px solid rgba(184, 134, 11, 0.12)",
                fontSize: 14,
                lineHeight: 1.55,
                color: "#3d3a36",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#8a6d1d",
                }}
              >
                Readme · Sources &amp; methods
              </p>
              <p style={{ margin: "0 0 10px" }}>
                This project links reporting, timelines, and structured data. Always cross-check claims
                against primary reporting and our cited sources.
              </p>
              <a
                href="/sources-and-related-projects.html"
                style={{ color: "#124559", fontWeight: 700, textDecoration: "underline" }}
              >
                Open the source index and methodology →
              </a>
            </aside>
          </div>

          <div>
            <p
              style={{
                margin: "0 0 12px",
                color: "#124559",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              How To Use This Site
            </p>
            <ol
              style={{
                margin: 0,
                paddingLeft: 20,
                color: "#454545",
                lineHeight: 1.85,
                fontSize: 16,
              }}
            >
              <li>Open the dynasty map and spotlight key families.</li>
              <li>Switch to timeline to understand event sequences.</li>
              <li>Read weekly reviews for context and interpretation.</li>
              <li>Verify claims through sources and related projects.</li>
            </ol>
          </div>
        </div>
      </footer>
    </main>
  );
}
