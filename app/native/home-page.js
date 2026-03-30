const CARD_LINKS = [
  {
    href: "/dynasties-network-visualization.html",
    title: "Dynasty Network Map",
    description: "Interactive power map across provinces and alliances.",
  },
  {
    href: "/interactive-timeline/index.html",
    title: "Interactive Timeline",
    description: "Chronological view of major events and dynasty mentions.",
  },
  {
    href: "/weekly-reviews/index.html",
    title: "Weekly Reviews",
    description: "Weekly digests of significant events and political shifts.",
  },
  {
    href: "/sources-and-related-projects.html",
    title: "Sources and Related Projects",
    description: "Reference projects, partner datasets, and source links.",
  },
];

const STATS = [
  { number: "50+", label: "Dynasties Tracked" },
  { number: "450+", label: "Members Tracked" },
  { number: "71", label: "Provinces Controlled" },
  { number: "67%", label: "Congressional Seats" },
];

const pageStyle = {
  minHeight: "100vh",
  margin: 0,
  fontFamily: '"Source Serif Pro", Georgia, serif',
  color: "#1a1a1a",
  background:
    "radial-gradient(1200px 600px at 80% -10%, #f0e7d7 0%, transparent 60%), radial-gradient(800px 500px at 10% 10%, #e6efe7 0%, transparent 55%), #f8f5f0",
};

export default function HomePageNative() {
  return (
    <main style={pageStyle}>
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 24px", textAlign: "center" }}>
        <h1 style={{ margin: "0 0 12px", fontSize: "clamp(30px, 5vw, 48px)" }}>
          OpenPinas
        </h1>
        <p style={{ margin: 0, color: "#5e5e5e", fontSize: 18 }}>
          Open data platform for Philippine power structures, timelines, and political dynasty analysis.
        </p>
      </section>

      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "8px 24px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 16,
        }}
      >
        {CARD_LINKS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: "block",
              background: "#fff",
              borderLeft: "4px solid #124559",
              borderRadius: 12,
              boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
              padding: 20,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <h2 style={{ margin: "0 0 8px", fontSize: 22, color: "#124559" }}>{item.title}</h2>
            <p style={{ margin: 0, color: "#5e5e5e", fontSize: 15 }}>{item.description}</p>
          </a>
        ))}
      </section>

      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "8px 24px 48px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 14,
        }}
      >
        {STATS.map((s) => (
          <article
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
              textAlign: "center",
              padding: "16px 12px",
            }}
          >
            <p style={{ margin: 0, fontSize: 30, color: "#124559", fontWeight: 700 }}>{s.number}</p>
            <p style={{ margin: "4px 0 0", color: "#5e5e5e", fontSize: 12, letterSpacing: "0.04em" }}>
              {s.label}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
