const DYNASTIES = [
  ["marcos-romualdez.html", "Marcos-Romualdez", "Ilocos Norte, Leyte, National"],
  ["duterte.html", "Duterte", "Davao City, Davao del Norte"],
  ["aquino.html", "Aquino-Cojuangco", "Tarlac, National"],
  ["estrada.html", "Estrada", "San Juan, Manila"],
  ["villar.html", "Villar", "Las Pinas, National"],
  ["arroyo.html", "Arroyo-Macapagal", "Pampanga, National"],
  ["revilla-tolentino.html", "Revilla-Tolentino", "Cavite"],
  ["binay.html", "Binay", "Makati"],
  ["pacquiao.html", "Pacquiao", "Sarangani"],
  ["singson.html", "Singson", "Ilocos Sur"],
  ["tulfo.html", "Tulfo", "National media politics"],
  ["dy.html", "Dy", "Isabela"],
];

const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  surface: "#f7f7f5",
  accent: "#2d2de8",
};

export default function DynastiesIndexPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 64px" }}>
      <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.accent }}>
        Dynasty Profiles
      </p>
      <h1 style={{ margin: "0 0 12px", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: T.ink }}>
        Philippine Political Dynasties
      </h1>
      <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16 }}>News archives and family profiles.</p>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 1, background: T.subtle }}>
        {DYNASTIES.map(([href, name, region]) => (
          <a
            key={href}
            href={`/dynasties/${href}`}
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              background: "#fff",
              padding: "24px 20px",
            }}
          >
            <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: T.ink }}>{name}</h2>
            <p style={{ margin: 0, color: T.muted, fontSize: 13 }}>{region}</p>
          </a>
        ))}
      </section>
    </main>
  );
}
