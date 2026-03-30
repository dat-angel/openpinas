"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import data2025 from "../../philippines-2025-timeline.json";
import data2026 from "../../philippines-2026-timeline.json";

const TIMELINE_FILES = {
  "2025": data2025,
  "2026": data2026,
};

const categoryIcons = {
  Political: "🏛️",
  Cultural: "🎭",
  "Natural Disasters": "🌀",
  Economic: "📊",
  "International Relations": "🌐",
  Legal: "⚖️",
  Religious: "✝️",
  "OFW/Diaspora": "✈️",
};

const categoryMap = {
  Political: "politics",
  Cultural: "culture",
  "Natural Disasters": "weather",
  Economic: "politics",
  "International Relations": "politics",
  Legal: "politics",
  Religious: "culture",
  "OFW/Diaspora": "politics",
};

function normalizeEntries(data) {
  return (data.timeline || []).map((event) => ({
    date: event.date,
    title: event.title,
    theme: categoryMap[event.category] || String(event.category || "").toLowerCase(),
    category: event.category,
    categoryIcon: categoryIcons[event.category] || "📌",
    description: event.description,
    significance: event.significance,
    diaspora_impact: event.diaspora_impact,
    mentioned_dynasties: event.mentioned_dynasties || [],
    sources: event.sources || {},
    weekly_review: event.weekly_review || null,
  }));
}

const monthLabel = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

const formatDate = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

function SourceLinks({ sources }) {
  if (!sources) return null;
  const parts = [];

  if (sources.international) {
    if (typeof sources.international === "string" && sources.international.startsWith("http")) {
      parts.push(
        <a key="int" href={sources.international} target="_blank" rel="noopener noreferrer">
          International Source
        </a>
      );
    } else if (Array.isArray(sources.international)) {
      sources.international.forEach((src, idx) => {
        if (src && src.startsWith("http")) {
          parts.push(
            <a key={`int-${idx}`} href={src} target="_blank" rel="noopener noreferrer">
              International {idx + 1}
            </a>
          );
        }
      });
    }
  }

  if (sources.local && Array.isArray(sources.local)) {
    sources.local.forEach((src, idx) => {
      if (src && src.startsWith("http")) {
        parts.push(
          <a key={`loc-${idx}`} href={src} target="_blank" rel="noopener noreferrer">
            Local {idx + 1}
          </a>
        );
      }
    });
  }

  if (parts.length === 0) return null;

  return (
    <span>
      {parts.map((el, i) => (
        <span key={i}>
          {i > 0 ? " | " : null}
          {el}
        </span>
      ))}
    </span>
  );
}

export default function InteractiveTimelinePage() {
  const [year, setYear] = useState("2025");
  const [entries, setEntries] = useState(() => normalizeEntries(TIMELINE_FILES["2025"]));
  const [yearInfo, setYearInfo] = useState("");
  const [headerUpdated, setHeaderUpdated] = useState("Loading...");
  const [weatherOn, setWeatherOn] = useState(true);
  const [politicsOn, setPoliticsOn] = useState(true);
  const [cultureOn, setCultureOn] = useState(true);
  const [query, setQuery] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    const id = "openpinas-interactive-timeline-styles";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "/interactive-timeline/styles.css";
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  useEffect(() => {
    const raw = TIMELINE_FILES[year];
    const normalized = normalizeEntries(raw);
    setEntries(normalized);

    const meta = raw.metadata;
    if (meta) {
      const totalEvents = meta.total_events || raw.timeline.length;
      const lastUpdated = meta.last_updated || "Unknown";
      setYearInfo(`${totalEvents} events | Last updated: ${lastUpdated}`);
      setHeaderUpdated(`Last updated: ${lastUpdated}`);
    } else {
      setYearInfo(`${raw.timeline.length} events`);
      setHeaderUpdated("Last updated: Unknown");
    }
  }, [year]);

  const filtered = useMemo(() => {
    const active = new Set();
    if (weatherOn) active.add("weather");
    if (politicsOn) active.add("politics");
    if (cultureOn) active.add("culture");

    let list = entries.filter((e) => active.has(e.theme));
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.date.includes(q));
    }
    list = [...list].sort((a, b) =>
      sortAscending ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
    );
    return list;
  }, [entries, weatherOn, politicsOn, cultureOn, query, sortAscending]);

  const grouped = useMemo(() => {
    const rows = [];
    let currentMonth = "";
    for (const entry of filtered) {
      const label = monthLabel(entry.date);
      if (label !== currentMonth) {
        currentMonth = label;
        rows.push({ type: "month", label });
      }
      rows.push({ type: "entry", entry });
    }
    return rows;
  }, [filtered]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Link href="/" style={{ color: "var(--ink, #1a1a1a)", textDecoration: "none", fontSize: 20, fontWeight: 600 }}>
            OpenPinas
          </Link>
          <span style={{ fontSize: 12, color: "var(--muted, #5e5e5e)" }}>{headerUpdated}</span>
        </div>
        <h1>Philippines Timeline</h1>
        <p>
          Comprehensive interactive timeline of major Philippine events. Categories cover politics, weather, and culture, with
          sources linked on each entry.
        </p>

        <div className="year-tabs">
          {(["2025", "2026"]).map((y) => (
            <button
              key={y}
              type="button"
              className={`year-tab${year === y ? " active" : ""}`}
              data-year={y}
              onClick={() => setYear(y)}
            >
              {y}
            </button>
          ))}
        </div>

        <div id="aggregation-note" className={`aggregation-note${year === "2026" ? " visible" : ""}`}>
          <strong>Note:</strong> The 2026 timeline is aggregated by month as events unfold. For more detailed coverage, see
          the{" "}
          <Link href="/weekly-reviews/index.html">Weekly Reviews</Link> or{" "}
          <Link href="/monthly-reviews/index.html">Monthly Reviews</Link>.
        </div>

        <p id="year-info" className="year-info">
          {yearInfo}
        </p>

        <div className="controls">
          <label className="filter">
            <input type="checkbox" checked={weatherOn} onChange={() => setWeatherOn((v) => !v)} value="weather" />{" "}
            <span aria-hidden="true">🌀</span> Weather
          </label>
          <label className="filter">
            <input type="checkbox" checked={politicsOn} onChange={() => setPoliticsOn((v) => !v)} value="politics" />{" "}
            <span aria-hidden="true">🏛️</span> Politics
          </label>
          <label className="filter">
            <input type="checkbox" checked={cultureOn} onChange={() => setCultureOn((v) => !v)} value="culture" />{" "}
            <span aria-hidden="true">🎭</span> Culture
          </label>
          <input
            type="search"
            id="search"
            placeholder="Search titles or dates"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" id="sortOrder" onClick={() => setSortAscending((v) => !v)}>
            Sort: {sortAscending ? "Oldest" : "Newest"}
          </button>
          <span id="count" aria-live="polite">
            {filtered.length} entries
          </span>
        </div>
      </header>

      <main id="main-content">
        <section className="timeline" aria-label="Timeline entries">
          {filtered.length === 0 ? (
            <div className="empty">No entries match your filters.</div>
          ) : (
            grouped.map((row) =>
              row.type === "month" ? (
                <div key={row.label} className="month-marker">
                  {row.label}
                </div>
              ) : (
                <article
                  key={`${row.entry.date}-${row.entry.title}`}
                  className="card"
                  style={{ borderLeftColor: `var(--${row.entry.theme})` }}
                >
                  <h3>{row.entry.title}</h3>
                  <div className="meta">
                    <span>{formatDate(row.entry.date)}</span>
                    <span className={`tag ${row.entry.theme}`}>
                      <span className="tag-icon" aria-hidden="true">
                        {row.entry.categoryIcon}
                      </span>
                      {row.entry.category || row.entry.theme}
                    </span>
                    <SourceLinks sources={row.entry.sources} />
                  </div>
                  {row.entry.description ? <p className="description">{row.entry.description}</p> : null}
                  {row.entry.significance ? (
                    <p className="significance">
                      <strong>Significance:</strong> {row.entry.significance}
                    </p>
                  ) : null}
                  {row.entry.diaspora_impact ? (
                    <p className="diaspora">
                      <strong>Diaspora Impact:</strong> {row.entry.diaspora_impact}
                    </p>
                  ) : null}
                  {row.entry.mentioned_dynasties?.length ? (
                    <div className="dynasties">
                      <strong>Mentioned Dynasties:</strong>{" "}
                      {row.entry.mentioned_dynasties.map((d, i) => {
                        const slug = d.toLowerCase().replace(/_/g, "-");
                        const label = d.replace(/_/g, " ");
                        return (
                          <span key={d}>
                            {i > 0 ? ", " : null}
                            <a href={`/dynasties/${slug}.html`} className="dynasty-link">
                              {label}
                            </a>
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                  {row.entry.weekly_review ? (
                    <div className="weekly-review-link">
                      <a
                        href={`/${row.entry.weekly_review.replace(/^(\.\.\/|\.\/)+/, "").replace(/^\//, "")}`}
                      >
                        📰 View Weekly Review
                      </a>
                    </div>
                  ) : null}
                </article>
              )
            )
          )}
        </section>
      </main>

      <section className="methodology">
        <h2>Methodology Notes (Prototype)</h2>
        <p>
          Timeline entries are compiled from public reporting. Some 2025 items are placeholders to test filters, category
          mapping, and cross-links.
        </p>
        <ul>
          <li>
            <strong>Rappler Politics:</strong>{" "}
            <a href="https://www.rappler.com/nation/politics/" target="_blank" rel="noopener noreferrer">
              Current events coverage →
            </a>
          </li>
          <li>
            <strong>Bilyonaryo:</strong>{" "}
            <a href="https://bilyonaryo.com/" target="_blank" rel="noopener noreferrer">
              Business and political reporting →
            </a>
          </li>
          <li>
            <strong>Wikipedia:</strong>{" "}
            <a href="https://www.wikipedia.org/" target="_blank" rel="noopener noreferrer">
              Background references →
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}
