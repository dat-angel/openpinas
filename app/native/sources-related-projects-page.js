import SourceCountsChart from "@/app/components/SourceCountsChart";
import sourceCounts from "@/data/source-counts.json";

const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  surface: "#f7f7f5",
  accent: "#2d2de8",
};

const DATASETS = [
  {
    file: "philippine-political-dynasties-network-2025.json",
    sources:
      "PCIJ for the 71/82 governors figure; Ateneo Policy Center / Mendoza et al. (2019) for the House, mayor, and 2004–2019 concentration shares stored under power_metrics. Node-level family records have no per-entry citations.",
    lastUpdated: "2026-01-01",
    gaps:
      "71 dynasties and 148 key members, not a census of all political families. Geographic labels cover 63 areas (provinces and cities), not all 82 provinces. Classification and power_level are internal labels without a published codebook.",
  },
  {
    file: "philippines-2026-timeline.json",
    sources: "Per-event local and international news URLs, mostly Philippine outlets.",
    lastUpdated: "2026-10-19",
    gaps: "Coverage follows the weekly news skill, not every story published in the Philippines.",
  },
  {
    file: "weekly-reviews/data/*.json",
    sources: "sourceLinks on each article, drawn from the same news tiers as the timeline.",
    lastUpdated: "2026-10-19",
    gaps: "Special editions and older HTML-only pages may not match the JSON archive one-for-one.",
  },
  {
    file: "business-connections-2025.json",
    sources: "None recorded.",
    lastUpdated: "2026-01-03",
    gaps:
      "Provenance is unknown. File notes say ownership structures still need SEC verification. Several sections are placeholders.",
  },
  {
    file: "elite-schools-influence-2025.json",
    sources: "None recorded.",
    lastUpdated: "unspecified",
    gaps:
      "metadata.note says this is placeholder data for layout, interaction, and narrative testing. Scores and stories are not sourced.",
  },
  {
    file: "regional-data.json",
    sources: "None recorded.",
    lastUpdated: "unspecified",
    gaps:
      "45 geographic entries (including Metro Manila and overlapping Cotabato / North Cotabato labels). Counts have no citations and appear to summarize dynasty-network coverage rather than an independent survey.",
  },
  {
    file: "pogo-corruption-cases-2025.json",
    sources: "Per-case news and agency URLs (Rappler, Inquirer, Philstar, GMA, AP, and others).",
    lastUpdated: "2026-02-21",
    gaps: "Four cases only. Many timeline rows inside those cases have empty sources arrays.",
  },
  {
    file: "philippine-startup-ecosystem-2025.json",
    sources: "Some startups cite Wikipedia or other URLs; many sources arrays are empty.",
    lastUpdated: "2026-01-16",
    gaps: "metadata.status is in_progress. Ecosystem ranking figures are not tied to a named index in the file.",
  },
  {
    file: "data/php-usd-weekly-2025.json",
    sources: "BSP peso-dollar daily reference rate.",
    sourceHref: "https://www.bsp.gov.ph/statistics/external/pesodollar.xlsx",
    sourceHrefLabel: "BSP peso-dollar xlsx",
    lastUpdated: "2025-11-24 (last week in file)",
    gaps: "Weekly high/low aggregates. No 2026 series in this file.",
  },
  {
    file: "data/airport-passenger-summary.json",
    sources: "MCIAA passenger, cargo, and movement charts for CEB; CAAP Airpasscar Annual 2024 for Davao.",
    sourceHrefs: [
      { href: "https://mciaa.gov.ph/statistics/", label: "MCIAA Statistics" },
      {
        href: "https://caap.gov.ph/wp-content/uploads/2025/01/AirpasscarANNUAL-2024.pdf",
        label: "CAAP Airpasscar 2024",
      },
    ],
    lastUpdated: "CEB through 2025-10; Davao is 2024 annual",
    gaps: "No public monthly NAIA/MIAA series found. Davao has no 2025 monthly series.",
  },
];

const HEADLINE_NUMBERS = [
  {
    claim: "71 of 82 governors from dynasties (86.6%)",
    citation: {
      href: "https://pcij.org/2024/12/08/governors-political-dynasties-philippines-provinces-elections/",
      label: "PCIJ, 8 December 2024",
    },
    note: "PCIJ reports 87%. 71÷82 is 86.6%. This is a PCIJ count, not an OpenPinas census and not a figure published on the Ateneo Inclusive Democracy page.",
  },
  {
    claim: "67% of House seats dynastic; 53% of mayors; rise since 2004 (governors 57%→80%, House 48%→67%, mayors 40%→53%)",
    citation: {
      href: "https://www.rappler.com/philippines/240037-study-local-posts-occupied-by-political-dynasties/",
      label: "Ateneo Policy Center / Mendoza et al., reported by Rappler (2019)",
    },
    note: "These are 2019 “fat dynasty” shares stored in the file under national_statistics_2025. They are not 2025 election results.",
  },
  {
    claim: "2025 midterm turnout 82.2%",
    citation: {
      href: "https://www.inquirer.net/444077/its-final-comelec-logs-highest-voter-turnout-for-midterm-polls-at-82-20/",
      label: "COMELEC via Inquirer",
    },
    note: "COMELEC’s official 82.20% (57,350,968 of 69,673,653). Cited here through Inquirer because the PNA article URL currently 404s for automated fetches.",
  },
  {
    claim: "71 dynasties tracked",
    citation: null,
    note: "Counted from philippine-political-dynasties-network-2025.json (metadata.total_dynasties = 71). The homepage still says “50+”.",
  },
  {
    claim: "450+ members tracked",
    citation: "unsourced",
    note: "The published network file has 148 key members. The homepage and README figure is outdated.",
  },
  {
    claim: "80% of provincial board seats dynastic",
    citation: "unsourced",
    note: "Unsourced, under review. Ateneo’s 2019 series puts fat-dynasty provincial board members near 45%, and 80% on governors. This field is likely a mislabel.",
  },
  {
    claim: "12.5% senatorial dynastic relatives",
    citation: "unsourced",
    note: "Unsourced, under review. No matching citation found in the repo or in the PCIJ/Ateneo pages checked for this work.",
  },
  {
    claim: "4.5% unopposed dynastic candidates (800 of 18,000 positions)",
    citation: "unsourced",
    note: "Unsourced, under review.",
  },
  {
    claim: "2025 midterm dynasty wins and notable Senate wins/losses listed in power_metrics",
    citation: "unsourced",
    note: "Unsourced, under review. The list is stored without URLs.",
  },
];

const TIER_SOURCES = [
  {
    tier: "Tier 1 — primary Philippine sources",
    rows: [
      ["Rappler", "https://www.rappler.com", "Politics, investigations"],
      ["Philippine Daily Inquirer", "https://www.inquirer.net", "General news"],
      ["Manila Bulletin", "https://mb.com.ph", "General news"],
      ["Philippine Star", "https://www.philstar.com", "General news"],
      ["GMA Network", "https://www.gmanetwork.com", "Broadcast news"],
      ["ABS-CBN News", "https://www.abs-cbn.com/news", "Broadcast news"],
      ["Bilyonaryo", "https://bilyonaryo.com", "Business, politics"],
    ],
  },
  {
    tier: "Tier 2 — investigative / analysis",
    rows: [
      ["Vera Files", "https://verafiles.org", "Fact-checking"],
      ["CMFR", "https://cmfr-phil.org", "Media freedom"],
    ],
  },
  {
    tier: "Tier 3 — international coverage",
    rows: [
      ["AP News (Philippines)", "https://apnews.com/hub/philippines", "International perspective"],
      ["Reuters", "https://www.reuters.com", "International perspective"],
      ["South China Morning Post", "https://www.scmp.com", "Regional coverage"],
      ["Time", "https://time.com", "Major events"],
      ["The Guardian", "https://www.theguardian.com", "International perspective"],
    ],
  },
  {
    tier: "Tier 4 — Tagalog sources",
    rows: [
      ["Balita (MB Tagalog)", "https://balita.mb.com.ph", "Tagalog news"],
      ["Diskurso", "https://diskurso.ph", "Commentary"],
    ],
  },
];

const RELATED = [
  {
    title: "Dynasty tracking",
    description: "Academic and civic datasets that map political families. PCIJ’s 2024 governors count is cited under Headline numbers.",
    links: [
      {
        href: "https://www.inclusivedemocracy.ph/data-and-infographics",
        label: "Ateneo Policy Center Political Dynasties Dataset",
      },
      { href: "https://dynasty-tracker.bettergov.ph", label: "BetterGov Dynasty Tracker" },
    ],
  },
  {
    title: "Corruption monitoring",
    description: "Government and watchdog platforms tracking infrastructure projects and corruption cases.",
    links: [
      {
        href: "https://www.dpwh.gov.ph/DPWH/transparency/DPWH_Transparency_Portal",
        label: "DPWH Transparency Portal",
      },
      {
        href: "https://www.ombudsman.gov.ph/docs/publication/IMPHandbook.pdf",
        label: "Ombudsman Integrity Management Program handbook (PDF)",
      },
      {
        href: "https://sumbongsapangulo.ph/",
        label: "Sumbong sa Pangulo",
      },
      {
        href: "https://ovovtec.org",
        label: "OVOVTEC - One Village, One Volunteer",
        suffix: " — youth-led documentation of public construction projects",
      },
    ],
  },
  {
    title: "Context and analysis",
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

const sectionTitle = {
  margin: "0 0 12px",
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: T.ink,
};

const body = { margin: "0 0 16px", color: T.muted, fontSize: 15, lineHeight: 1.65 };
const linkStyle = { color: T.accent, textDecoration: "underline" };

export default function SourcesRelatedProjectsPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 64px" }}>
      <p
        style={{
          margin: "0 0 16px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: T.accent,
        }}
      >
        Open Research
      </p>
      <h1
        style={{
          margin: "0 0 12px",
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
        }}
      >
        Sources &amp; Methodology
      </h1>
      <p style={{ ...body, maxWidth: 680, fontSize: 16 }}>
        OpenPinas compiles public records and news so readers can see who holds power in the
        Philippines. This page states what we track, where each dataset comes from, how sources
        are chosen, and what is still unsourced.
      </p>

      <section style={{ marginBottom: 48 }}>
        <h2 style={sectionTitle}>What we track and why</h2>
        <p style={body}>
          The project follows political families, the events around them, and a few adjacent
          networks (business, schools, regional counts, corruption cases). The aim is to make
          power visible without editorializing.
        </p>
        <p style={body}>
          <strong style={{ color: T.ink }}>Dynasty definition.</strong> OpenPinas does not
          publish its own formal codebook. In practice a “dynasty” here is a political family
          with more than one member in, or recently in, elected or high appointive office,
          grouped under one node in{" "}
          <code>philippine-political-dynasties-network-2025.json</code>. That is close to two
          common research definitions, which we cite but do not re-implement: PCIJ treats a
          politician as dynastic when a relative up to the third degree also holds or seeks
          office; the Ateneo Policy Center tracks clans as elected officials who have family
          members in office before or during their term, usually by shared family name within a
          province.
        </p>
        <p style={body}>
          <strong style={{ color: T.ink }}>Classification.</strong> Each node has an internal
          label: imperial (8), dominant (1), major (48), established (9), rising (2), minor (2),
          or new (1). The map colors those labels. There is no written rule in the repo for
          promoting a family from major to imperial.
        </p>
        <p style={body}>
          <strong style={{ color: T.ink }}>Power level.</strong> Nodes are tagged national (9),
          regional (60), national_economic (1), or regional_expanding (1). This is a coarse
          geographic reach tag, not a formal index such as Ateneo’s DYNSHA / DYNLAR / DYNHERF
          measures, which the file only defines.
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={sectionTitle}>Where each dataset comes from</h2>
        <p style={body}>
          Last-updated dates are taken from each file’s metadata when present. Gaps are what the
          files themselves show, not estimates.
        </p>
        <div style={{ overflowX: "auto", border: `1px solid ${T.subtle}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: T.surface, textAlign: "left" }}>
                {["File", "Sources", "Last updated", "Known gaps"].map((head) => (
                  <th
                    key={head}
                    style={{
                      padding: "10px 12px",
                      borderBottom: `1px solid ${T.subtle}`,
                      color: T.ink,
                      fontWeight: 700,
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DATASETS.map((row) => (
                <tr key={row.file}>
                  <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.subtle}`, verticalAlign: "top" }}>
                    <code>{row.file}</code>
                  </td>
                  <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.subtle}`, verticalAlign: "top", color: T.muted }}>
                    {row.sources}
                    {row.sourceHref ? (
                      <>
                        {" "}
                        <a href={row.sourceHref} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                          {row.sourceHrefLabel || "source"}
                        </a>
                      </>
                    ) : null}
                    {row.sourceHrefs
                      ? row.sourceHrefs.map((item) => (
                          <span key={item.href}>
                            {" "}
                            <a href={item.href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                              {item.label}
                            </a>
                          </span>
                        ))
                      : null}
                  </td>
                  <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.subtle}`, verticalAlign: "top", color: T.muted }}>
                    {row.lastUpdated}
                  </td>
                  <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.subtle}`, verticalAlign: "top", color: T.muted }}>
                    {row.gaps}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={sectionTitle}>How we choose sources</h2>
        <p style={body}>
          Timeline and weekly-review updates follow the publishable parts of{" "}
          <code>Skills/ph-news-refresher/SKILL.md</code>. Outlets are grouped by tier. Major
          events need at least two sources, at least one Philippine outlet, working URLs, and
          neutral wording.
        </p>
        {TIER_SOURCES.map((group) => (
          <div key={group.tier} style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: T.ink }}>{group.tier}</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: T.muted, fontSize: 14, lineHeight: 1.7 }}>
              {group.rows.map(([name, href, focus]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                    {name}
                  </a>
                  {` — ${focus}`}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <ul style={{ margin: 0, paddingLeft: 20, color: T.muted, fontSize: 15, lineHeight: 1.7 }}>
          <li>Minimum 2 sources for major events</li>
          <li>At least 1 primary Philippine source</li>
          <li>International source preferred when the event has global significance</li>
          <li>Working URLs only (verify before including)</li>
          <li>Stick to verifiable facts; avoid editorializing; label analysis as analysis</li>
          <li>Politiko (politiko.com.ph) is in the skill’s Tier 4 list but is not linked here; the site returned HTTP 500 when checked.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={sectionTitle}>Which outlets we cite</h2>
        <p style={body}>
          Counts are generated at build time from the published JSON files (2026 timeline, 2025
          timeline, weekly reviews, dynasty network, and the other datasets in the table above).
          They are not hand-typed.
        </p>
        <SourceCountsChart counts={sourceCounts} />
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={sectionTitle}>Headline numbers</h2>
        <p style={body}>
          Homepage, README, and <code>power_metrics.national_statistics_2025</code> figures, with
          a citation or an explicit unsourced flag.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {HEADLINE_NUMBERS.map((item) => (
            <div key={item.claim} style={{ background: T.surface, border: `1px solid ${T.subtle}`, padding: 16 }}>
              <p style={{ margin: "0 0 6px", fontWeight: 700, color: T.ink }}>{item.claim}</p>
              <p style={{ margin: "0 0 6px", fontSize: 14 }}>
                {item.citation === "unsourced" ? (
                  <span style={{ color: "#9a4d00", fontWeight: 600 }}>Unsourced, under review</span>
                ) : item.citation ? (
                  <a href={item.citation.href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                    {item.citation.label}
                  </a>
                ) : (
                  <span style={{ color: T.ink, fontWeight: 600 }}>Counted from the published JSON</span>
                )}
              </p>
              <p style={{ margin: 0, color: T.muted, fontSize: 14, lineHeight: 1.55 }}>{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={sectionTitle}>Known limits</h2>
        <ul style={{ margin: 0, paddingLeft: 20, color: T.muted, fontSize: 15, lineHeight: 1.7 }}>
          <li>
            The dynasty network maps 63 named areas (provinces and cities), not 15 of 82 and not
            a complete 82-province census. <code>regional-data.json</code> has 45 entries.
          </li>
          <li>
            <code>business-connections-2025.json</code>,{" "}
            <code>elite-schools-influence-2025.json</code>, and <code>regional-data.json</code>{" "}
            cite no sources. Elite schools is labeled placeholder data.
          </li>
          <li>
            Homepage/README “450+ members” and “50+ dynasties” do not match the file (148
            members, 71 dynasties).
          </li>
          <li>
            Several <code>national_statistics_2025</code> fields are 2019 Ateneo figures or are
            unsourced. See Headline numbers.
          </li>
          <li>
            Node-level dynasty members, relationships, and geographic control have no source
            URLs.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={sectionTitle}>Corrections</h2>
        <p style={body}>
          If a figure is wrong or a source is missing, open a data-update issue:{" "}
          <a
            href="https://github.com/dat-angel/openpinas/issues/new?template=data_update.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            .github/ISSUE_TEMPLATE/data_update.md
          </a>
          .
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={sectionTitle}>License</h2>
        <p style={body}>
          JSON research data is{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            CC BY 4.0
          </a>
          , per <code>LICENSE-DATA</code>. Code is MIT.
        </p>
      </section>

      <section>
        <h2 style={sectionTitle}>Related projects</h2>
        <p style={body}>
          Work we consult or that covers the same ground. These are related projects, not
          claims that OpenPinas copied a dataset unless Headline numbers say so.
        </p>
        <div style={{ display: "grid", gap: 24 }}>
          {RELATED.map((section) => (
            <section
              key={section.title}
              style={{
                background: T.surface,
                border: `1px solid ${T.subtle}`,
                padding: 24,
              }}
            >
              <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: T.ink }}>{section.title}</h3>
              <p style={{ margin: "0 0 16px", color: T.muted, fontSize: 14, lineHeight: 1.6 }}>{section.description}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.links.map((item) => (
                  <li key={item.href + item.label} style={{ marginBottom: 10, fontSize: 14 }}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                      {item.label}
                    </a>
                    {item.suffix ? <span style={{ color: T.muted }}>{item.suffix}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
