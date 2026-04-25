import { getNowDeveloping } from "@/lib/get-now-developing";
import { FEATURED_VISUAL_IDS, getVisualizationsByIds } from "@/app/lib/visualizations";

const DESK_LINKS = [
  {
    href: "/dynasties-network-visualization.html",
    title: "Dynasty Network Map",
    kicker: "Investigate power maps",
    description:
      "Trace alliances, rivalries, and territorial control in an interactive network + map view.",
  },
  {
    href: "/interactive-timeline/index.html",
    title: "Timeline",
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

const edgePad = "clamp(20px, 5vw, 64px)";

// Design tokens
const T = {
  bg: "#ffffff",
  surface: "#f7f7f5",
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  accent: "#1a1a72",
  accentBright: "#2d2de8",
  font: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
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
  const visualStack = getVisualizationsByIds(FEATURED_VISUAL_IDS);

  return (
    <main style={{ minHeight: "100vh", margin: 0, fontFamily: T.font, color: T.ink, background: T.bg }}>

      {/* Hero */}
      <header
        style={{
          padding: `clamp(56px, 10vw, 112px) ${edgePad} clamp(48px, 8vw, 80px)`,
          maxWidth: 760,
        }}
      >
        <p
          style={{
            margin: "0 0 20px",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: T.accentBright,
          }}
        >
          Open Data Platform · Philippines
        </p>
        <h1
          style={{
            margin: "0 0 24px",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: T.ink,
          }}
        >
          Who holds power<br />in the Philippines.
        </h1>
        <p
          style={{
            margin: "0 0 32px",
            fontSize: "clamp(16px, 2vw, 19px)",
            color: T.muted,
            lineHeight: 1.6,
            maxWidth: 540,
          }}
        >
          Structured datasets and visualizations tracking political dynasties, business connections,
          and the events that reshape Philippine power week by week.
        </p>
        <a
          href={weeklyReviewHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 22px",
            background: T.ink,
            color: "#fff",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          Read this week&apos;s review →
        </a>
      </header>

      {/* Stats band */}
      <section
        style={{
          borderTop: `1px solid ${T.subtle}`,
          borderBottom: `1px solid ${T.subtle}`,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: "28px 24px",
              borderRight: i < STATS.length - 1 ? `1px solid ${T.subtle}` : "none",
            }}
          >
            <p style={{ margin: 0, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: T.ink }}>{s.number}</p>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Now developing strip */}
      <section
        aria-label={label}
        style={{
          padding: `28px ${edgePad}`,
          borderBottom: `1px solid ${T.subtle}`,
          display: "flex",
          flexWrap: "wrap",
          gap: "16px 48px",
          alignItems: "flex-start",
        }}
      >
        <div style={{ minWidth: 120 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.accentBright }}>{label}</p>
          {dateLine && <p style={{ margin: 0, fontSize: 12, color: T.muted }}>Updated {dateLine}</p>}
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <ul style={{ margin: 0, paddingLeft: 18, color: T.muted, fontSize: 15, lineHeight: 1.7, maxWidth: "64rem" }}>
            {items.map((line, i) => (
              <li key={`${i}-${line.slice(0, 40)}`} style={{ marginBottom: 4 }}>{line}</li>
            ))}
          </ul>
          <a href={weeklyReviewHref} style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 600, color: T.ink, textDecoration: "underline" }}>
            Full weekly review →
          </a>
        </div>
      </section>

      {/* Desk grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          borderBottom: `1px solid ${T.subtle}`,
        }}
      >
        {DESK_LINKS.map((item, i) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: "block",
              padding: `clamp(28px, 4vw, 44px) ${edgePad}`,
              color: "inherit",
              textDecoration: "none",
              borderRight: i < DESK_LINKS.length - 1 ? `1px solid ${T.subtle}` : "none",
              transition: "background 0.15s",
            }}
            >
            <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.accentBright }}>{item.kicker}</p>
            <h2 style={{ margin: "0 0 10px", fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, color: T.ink }}>{item.title}</h2>
            <p style={{ margin: 0, color: T.muted, fontSize: 15, lineHeight: 1.6 }}>{item.description}</p>
          </a>
        ))}
      </section>

      <section
        style={{
          padding: `40px ${edgePad} 48px`,
          borderBottom: `1px solid ${T.subtle}`,
          background: T.surface,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 720, marginBottom: 28 }}>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: T.accentBright,
              }}
            >
              Visual Analysis
            </p>
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "clamp(24px, 3.2vw, 34px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Follow the supporting systems around political power.
            </h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: T.muted }}>
              These are the next five visuals worth foregrounding on the Vercel home: business
              ties, elite education, startup capital, and the networked and geographic views of
              corruption.
            </p>
            <a href="/visualizations/index.html" style={{ display: "inline-block", marginTop: 14, color: T.ink, fontSize: 14, fontWeight: 600 }}>
              Open the full visualization index →
            </a>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 1,
              background: T.subtle,
              border: `1px solid ${T.subtle}`,
            }}
          >
            {visualStack.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: "block",
                  minHeight: 220,
                  padding: "22px 20px 24px",
                  background: "#fff",
                  textDecoration: "none",
                  color: T.ink,
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: T.accent,
                  }}
                >
                  {item.kicker}
                </p>
                <h3
                  style={{
                    margin: "0 0 10px",
                    fontSize: 21,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ margin: 0, color: T.muted, fontSize: 15, lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: `56px ${edgePad} 64px`,
          borderTop: `1px solid ${T.subtle}`,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "clamp(32px, 5vw, 64px)",
          alignItems: "start",
          background: T.surface,
        }}
      >
        <div>
          <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted }}>About</p>
          <h2 style={{ margin: "0 0 14px", fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Power is local,<br />narratives are national.
          </h2>
          <p style={{ margin: "0 0 20px", color: T.muted, fontSize: 15, lineHeight: 1.65 }}>
            Use OpenPinas to connect what happens in Congress and national headlines to provincial
            control, alliances, and long-running dynastic networks.
          </p>
          <a href="/sources-and-related-projects.html" style={{ fontSize: 14, fontWeight: 600, color: T.ink, textDecoration: "underline" }}>
            Sources and methodology →
          </a>
        </div>

        <div>
          <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted }}>How to use this site</p>
          <ol style={{ margin: 0, paddingLeft: 20, color: T.muted, lineHeight: 1.9, fontSize: 15 }}>
            <li>Open the dynasty map and spotlight key families.</li>
            <li>Switch to timeline to understand event sequences.</li>
            <li>Read weekly reviews for context and interpretation.</li>
            <li>Verify claims through sources and related projects.</li>
          </ol>
        </div>

        <div>
          <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted }}>Open Data</p>
          <p style={{ margin: "0 0 14px", color: T.muted, fontSize: 15, lineHeight: 1.65 }}>
            All datasets are available as open JSON files — download, verify, remix, or extend.
            Licensed under CC BY 4.0.
          </p>
          <a href="https://github.com/dat-angel/openpinas" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: T.ink, textDecoration: "underline" }}>
            View on GitHub →
          </a>
        </div>
      </footer>

    </main>
  );
}
