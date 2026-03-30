const SECTIONS = [
  {
    title: "Dynasty Tracking",
    description:
      "These projects map political families, local power structures, and election patterns.",
    links: [
      {
        href: "https://www.inclusivedemocracy.ph/data-and-infographics",
        label: "Ateneo Policy Center Political Dynasties Dataset",
      },
      { href: "https://pcij.org/political-dynasties/", label: "PCIJ Political Dynasties Database" },
      { href: "https://dynasty-tracker.bettergov.ph", label: "BetterGov Dynasty Tracker" },
      {
        href: "https://pcij.org/political-dynasties/",
        label: "PCIJ Political Dynasties Coverage",
        suffix: " - investigative reporting on dynasty-controlled cities",
      },
      {
        href: "https://pcij.org/2025/01/26/pcij-research-data-philippines-political-clans/",
        label: "PCIJ research data on political clans",
      },
    ],
  },
  {
    title: "Corruption Monitoring",
    description:
      "Government and watchdog platforms tracking infrastructure projects and corruption cases.",
    links: [
      {
        href: "https://www.dpwh.gov.ph/DPWH/transparency/DPWH_Transparency_Portal",
        label: "DPWH Transparency Portal",
      },
      {
        href: "https://www.ombudsman.gov.ph/integrity-management-program-imp/",
        label: "Ombudsman Integrity Management Program",
      },
      {
        href: "https://www.pna.gov.ph/articles/1265885",
        label: "Sumbong sa Pangulo corruption reporting (PNA)",
      },
      {
        href: "https://ovovtec.org",
        label: "OVOVTEC - One Village, One Volunteer",
        suffix:
          " - Youth-led citizen-powered platform documenting public construction projects to combat corruption and \"ghost projects\"",
      },
    ],
  },
  {
    title: "Context and Analysis",
    description: "Academic and policy research that informs the framing of OpenPinas.",
    links: [
      {
        href: "https://democratic-erosion.org/2025/05/01/the-ruling-family-how-political-dynasties-are-destroying-democracy-in-the-philippines/",
        label: "Democratic Erosion: The Ruling Family",
      },
      {
        href: "https://online.ucpress.edu/as/article/63/2/301/195814/The-Philippines-in-2022The-Power-of-Dynastic",
        label: "The Philippines in 2022: The Power of Dynastic Politics",
      },
      {
        href: "https://www.pids.gov.ph/details/news/in-the-news/zero-in-dynasties-plague-2025-philippine-elections",
        label: "PIDS: Dynasties and 2025 elections",
      },
    ],
  },
];

const pageStyle = {
  minHeight: "100vh",
  margin: 0,
  fontFamily: '"Source Serif Pro", Georgia, serif',
  color: "#1a1a1a",
  background:
    "radial-gradient(1200px 600px at 80% -10%, #f0e7d7 0%, transparent 60%), radial-gradient(800px 500px at 10% 10%, #e6efe7 0%, transparent 55%), #f8f5f0",
  lineHeight: 1.6,
};

export default function SourcesRelatedProjectsPage() {
  return (
    <div style={pageStyle}>
      <header style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 16px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)", margin: "0 0 12px" }}>
          Sources and Related Projects
        </h1>
        <p style={{ margin: "0 auto", maxWidth: 720, color: "#5e5e5e", fontSize: 16 }}>
          OpenPinas builds on a broader ecosystem of academic research, civic tools, and investigative
          reporting. This page credits that work and links to the sources I consult.
        </p>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 60px" }}>
        {SECTIONS.map((section) => (
          <section
            key={section.title}
            style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
              margin: "20px 0",
            }}
          >
            <h2 style={{ margin: "0 0 12px", fontSize: 20, color: "#124559" }}>{section.title}</h2>
            <p style={{ margin: "0 0 12px", color: "#5e5e5e", fontSize: 14 }}>{section.description}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {section.links.map((item) => (
                <li key={item.href + item.label} style={{ marginBottom: 10, fontSize: 14 }}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: "#c44900", textDecoration: "none" }}>
                    {item.label}
                  </a>
                  {item.suffix ?? null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
