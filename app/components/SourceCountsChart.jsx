const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  surface: "#f7f7f5",
  accent: "#2d2de8",
  bar: "#1a1a72",
};

export default function SourceCountsChart({ counts }) {
  const rows = counts?.chart ?? [];
  const max = Math.max(...rows.map((row) => row.count), 1);

  return (
    <figure style={{ margin: "0 0 40px" }}>
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.subtle}`,
          padding: "20px 20px 16px",
        }}
      >
        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {rows.map((row) => {
            const width = `${(row.count / max) * 100}%`;
            return (
              <li
                key={row.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(96px, 150px) 1fr auto",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{row.name}</span>
                <span
                  aria-hidden="true"
                  style={{
                    display: "block",
                    height: 14,
                    background: row.name === "Other" ? "#9ca3af" : T.bar,
                    width,
                    minWidth: row.count > 0 ? 4 : 0,
                  }}
                />
                <span style={{ fontSize: 13, fontVariantNumeric: "tabular-nums", color: T.muted }}>
                  {row.count}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <figcaption style={{ marginTop: 12, color: T.muted, fontSize: 13, lineHeight: 1.55 }}>
        {counts.total_links.toLocaleString()} external links counted across published JSON
        datasets. Date generated from the latest dataset <code>last_updated</code>:{" "}
        {counts.generated_date}. Each URL occurrence is counted; a repeated citation counts
        every time. Top 15 outlets are shown; remaining domains are grouped as Other.
      </figcaption>
    </figure>
  );
}
