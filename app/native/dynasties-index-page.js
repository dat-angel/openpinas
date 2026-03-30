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

export default function DynastiesIndexPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px", fontFamily: '"Source Serif Pro", Georgia, serif' }}>
      <h1 style={{ margin: "0 0 8px", color: "#3a0ca3", fontSize: "clamp(30px,4vw,44px)" }}>
        Philippine Political Dynasties
      </h1>
      <p style={{ margin: "0 0 14px", color: "#5e5e5e" }}>News Archive and family profiles.</p>
      <nav style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, fontFamily: '"Source Sans Pro", sans-serif' }}>
        <a href="/interactive-timeline/index.html">Full Timeline</a>
        <a href="/dynasties-network-visualization.html">Dynasty Map</a>
        <a href="/weekly-reviews/index.html">Weekly Reviews</a>
      </nav>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {DYNASTIES.map(([href, name, region]) => (
          <a
            key={href}
            href={`/dynasties/${href}`}
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              background: "#fff",
              borderLeft: "4px solid #3a0ca3",
              borderRadius: 12,
              padding: 18,
              boxShadow: "0 10px 24px rgba(0,0,0,.08)",
            }}
          >
            <h2 style={{ margin: "0 0 6px", fontSize: 20, color: "#3a0ca3" }}>{name}</h2>
            <p style={{ margin: 0, color: "#666", fontSize: 13, fontFamily: '"Source Sans Pro", sans-serif' }}>{region}</p>
          </a>
        ))}
      </section>
    </main>
  );
}
