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

const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  surface: "#f7f7f5",
  accent: "#2d2de8",
};

export default function SourcesRelatedProjectsPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 64px" }}>
      <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.accent }}>
        Open Research
      </p>
      <h1 style={{ margin: "0 0 12px", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
        Sources and Related Projects
      </h1>
      <p style={{ margin: "0 0 40px", maxWidth: 640, color: T.muted, fontSize: 16, lineHeight: 1.6 }}>
        OpenPinas builds on a broader ecosystem of academic research, civic tools, and investigative
        reporting. This page credits that work and links to the sources I consult.
      </p>

      <div style={{ display: "grid", gap: 24 }}>
        {SECTIONS.map((section) => (
          <section
            key={section.title}
            style={{
              background: T.surface,
              border: `1px solid ${T.subtle}`,
              padding: 24,
            }}
          >
            <h2 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: T.ink }}>{section.title}</h2>
            <p style={{ margin: "0 0 16px", color: T.muted, fontSize: 14, lineHeight: 1.6 }}>{section.description}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {section.links.map((item) => (
                <li key={item.href + item.label} style={{ marginBottom: 10, fontSize: 14 }}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: T.accent, textDecoration: "underline" }}>
                    {item.label}
                  </a>
                  {item.suffix ? <span style={{ color: T.muted }}>{item.suffix}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
