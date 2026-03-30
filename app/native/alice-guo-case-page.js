"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import caseBundle from "../../corruption-tracker/data/pogo-corruption-cases-2025.json";
import styles from "./alice-guo-case.module.css";

const CASE_ID = "ALICE_GUO_2024";

const CASE_HREF = {
  ALICE_GUO_2024: "/corruption-tracker/cases/alice-guo.html",
  FLOOD_CONTROL_2025: "/corruption-tracker/cases/flood-control.html",
  POGO_TAX_2023: "/corruption-tracker/cases/pogo-tax.html",
  POGO_TRAFFICKING_2024: "/corruption-tracker/cases/pogo-trafficking.html",
};

const SOURCE_LABELS = {
  news: "News",
  senate: "Senate",
  nbi: "NBI",
  ombudsman: "Ombudsman",
  amlc: "AMLC",
  bir: "BIR",
};

function escapeHtml(text) {
  if (text == null || text === "") return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatStatus(status) {
  if (!status) return "";
  return String(status).replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function getStatusClass(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("ongoing") || s.includes("investigation")) return "ongoing";
  if (s.includes("convicted")) return "convicted";
  if (s.includes("dismissed") || s.includes("acquitted")) return "dismissed";
  if (s.includes("filed") || s.includes("trial")) return "filed";
  return "ongoing";
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatAmount(amount) {
  if (amount >= 1_000_000_000) {
    return `₱${(amount / 1_000_000_000).toFixed(1)} Billion`;
  }
  if (amount >= 1_000_000) {
    return `₱${(amount / 1_000_000).toFixed(1)} Million`;
  }
  if (amount >= 1000) {
    return `₱${(amount / 1000).toFixed(1)} Thousand`;
  }
  return `₱${amount.toLocaleString()}`;
}

function getMonthLabel(dateStr) {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function caseHref(caseId) {
  return CASE_HREF[caseId] || `/corruption-tracker/cases/`;
}

export default function AliceGuoCasePage() {
  const allCases = caseBundle.cases || [];
  const caseData = useMemo(() => allCases.find((c) => c.case_id === CASE_ID), [allCases]);

  const sortedTimeline = useMemo(() => {
    if (!caseData?.timeline?.length) return [];
    return [...caseData.timeline].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [caseData]);

  useEffect(() => {
    if (caseData?.title) {
      document.title = `OpenPinas: ${caseData.title} - Corruption Tracker`;
    }
  }, [caseData]);

  useEffect(() => {
    const cssId = "openpinas-corruption-tracker-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "/corruption-tracker/css/styles.css";
      document.head.appendChild(link);
    }
    const fontId = "openpinas-alice-fonts";
    if (!document.getElementById(fontId)) {
      const pre1 = document.createElement("link");
      pre1.rel = "preconnect";
      pre1.href = "https://fonts.googleapis.com";
      const pre2 = document.createElement("link");
      pre2.rel = "preconnect";
      pre2.href = "https://fonts.gstatic.com";
      pre2.crossOrigin = "anonymous";
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;500;600;700&family=Source+Serif+Pro:wght@400;600;700&display=swap";
      document.head.append(pre1, pre2, link);
    }
  }, []);

  if (!caseData) {
    return (
      <main style={{ padding: 24 }}>
        <p className="empty">
          <strong>Case not found:</strong> {CASE_ID}
        </p>
      </main>
    );
  }

  const statusClass = getStatusClass(caseData.status);
  const timelineSearchUrl = `/interactive-timeline/index.html?search=${encodeURIComponent(caseData.title)}`;

  const facts = [];
  if (caseData.filing_date) facts.push({ label: "Filing Date", value: formatDate(caseData.filing_date) });
  if (caseData.status) facts.push({ label: "Status", value: formatStatus(caseData.status) });
  if (caseData.court_agency) facts.push({ label: "Court/Agency", value: caseData.court_agency });
  if (caseData.location) {
    const loc = [caseData.location.municipality, caseData.location.province].filter(Boolean).join(", ");
    if (loc) facts.push({ label: "Location", value: loc });
  }
  if (caseData.amount_involved_php) {
    facts.push({ label: "Amount Involved", value: formatAmount(caseData.amount_involved_php) });
  }
  if (caseData.human_trafficking_victims) {
    facts.push({ label: "Trafficking Victims", value: caseData.human_trafficking_victims.toLocaleString() });
  }

  const sources = caseData.sources || {};
  const sourceEntries = Object.entries(SOURCE_LABELS)
    .map(([key, label]) => {
      const arr = sources[key];
      if (!arr || !Array.isArray(arr) || arr.length === 0) return null;
      return { key, label, items: arr };
    })
    .filter(Boolean);

  return (
    <>
      <header>
        <nav className="header-nav">
          <Link href="/">← OpenPinas</Link>
          {" · "}
          <Link href="/corruption-tracker/index.html">Corruption Tracker</Link>
          {" · "}
          <Link href="/corruption-tracker/cases/index.html">Cases</Link>
        </nav>
        <h1>OpenPinas: {caseData.title}</h1>
        <p className="subtitle">
          {caseData.category} • {formatStatus(caseData.status)}
        </p>
      </header>

      <main>
        <div className="case-header">
          <div>
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span className={`status-badge ${statusClass}`}>{formatStatus(caseData.status)}</span>
              <span className="category-tag">{escapeHtml(caseData.category)}</span>
              {caseData.priority === "high" ? (
                <span
                  style={{
                    background: "var(--accent-2, #c44900)",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 600,
                  }}
                >
                  High Priority
                </span>
              ) : null}
            </div>
            <div className="meta">
              <span>
                <strong>Filed:</strong> {formatDate(caseData.filing_date)}
              </span>
              <span>
                <strong>Court/Agency:</strong> {escapeHtml(caseData.court_agency || "N/A")}
              </span>
              {caseData.location ? (
                <span>
                  <strong>Location:</strong> {escapeHtml(caseData.location.municipality || "")},{" "}
                  {escapeHtml(caseData.location.province || "")}
                </span>
              ) : null}
              {caseData.last_updated ? (
                <span>
                  <strong>Last Updated:</strong> {formatDate(caseData.last_updated)}
                </span>
              ) : null}
            </div>
            <div style={{ marginTop: 16, fontSize: 14 }}>
              <Link href={timelineSearchUrl} style={{ color: "#0038A8", textDecoration: "underline" }}>
                View related events in Timeline →
              </Link>
            </div>
          </div>
        </div>

        <div className="key-facts">
          {facts.map((f) => (
            <div key={f.label} className="fact-box">
              <div className="label">{f.label}</div>
              <div className="value">{typeof f.value === "string" ? escapeHtml(f.value) : f.value}</div>
            </div>
          ))}
        </div>

        <div className="section">
          <h2>What Happened</h2>
          {sortedTimeline.length === 0 ? (
            <div className="empty">No timeline events available.</div>
          ) : (
            <div className={styles.timeline}>
              {sortedTimeline.map((event, index) => {
                const monthLabel = getMonthLabel(event.date);
                const prevMonth = index > 0 ? getMonthLabel(sortedTimeline[index - 1].date) : null;
                const showMonth = monthLabel !== prevMonth;
                const httpSources = (event.sources || []).filter((s) => s && s.startsWith("http"));
                return (
                  <div key={`${event.date}-${event.event}-${index}`}>
                    {showMonth ? <div className={styles.monthMarker}>{monthLabel}</div> : null}
                    <article className={`card ${styles.timelineEvent}`}>
                      <h3>{escapeHtml(event.event)}</h3>
                      <div className="meta">
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <p className="description">{escapeHtml(event.description)}</p>
                      {httpSources.length > 0 ? (
                        <div className={styles.eventSources}>
                          <strong>Sources:</strong>{" "}
                          {httpSources.map((source, idx) => (
                            <span key={source}>
                              {idx > 0 ? " | " : null}
                              <a
                                href={source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="source-link"
                              >
                                Source {idx + 1}
                              </a>
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {caseData.accused?.length > 0 ? (
          <div className="section" id="accusedSection">
            <h2>Who&apos;s Involved</h2>
            <div id="accusedContent">
              {caseData.accused.map((accused) => (
                <div
                  key={accused.name}
                  style={{
                    marginBottom: 20,
                    padding: 16,
                    background: "rgba(18, 69, 89, 0.05)",
                    borderRadius: 8,
                    borderLeft: "3px solid var(--accent)",
                  }}
                >
                  <h3 style={{ margin: "0 0 8px", color: "var(--accent)" }}>{escapeHtml(accused.name)}</h3>
                  {accused.aliases?.length ? (
                    <p style={{ margin: "4px 0", color: "var(--muted)", fontSize: 14 }}>
                      <strong>Aliases:</strong> {accused.aliases.join(", ")}
                    </p>
                  ) : null}
                  {accused.position ? (
                    <p style={{ margin: "4px 0" }}>
                      <strong>Position:</strong> {escapeHtml(accused.position)}
                    </p>
                  ) : null}
                  {accused.position_dates ? (
                    <p style={{ margin: "4px 0", color: "var(--muted)", fontSize: 14 }}>
                      {escapeHtml(accused.position_dates)}
                    </p>
                  ) : null}
                  {accused.nationality_claimed || accused.nationality_alleged ? (
                    <p style={{ margin: "4px 0", color: "var(--muted)", fontSize: 14 }}>
                      <strong>Nationality:</strong> Claimed: {accused.nationality_claimed || "N/A"}, Alleged:{" "}
                      {accused.nationality_alleged || "N/A"}
                    </p>
                  ) : null}
                  {accused.current_status ? (
                    <p style={{ margin: "4px 0" }}>
                      <strong>Current Status:</strong> {escapeHtml(accused.current_status)}
                    </p>
                  ) : null}
                  {accused.status ? (
                    <p style={{ margin: "4px 0", color: "var(--muted)", fontSize: 14 }}>
                      <strong>Case Status:</strong> {escapeHtml(accused.status)}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {caseData.pogo_connections?.length > 0 ? (
          <div className="section" id="pogoSection">
            <h2>POGO Operations</h2>
            <div id="pogoContent">
              {caseData.pogo_connections.map((conn) => (
                <div
                  key={conn.company}
                  style={{
                    marginBottom: 20,
                    padding: 16,
                    background: "rgba(18, 69, 89, 0.05)",
                    borderRadius: 8,
                    borderLeft: "3px solid var(--accent)",
                  }}
                >
                  <h3 style={{ margin: "0 0 8px", color: "var(--accent)" }}>{escapeHtml(conn.company)}</h3>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Location:</strong> {escapeHtml(conn.location || "N/A")}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Connection Type:</strong> {escapeHtml(conn.connection_type || "N/A")}
                  </p>
                  <p style={{ margin: "4px 0" }}>{escapeHtml(conn.description || "")}</p>
                  {conn.status ? (
                    <p style={{ margin: "4px 0" }}>
                      <strong>Status:</strong> {escapeHtml(conn.status)}
                    </p>
                  ) : null}
                  {conn.date_raided ? (
                    <p style={{ margin: "4px 0" }}>
                      <strong>Date Raided:</strong> {formatDate(conn.date_raided)}
                    </p>
                  ) : null}
                  {conn.victims_rescued ? (
                    <p style={{ margin: "4px 0", color: "var(--accent-2)" }}>
                      <strong>Victims Rescued:</strong> {conn.victims_rescued.toLocaleString()}
                    </p>
                  ) : null}
                  {conn.permit_issued_by ? (
                    <p style={{ margin: "4px 0", color: "var(--muted)", fontSize: 14 }}>
                      <strong>Permit Issued By:</strong> {escapeHtml(conn.permit_issued_by)}
                    </p>
                  ) : null}
                  {conn.license_status ? (
                    <p style={{ margin: "4px 0", color: "var(--muted)", fontSize: 14 }}>
                      <strong>License Status:</strong> {escapeHtml(conn.license_status)}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {caseData.charges?.length > 0 ? (
          <div className="section" id="chargesSection">
            <h2>Charges</h2>
            <div id="chargesContent">
              <ul>
                {caseData.charges.map((c) => (
                  <li key={c}>{escapeHtml(c)}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {caseData.political_connections?.length > 0 ? (
          <div className="section" id="politicalSection">
            <h2>Political Ties</h2>
            <div id="politicalContent">
              {caseData.political_connections.map((conn, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: 16,
                    padding: 12,
                    background: "rgba(18, 69, 89, 0.05)",
                    borderRadius: 8,
                  }}
                >
                  <p style={{ margin: "4px 0" }}>
                    <strong>Type:</strong> {escapeHtml(conn.connection_type || "N/A")}
                  </p>
                  <p style={{ margin: "4px 0" }}>{escapeHtml(conn.description || "")}</p>
                  {conn.details ? (
                    <p style={{ margin: "4px 0", color: "var(--muted)", fontSize: 14 }}>
                      {escapeHtml(conn.details)}
                    </p>
                  ) : null}
                  {conn.dynasty ? (
                    <p style={{ margin: "4px 0", color: "var(--muted)", fontSize: 14 }}>
                      <strong>Dynasty:</strong>{" "}
                      <Link
                        href={`/dynasties-network-visualization.html#${encodeURIComponent(conn.dynasty.replace(/ /g, "_"))}`}
                        style={{ color: "#0038A8", textDecoration: "underline" }}
                      >
                        {escapeHtml(conn.dynasty)}
                      </Link>
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {caseData.significance || caseData.diaspora_impact ? (
          <div className="section" id="significanceSection">
            <h2>Why This Matters</h2>
            <div id="significanceContent">
              {caseData.significance ? (
                <p>
                  <strong>Significance:</strong> {escapeHtml(caseData.significance)}
                </p>
              ) : null}
              {caseData.diaspora_impact ? (
                <p
                  style={{
                    marginTop: 16,
                    padding: 12,
                    background: "rgba(18, 69, 89, 0.05)",
                    borderLeft: "3px solid var(--accent)",
                  }}
                >
                  <strong>Diaspora Impact:</strong> {escapeHtml(caseData.diaspora_impact)}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {caseData.related_cases?.length > 0 ? (
          <div className="section" id="relatedSection">
            <h2>Related Cases</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {caseData.related_cases.map((rid) => {
                const related = allCases.find((c) => c.case_id === rid);
                if (!related) return null;
                return (
                  <Link
                    key={rid}
                    href={caseHref(rid)}
                    style={{
                      display: "block",
                      padding: 12,
                      background: "rgba(18, 69, 89, 0.05)",
                      borderRadius: 8,
                      borderLeft: "3px solid var(--accent)",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <strong style={{ color: "var(--accent)" }}>{escapeHtml(related.title)}</strong>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>
                      {escapeHtml(related.category)} • {formatStatus(related.status)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        {sourceEntries.length > 0 ? (
          <div className="section" id="sourcesSection">
            <h2>Sources</h2>
            <div id="sourcesContent">
              {sourceEntries.map(({ key, label, items }) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <h3 style={{ marginTop: 0 }}>{label}</h3>
                  <ul>
                    {items.map((source, i) =>
                      source && source.startsWith("http") ? (
                        <li key={i}>
                          <a href={source} target="_blank" rel="noopener noreferrer" className="source-link">
                            {source}
                          </a>
                        </li>
                      ) : (
                        <li key={i}>{escapeHtml(source)}</li>
                      )
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>

      <footer>
        <p>
          Part of <Link href="/">OpenPinas</Link>
        </p>
        <p>
          <a href="https://github.com/dat-angel/openpinas" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{" "}
          ·{" "}
          <a href="https://ko-fi.com/beatrizd" target="_blank" rel="noopener noreferrer">
            Support
          </a>{" "}
          · Data: CC BY 4.0
        </p>
      </footer>
    </>
  );
}
