"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { mountDynastyMap } from "./mountDynastyMap";
import "leaflet/dist/leaflet.css";
import "./dynasty-map.css";

export default function DynastyNetworkMapClient() {
  const rootRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;

    (async () => {
      const [{ Network, DataSet }, leafletMod] = await Promise.all([
        import("vis-network/standalone"),
        import("leaflet"),
      ]);
      if (cancelled || !rootRef.current) return;
      const L = leafletMod.default;
      apiRef.current = mountDynastyMap(rootRef.current, {
        Network,
        DataSet,
        L,
      });
    })();

    return () => {
      cancelled = true;
      apiRef.current?.destroy();
      apiRef.current = null;
    };
  }, []);

  const closeInfo = () => apiRef.current?.closeInfoPanel();
  const closeGlossary = () => apiRef.current?.closeGlossaryPanel();

  return (
    <div className="dynastyMapRoot" ref={rootRef}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <Link
              href="/"
              style={{ color: "white", textDecoration: "none", fontSize: "20px", fontWeight: 600 }}
            >
              OpenPinas
            </Link>
            <span style={{ fontSize: "12px", opacity: 0.8 }} id="lastUpdated">
              Last updated: Loading...
            </span>
          </div>
          <h1>Philippine Political Dynasties Network Map - Historical & Contemporary</h1>
          <p>
            Interactive network visualization of Philippine political dynasties throughout history,
            their relationships, alliances, rivalries, and geographic territorial control
          </p>
        </div>
      </header>

      <div className="controls">
        <label>
          <input type="checkbox" id="showAlliances" defaultChecked /> Show Alliances
        </label>
        <label>
          <input type="checkbox" id="showRivalries" defaultChecked /> Show Rivalries
        </label>
        <label>
          <input type="checkbox" id="showCorruption" defaultChecked /> Show Corruption Networks
        </label>
        <select id="filterPower">
          <option value="all">All Power Levels</option>
          <option value="national">National</option>
          <option value="regional">Regional</option>
        </select>
        <select id="filterCrisis">
          <option value="all">All Status</option>
          <option value="crisis">Crisis Status</option>
          <option value="stable">Stable</option>
        </select>
        <select id="filterRegion">
          <option value="all">All Regions</option>
          <option value="luzon">Luzon</option>
          <option value="visayas">Visayas</option>
          <option value="mindanao">Mindanao</option>
        </select>
        <button type="button" id="resetView">
          Reset View
        </button>
        <button type="button" id="showGlossary">
          Glossary
        </button>
        <button type="button" id="toggleView">
          Show Map View
        </button>
      </div>

      <div className="stats" id="stats">
        <h4>Network Statistics</h4>
        <p id="dynastyCount">Loading...</p>
        <p id="relationshipCount">Loading...</p>
      </div>

      <div className="info-panel" id="infoPanel">
        <button type="button" className="close" onClick={closeInfo} aria-label="Close">
          ×
        </button>
        <div id="infoContent" />
      </div>

      <div className="glossary-panel" id="glossaryPanel">
        <button
          type="button"
          className="close"
          onClick={closeGlossary}
          aria-label="Close glossary"
          style={{
            float: "right",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#666",
          }}
        >
          ×
        </button>
        <h3>Glossary of Terms</h3>
        <div id="glossaryContent">
          <div className="term">
            <div className="term-name">Imperial Dynasty</div>
            <div className="term-def">
              Highest level of political dynasty power. Controls national-level positions and has
              extensive influence across multiple regions.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Dominant Dynasty</div>
            <div className="term-def">
              Very high power dynasty with strong regional control and significant national influence.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Major Dynasty</div>
            <div className="term-def">
              High power dynasty with substantial regional control and multiple family members in
              office.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Established Dynasty</div>
            <div className="term-def">
              Moderate-high power dynasty with stable regional control and established political
              presence.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Rising Dynasty</div>
            <div className="term-def">
              Growing power dynasty that is expanding its political influence and control.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Minor Dynasty</div>
            <div className="term-def">
              Lower power dynasty with limited regional control and fewer positions held.
            </div>
          </div>
          <div className="term">
            <div className="term-name">New Dynasty</div>
            <div className="term-def">
              Recently established political dynasty just beginning to build political power.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Alliance</div>
            <div className="term-def">
              Political partnership between dynasties, often for mutual support and shared interests.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Rivalry</div>
            <div className="term-def">
              Political opposition or competition between dynasties, often involving conflicts over
              power or territory.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Corruption Network</div>
            <div className="term-def">
              Connections between dynasties and contractors/officials involved in corrupt practices,
              particularly in infrastructure projects.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Power Level: National</div>
            <div className="term-def">
              Dynasty has members in national positions (President, Vice President, Senators,
              Cabinet Secretaries).
            </div>
          </div>
          <div className="term">
            <div className="term-name">Power Level: Regional</div>
            <div className="term-def">
              Dynasty primarily controls regional positions (Governors, Mayors, Congressional
              Districts).
            </div>
          </div>
          <div className="term">
            <div className="term-name">Crisis Level: Critical</div>
            <div className="term-def">
              Dynasty facing severe challenges such as legal proceedings, impeachment, or major
              scandals.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Crisis Level: High</div>
            <div className="term-def">
              Dynasty facing significant challenges including investigations, business scandals, or
              electoral losses.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Control Strength: Absolute</div>
            <div className="term-def">
              Dynasty controls all major positions in a province (Governor, Vice Governor, all
              Congressional seats, Mayor of capital).
            </div>
          </div>
          <div className="term">
            <div className="term-name">Complete Monopoly</div>
            <div className="term-def">
              Single family controls all top positions in a province, effectively eliminating political
              competition.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Contested Control</div>
            <div className="term-def">
              Multiple dynasties competing for control of the same region, often involving conflicts.
            </div>
          </div>
          <div className="term">
            <div className="term-name">Pork Barrel Scam</div>
            <div className="term-def">
              Corruption scheme where legislators allocate government funds to fake NGOs in exchange
              for kickbacks.
            </div>
          </div>
          <div className="term">
            <div className="term-name">ICC (International Criminal Court)</div>
            <div className="term-def">
              International tribunal that prosecutes individuals for crimes against humanity,
              genocide, and war crimes.
            </div>
          </div>
          <div className="term">
            <div className="term-name">DPWH (Department of Public Works and Highways)</div>
            <div className="term-def">
              Philippine government agency responsible for infrastructure projects, often involved in
              corruption scandals.
            </div>
          </div>
        </div>
      </div>

      <div className="methodology">
        <h4>Methodology Notes (Prototype)</h4>
        <p>
          Data is compiled from public reporting and historical records. Some 2025 events are
          hypothetical to test narrative structure.
        </p>
        <ul>
          <li>
            <strong>Rappler Politics:</strong>{" "}
            <a href="https://www.rappler.com/nation/politics/" target="_blank" rel="noopener noreferrer">
              Contemporary reporting →
            </a>
          </li>
          <li>
            <strong>Bilyonaryo:</strong>{" "}
            <a href="https://bilyonaryo.com/" target="_blank" rel="noopener noreferrer">
              Business and political coverage →
            </a>
          </li>
          <li>
            <strong>Wikipedia:</strong>{" "}
            <a href="https://www.wikipedia.org/" target="_blank" rel="noopener noreferrer">
              Historical references →
            </a>
          </li>
        </ul>
      </div>

      <div id="main-content">
        <div id="network-container" />
        <div
          id="map-container"
          style={{
            display: "none",
            width: "100%",
            height: "calc(100vh - 180px)",
            position: "relative",
          }}
        />
      </div>

      <div className="legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <div className="legend-shape legend-star" style={{ color: "#0038A8" }}>
            ★
          </div>
          <span>Imperial Dynasty (★)</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-shape legend-ellipse"
            style={{ background: "#CE1126", border: "2px solid #8B0000" }}
          />
          <span>Dominant Dynasty (●)</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-shape legend-box"
            style={{ background: "#0066CC", border: "2px solid #003D7A" }}
          />
          <span>Major Dynasty (■)</span>
        </div>
        <div className="legend-item">
          <div className="legend-shape legend-triangle" style={{ borderBottomColor: "#DC143C" }} />
          <span>Established Dynasty (▲)</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-shape legend-diamond"
            style={{ background: "#FFD700", border: "2px solid #B8860B" }}
          />
          <span>Rising Dynasty (◆)</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-shape legend-ellipse"
            style={{ background: "#228B22", border: "2px solid #006400" }}
          />
          <span>Minor Dynasty (●)</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-shape legend-ellipse"
            style={{ background: "#FF6B35", border: "2px solid #CC5500" }}
          />
          <span>New Dynasty (●)</span>
        </div>
        <div className="legend-item">
          <div className="legend-line" style={{ background: "#0038A8" }} />
          <span>Alliance (—)</span>
        </div>
        <div className="legend-item">
          <div className="legend-line dashed" style={{ borderColor: "#CE1126" }} />
          <span>Rivalry (┄)</span>
        </div>
        <div className="legend-item">
          <div className="legend-line" style={{ background: "#FFD700", height: "4px" }} />
          <span>Corruption Network (≡)</span>
        </div>
        <div className="legend-item">
          <div className="legend-line" style={{ background: "#0066CC" }} />
          <span>Marriage (—)</span>
        </div>
      </div>
    </div>
  );
}
