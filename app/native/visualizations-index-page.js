import { groupVisualizations } from "@/app/lib/visualizations";

const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  surface: "#f7f7f5",
  accent: "#2d2de8",
};

const statusStyles = {
  native: { label: "Native", bg: "#e9f7ef", color: "#0b6e4f" },
  wrapped: { label: "Wrapped legacy", bg: "#fff4e5", color: "#9a4d00" },
};

export default function VisualizationsIndexPage() {
  const sections = groupVisualizations();

  return (
    <main style={{ minHeight: "100vh", background: "#fff", color: T.ink }}>
      <section
        style={{
          padding: "48px 24px 32px",
          borderBottom: `1px solid ${T.subtle}`,
          background: T.surface,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
            Analysis Desk
          </p>
          <h1
            style={{
              margin: "0 0 12px",
              fontSize: "clamp(30px, 4.5vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Visualization index
          </h1>
          <p style={{ margin: 0, maxWidth: 760, fontSize: 17, lineHeight: 1.65, color: T.muted }}>
            OpenPinas now distinguishes between fully native pages and wrapped legacy survivors.
            Use this index to navigate the visual stack without guessing which routes still depend
            on old HTML.
          </p>
        </div>
      </section>

      <section style={{ padding: "32px 24px 56px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 28 }}>
          {sections.map((section) => (
            <div key={section.group}>
              <h2
                style={{
                  margin: "0 0 14px",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {section.group}
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 1,
                  background: T.subtle,
                  border: `1px solid ${T.subtle}`,
                }}
              >
                {section.items.map((item) => {
                  const status = statusStyles[item.status] || statusStyles.wrapped;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      style={{
                        display: "block",
                        background: "#fff",
                        minHeight: 220,
                        padding: "20px",
                        textDecoration: "none",
                        color: T.ink,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "flex-start",
                          marginBottom: 12,
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: T.accent,
                          }}
                        >
                          {item.kicker}
                        </p>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: 999,
                            background: status.bg,
                            color: status.color,
                            fontSize: 11,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <h3
                        style={{
                          margin: "0 0 10px",
                          fontSize: 22,
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.12,
                        }}
                      >
                        {item.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: T.muted }}>
                        {item.description}
                      </p>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
