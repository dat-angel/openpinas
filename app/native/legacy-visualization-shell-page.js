const T = {
  bg: "#ffffff",
  surface: "#f7f7f5",
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  accent: "#2d2de8",
};

export default function LegacyVisualizationShellPage({
  title,
  kicker = "Interactive visualization",
  description,
  srcDoc,
  dataLinks = [],
  relatedLinks = [],
}) {
  return (
    <main style={{ minHeight: "100vh", background: T.bg, color: T.ink }}>
      <section
        style={{
          padding: "40px 24px 24px",
          borderBottom: `1px solid ${T.subtle}`,
          background: T.surface,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
            {kicker}
          </p>
          <h1
            style={{
              margin: "0 0 12px",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
            }}
          >
            {title}
          </h1>
          {description ? (
            <p
              style={{
                margin: "0 0 18px",
                maxWidth: 840,
                fontSize: 16,
                lineHeight: 1.65,
                color: T.muted,
              }}
            >
              {description}
            </p>
          ) : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 14 }}>
            <a href="/" style={{ color: T.ink }}>
              Home
            </a>
            <a href="/sources-and-related-projects.html" style={{ color: T.ink }}>
              Sources
            </a>
            {relatedLinks.map((link) => (
              <a key={link.href} href={link.href} style={{ color: T.ink }}>
                {link.label}
              </a>
            ))}
            {dataLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{ color: T.accent, fontWeight: 600 }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 24px 24px" }}>
        <div
          style={{
            maxWidth: 1400,
            margin: "24px auto 0",
            border: `1px solid ${T.subtle}`,
            background: "#fff",
            boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
          }}
        >
          <iframe
            title={title}
            srcDoc={srcDoc}
            style={{ border: 0, width: "100%", height: "calc(100vh - 220px)", minHeight: 820, display: "block" }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </section>
    </main>
  );
}
