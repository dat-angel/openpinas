"use client";

import { useEffect, useMemo } from "react";
import caseData from "../../corruption-tracker/data/pogo-corruption-cases-2025.json";

function formatStatsDisplay(stats) {
  const totalCases = stats.total_cases ?? 0;
  const ongoing =
    (stats.by_status?.ongoing_investigation ?? 0) + (stats.by_status?.ongoing ?? 0);
  const victims = stats.human_trafficking_victims ?? 0;
  const victimStr = victims > 0 ? victims.toLocaleString() : "0";
  const amount = stats.total_amount_php ?? 0;
  let amountStr = "N/A";
  if (amount > 0) {
    if (amount >= 1_000_000_000) {
      amountStr = `₱${(amount / 1_000_000_000).toFixed(1)}B`;
    } else if (amount >= 1_000_000) {
      amountStr = `₱${(amount / 1_000_000).toFixed(1)}M`;
    } else {
      amountStr = `₱${amount.toLocaleString()}`;
    }
  }
  return { totalCases, ongoing, victimStr, amountStr };
}

export default function CorruptionTrackerIndexPage() {
  const display = useMemo(() => {
    const stats = caseData.statistics || {};
    return formatStatsDisplay(stats);
  }, []);

  useEffect(() => {
    const id = "openpinas-corruption-tracker-css";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "/corruption-tracker/css/styles.css";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header>
        <nav className="header-nav">
          <a href="/">← OpenPinas</a>
        </nav>
        <h1>Corruption &amp; POGO Cases</h1>
        <p className="subtitle">Who&apos;s being investigated, who got caught, and what it means</p>
      </header>

      <main id="main-content">
        <div className="cards">
          <a href="/corruption-tracker/cases/" className="card">
            <h2>All Cases</h2>
            <p>
              See what cases are open, who&apos;s been convicted, and what&apos;s still under investigation. Filter by type
              or search for specific people or places.
            </p>
          </a>

          <a href="/corruption-tracker/cases/alice-guo.html" className="card">
            <h2>🔍 Alice Guo Case</h2>
            <p>
              The mayor who might not actually be Filipino. Timeline of the identity fraud case and her POGO connections in
              Bamban. <strong>Convicted November 2025 - Life imprisonment.</strong>
            </p>
          </a>

          <a href="/corruption-tracker/cases/flood-control.html" className="card">
            <h2>🌊 Flood Control Corruption</h2>
            <p>
              ₱118.5 billion misused in over 9,800 flood control projects. House Speaker and Senate President resigned.
              Follow the money trail and see who&apos;s connected.
            </p>
          </a>

          <a href="/corruption-tracker/cases/index.html#statistics" className="card">
            <h2>By the Numbers</h2>
            <p>How many cases, how many victims, how much money involved. The stats that matter.</p>
          </a>

          <a href="/corruption-tracker/network.html" className="card">
            <h2>Network View</h2>
            <p>
              See how cases, accused parties, POGO operations, and dynasties connect. Interactive network visualization.
            </p>
          </a>

          <a href="/corruption-tracker/map.html" className="card">
            <h2>Map View</h2>
            <p>Where are these cases happening? See case locations across the Philippines on an interactive map.</p>
          </a>
        </div>

        <div className="stats" id="stats">
          <div className="stat">
            <p className="number" id="totalCases">
              {display.totalCases}
            </p>
            <p className="label">Total Cases</p>
          </div>
          <div className="stat">
            <p className="number" id="ongoingCases">
              {display.ongoing}
            </p>
            <p className="label">Ongoing</p>
          </div>
          <div className="stat">
            <p className="number" id="traffickingVictims">
              {display.victimStr}
            </p>
            <p className="label">Trafficking Victims</p>
          </div>
          <div className="stat">
            <p className="number" id="totalAmount">
              {display.amountStr}
            </p>
            <p className="label">Amount Involved</p>
          </div>
        </div>

        <div className="info-section">
          <h2>What This Is</h2>
          <p>
            I started tracking corruption cases because it&apos;s hard to keep up with who&apos;s being investigated, who
            got away with it, and who actually faced consequences.
          </p>
          <p>
            <strong>Current Focus:</strong>
          </p>
          <ul>
            <li>
              <strong>POGO-related cases</strong> including identity fraud, human trafficking, tax evasion, and corruption.
              The tracker includes high-profile cases like the Alice Guo investigation (convicted November 2025).
            </li>
            <li>
              <strong>Flood Control Corruption</strong> - ₱118.5 billion misused in infrastructure projects. Led to
              resignation of House Speaker Martin Romualdez and Senate President Francis Escudero.
            </li>
          </ul>
          <p>
            This isn&apos;t complete. Cases move fast, news is scattered, and some things never make headlines. But
            it&apos;s a start.
          </p>
        </div>
      </main>

      <footer>
        <p>
          Part of <a href="/">OpenPinas</a>
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
