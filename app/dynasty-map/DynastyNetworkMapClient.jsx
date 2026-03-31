"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { mountDynastyMap } from "./mountDynastyMap";
import "leaflet/dist/leaflet.css";
import "./dynasty-map.css";

const STORY_PRESETS = [
  {
    id: "marcos-duterte",
    label: "Power Split: Marcos vs Duterte",
    primary: "MARCOS_ROMUALDEZ",
    secondary: "DUTERTE_FAMILY",
    window: 365,
  },
  {
    id: "anti-dynasty",
    label: "Reform Tension: Anti-Dynasty Push",
    primary: "MARCOS_ROMUALDEZ",
    secondary: "DY_FAMILY",
    window: 365,
  },
  {
    id: "local-strongholds",
    label: "Provincial Strongholds",
    primary: "REVILLA_TOLENTINO",
    secondary: "GARCIA_FAMILY",
    window: 730,
  },
];

function toDynastyLabel(id, dynasties) {
  return dynasties.find((d) => d.id === id)?.name || id.replaceAll("_", " ");
}

export default function DynastyNetworkMapClient() {
  const rootRef = useRef(null);
  const apiRef = useRef(null);
  const [dynasties, setDynasties] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [selectedDynastyId, setSelectedDynastyId] = useState("");
  const [compareDynastyId, setCompareDynastyId] = useState("");
  const [timelineWindowDays, setTimelineWindowDays] = useState(365);
  const [searchText, setSearchText] = useState("");

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
      }, {
        onSelectDynasty: (dynasty) => {
          if (dynasty?.id) {
            setSelectedDynastyId(dynasty.id);
          }
        },
      });
    })();

    return () => {
      cancelled = true;
      apiRef.current?.destroy();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [networkRes, timelineRes] = await Promise.all([
        fetch("/dynasty-map/philippine-political-dynasties-network-2025.json"),
        fetch("/dynasty-map/philippines-2026-timeline.json"),
      ]);
      if (!networkRes.ok || !timelineRes.ok) return;
      const networkJson = await networkRes.json();
      const timelineJson = await timelineRes.json();
      if (cancelled) return;
      const loadedDynasties = networkJson?.philippine_political_dynasties_network?.nodes?.dynasties || [];
      const loadedTimeline = timelineJson?.timeline || [];
      setDynasties(loadedDynasties);
      setTimeline(loadedTimeline);
      if (loadedDynasties[0]?.id) {
        setSelectedDynastyId(loadedDynasties[0].id);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const spotlightIds = useMemo(
    () => [selectedDynastyId, compareDynastyId].filter(Boolean),
    [selectedDynastyId, compareDynastyId],
  );

  const timelineAnchor = useMemo(() => {
    if (!timeline.length) return null;
    return new Date(
      timeline.reduce((maxDate, e) => (e.date > maxDate ? e.date : maxDate), timeline[0].date),
    );
  }, [timeline]);

  const filteredEvents = useMemo(() => {
    if (!timeline.length || !spotlightIds.length || !timelineAnchor) return [];
    const minDate = new Date(timelineAnchor);
    minDate.setDate(minDate.getDate() - timelineWindowDays);
    return timeline
      .filter((event) => {
        if (!event?.mentioned_dynasties?.length) return false;
        const eventDate = new Date(`${event.date}T00:00:00`);
        return (
          eventDate >= minDate &&
          event.mentioned_dynasties.some((dynastyId) => spotlightIds.includes(dynastyId))
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 10);
  }, [timeline, spotlightIds, timelineAnchor, timelineWindowDays]);

  const selectedDynasty = useMemo(
    () => dynasties.find((d) => d.id === selectedDynastyId) || null,
    [dynasties, selectedDynastyId],
  );
  const compareDynasty = useMemo(
    () => dynasties.find((d) => d.id === compareDynastyId) || null,
    [dynasties, compareDynastyId],
  );

  const focusDynasty = (dynastyId) => {
    if (!dynastyId) return;
    setSelectedDynastyId(dynastyId);
    window.location.hash = `dynasty-${encodeURIComponent(dynastyId)}`;
    if (window.__OPENPINAS_DYNASTY_MAP__?.showDynastyById) {
      window.__OPENPINAS_DYNASTY_MAP__.showDynastyById(dynastyId);
    }
  };

  const runStory = (preset) => {
    setTimelineWindowDays(preset.window);
    setCompareDynastyId(preset.secondary);
    focusDynasty(preset.primary);
  };

  const handleSearchFocus = () => {
    const needle = searchText.trim().toLowerCase();
    if (!needle) return;
    const match = dynasties.find(
      (d) => d.name.toLowerCase().includes(needle) || d.id.toLowerCase().includes(needle),
    );
    if (match) {
      focusDynasty(match.id);
      setSearchText(match.name);
    }
  };

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

      <section
        style={{
          margin: "16px 24px",
          padding: "16px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #111827, #1f2937)",
          color: "#f9fafb",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr",
            gap: "12px",
            alignItems: "end",
          }}
        >
          <div>
            <p style={{ fontSize: "12px", opacity: 0.8, marginBottom: "6px" }}>
              Spotlight a dynasty
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Try: Marcos, Duterte, Revilla"
                list="dynasty-search-options"
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#f9fafb",
                }}
              />
              <button type="button" onClick={handleSearchFocus}>
                Focus
              </button>
            </div>
            <datalist id="dynasty-search-options">
              {dynasties.map((dynasty) => (
                <option key={dynasty.id} value={dynasty.name} />
              ))}
            </datalist>
          </div>

          <div>
            <p style={{ fontSize: "12px", opacity: 0.8, marginBottom: "6px" }}>Compare against</p>
            <select
              value={compareDynastyId}
              onChange={(e) => setCompareDynastyId(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="">None</option>
              {dynasties.map((dynasty) => (
                <option key={dynasty.id} value={dynasty.id}>
                  {dynasty.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p style={{ fontSize: "12px", opacity: 0.8, marginBottom: "6px" }}>
              Timeline window: {timelineWindowDays} days
            </p>
            <input
              type="range"
              min={90}
              max={1460}
              step={30}
              value={timelineWindowDays}
              onChange={(e) => setTimelineWindowDays(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {STORY_PRESETS.map((preset) => (
            <button key={preset.id} type="button" onClick={() => runStory(preset)}>
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section
        style={{
          margin: "0 24px 16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.4fr",
          gap: "12px",
        }}
      >
        {[selectedDynasty, compareDynasty].map((dynasty, idx) => (
          <article
            key={idx === 0 ? "selected" : "compare"}
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "14px",
              border: "1px solid #e5e7eb",
              minHeight: "190px",
            }}
          >
            <h4 style={{ marginBottom: "8px" }}>
              {idx === 0 ? "Primary Dynasty" : "Compare Dynasty"}
            </h4>
            {!dynasty ? (
              <p style={{ color: "#6b7280", fontSize: "13px" }}>Select a dynasty to compare.</p>
            ) : (
              <>
                <p style={{ fontWeight: 600 }}>{dynasty.name}</p>
                <p style={{ fontSize: "13px" }}>Power: {dynasty.power_level}</p>
                <p style={{ fontSize: "13px" }}>
                  Positions held: {dynasty.current_positions_held || 0}
                </p>
                <p style={{ fontSize: "13px" }}>Status: {dynasty["2025_status"] || "n/a"}</p>
                <p style={{ fontSize: "13px" }}>
                  Regions: {(dynasty.primary_regions || []).slice(0, 3).join(", ") || "n/a"}
                </p>
                {idx === 0 && (
                  <>
                    <p style={{ fontSize: "13px" }}>
                      Patriarch: {dynasty.patriarch || "n/a"} | Established: {dynasty.established || "n/a"}
                    </p>
                    {!!dynasty.allied_dynasties?.length && (
                      <p style={{ fontSize: "12px", color: "#1f4f9e" }}>
                        Allies:{" "}
                        {dynasty.allied_dynasties.slice(0, 4).map((allyId, i) => (
                          <span key={allyId}>
                            <a
                              href={`#dynasty-${encodeURIComponent(allyId)}`}
                              onClick={(e) => {
                                e.preventDefault();
                                focusDynasty(allyId);
                              }}
                            >
                              {toDynastyLabel(allyId, dynasties)}
                            </a>
                            {i < Math.min(dynasty.allied_dynasties.length, 4) - 1 ? ", " : ""}
                          </span>
                        ))}
                      </p>
                    )}
                    {!!dynasty.rival_dynasties?.length && (
                      <p style={{ fontSize: "12px", color: "#9b1c1c" }}>
                        Rivals:{" "}
                        {dynasty.rival_dynasties.slice(0, 4).map((rivalId, i) => (
                          <span key={rivalId}>
                            <a
                              href={`#dynasty-${encodeURIComponent(rivalId)}`}
                              onClick={(e) => {
                                e.preventDefault();
                                focusDynasty(rivalId);
                              }}
                            >
                              {toDynastyLabel(rivalId, dynasties)}
                            </a>
                            {i < Math.min(dynasty.rival_dynasties.length, 4) - 1 ? ", " : ""}
                          </span>
                        ))}
                      </p>
                    )}
                  </>
                )}
                <button type="button" onClick={() => focusDynasty(dynasty.id)}>
                  Center on network
                </button>
              </>
            )}
          </article>
        ))}

        <article
          style={{
            background: "white",
            borderRadius: "10px",
            padding: "14px",
            border: "1px solid #e5e7eb",
            minHeight: "190px",
          }}
        >
          <h4 style={{ marginBottom: "8px" }}>Recent Timeline Signals</h4>
          {!filteredEvents.length ? (
            <p style={{ color: "#6b7280", fontSize: "13px" }}>
              Pick one or two dynasties to see recent connected events.
            </p>
          ) : (
            <div style={{ maxHeight: "220px", overflowY: "auto", paddingRight: "6px" }}>
              {filteredEvents.map((event, index) => (
                <div
                  key={`${event.date}-${event.title}-${index}`}
                  style={{
                    borderBottom: index === filteredEvents.length - 1 ? "none" : "1px solid #e5e7eb",
                    paddingBottom: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <p style={{ fontSize: "11px", color: "#6b7280" }}>
                    {event.date} - {event.category || "General"}
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 600 }}>{event.title}</p>
                  <p style={{ fontSize: "12px", color: "#4b5563" }}>
                    {event.mentioned_dynasties
                      ?.slice(0, 3)
                      .map((id) => toDynastyLabel(id, dynasties))
                      .join(", ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <div className="stats" id="stats">
        <h4>Network Statistics</h4>
        <p id="dynastyCount">Loading...</p>
        <p id="relationshipCount">Loading...</p>
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
