import Link from "next/link";

const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  surface: "#f7f7f5",
  accent: "#2d2de8",
};

export default function VisualizationHeader({
  title,
  kicker,
  description,
  lastUpdated,
  dataLinks = [],
  relatedLinks = [],
}) {
  return (
    <header
      style={{
        padding: "36px 24px 24px",
        borderBottom: `1px solid ${T.subtle}`,
        background: T.surface,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "flex-start",
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <Link href="/" style={{ color: T.ink, textDecoration: "none", fontSize: 20, fontWeight: 700 }}>
            OpenPinas
          </Link>
          <span style={{ fontSize: 12, color: T.muted }}>
            {lastUpdated ? `Last updated: ${lastUpdated}` : "Native visualization"}
          </span>
        </div>

        {kicker ? (
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: T.accent,
            }}
          >
            {kicker}
          </p>
        ) : null}
        <h1
          style={{
            margin: "0 0 12px",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            color: T.ink,
          }}
        >
          {title}
        </h1>
        {description ? (
          <p
            style={{
              margin: "0 0 16px",
              maxWidth: 820,
              fontSize: 16,
              color: T.muted,
              lineHeight: 1.65,
            }}
          >
            {description}
          </p>
        ) : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 14 }}>
          <Link href="/visualizations/index.html" style={{ color: T.ink }}>
            All visuals
          </Link>
          {relatedLinks.map((link) => (
            <a key={link.href} href={link.href} style={{ color: T.ink }}>
              {link.label}
            </a>
          ))}
          {dataLinks.map((link) => (
            <a key={link.href} href={link.href} style={{ color: T.accent, fontWeight: 600 }}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
