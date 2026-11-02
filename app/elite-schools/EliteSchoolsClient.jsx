"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import VisualizationHeader from "@/app/components/VisualizationHeader";
import "leaflet/dist/leaflet.css";

const tierColors = {
  "National Elite": "#124559",
  "Leading Private": "#c44900",
  "Leading Regional": "#2b7a6d",
};

const sectorColors = {
  public_service: "#355c7d",
  business: "#6c5b7b",
  academia: "#4f6d7a",
  civil_society: "#2a9d8f",
  health: "#e76f51",
  industry: "#f4a261",
};

const pipelineToSectorId = {
  public_service: "SECTOR_PUBLIC",
  business: "SECTOR_BUSINESS",
  academia: "SECTOR_ACADEMIA",
  civil_society: "SECTOR_CIVIL",
  health: "SECTOR_HEALTH",
  industry: "SECTOR_INDUSTRY",
};

const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  surface: "#f7f7f5",
  accent: "#2d2de8",
};

function getColor(value, palette) {
  if (value >= 85) return palette[3];
  if (value >= 70) return palette[2];
  if (value >= 55) return palette[1];
  return palette[0];
}

function InfoPanel({ school }) {
  if (!school) {
    return (
      <div style={{ padding: 20, background: "#fff", border: `1px solid ${T.subtle}` }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 22 }}>Select a school node</h3>
        <p style={{ margin: 0, color: T.muted, lineHeight: 1.6 }}>
          Click a school in the network to inspect its community loops, mobility paths, and provincial retention signals.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, background: "#fff", border: `1px solid ${T.subtle}` }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <span style={{ padding: "4px 10px", borderRadius: 999, background: "#eef4f7", color: "#124559", fontSize: 12 }}>{school.tier}</span>
        <span style={{ padding: "4px 10px", borderRadius: 999, background: "#f7efe7", color: "#c44900", fontSize: 12 }}>{school.sector}</span>
      </div>
      <h3 style={{ margin: "0 0 8px", fontSize: 24 }}>{school.name}</h3>
      <p style={{ margin: 0, color: T.muted }}>
        Footprint score {school.influence_score}/100. Pipelines show where graduates work; retention shows where they stayed and built.
      </p>

      <div style={{ marginTop: 16 }}>
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted }}>
          Community loop badges
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[...school.community_loops.scholarships, ...school.community_loops.outreach, ...school.community_loops.campuses].map((badge) => (
            <span key={badge} style={{ padding: "6px 10px", borderRadius: 10, background: "#f1f6f3", fontSize: 12 }}>
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted }}>
          Mobility paths
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {school.mobility_paths.map((step) => (
            <div key={step.step} style={{ padding: "10px 12px", borderLeft: "3px solid #2b7a6d", background: T.surface }}>
              <strong style={{ display: "block", fontSize: 13 }}>{step.step}</strong>
              <span style={{ color: T.muted, fontSize: 14 }}>{step.detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted }}>
          Retention
        </p>
        <p style={{ margin: "0 0 8px", fontSize: 14 }}>
          Graduates staying in-region: <strong>{school.retention.stay_rate}%</strong>
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {school.retention.sectors.map((sector) => (
            <div key={sector.name}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.muted }}>
                <span>{sector.name}</span>
                <span>{sector.value}%</span>
              </div>
              <div style={{ marginTop: 4, height: 10, background: "#efefef", borderRadius: 999 }}>
                <div style={{ width: `${sector.value}%`, height: "100%", borderRadius: 999, background: "#c44900" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 14, background: T.surface, borderLeft: "4px solid #c44900" }}>
        <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700 }}>{school.micro_story.title}</p>
        <p style={{ margin: "0 0 6px", color: T.muted, fontSize: 14 }}>{school.micro_story.outcome}</p>
        <p style={{ margin: 0, color: T.muted, fontSize: 12 }}>
          Stayed in {school.micro_story.location} · Sector: {school.micro_story.sector}
        </p>
      </div>
    </div>
  );
}

export default function EliteSchoolsClient({ schoolsData, provinceData }) {
  const networkContainerRef = useRef(null);
  const networkRef = useRef(null);
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const provinceLayerRef = useRef(null);
  const [tierFilter, setTierFilter] = useState("all");
  const [pipelineFilter, setPipelineFilter] = useState("all");
  const [overlayFilter, setOverlayFilter] = useState("influence");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");

  const schools = schoolsData.schools || [];
  const selectedSchool = schools.find((school) => school.id === selectedSchoolId) || null;

  const graph = useMemo(() => {
    const activeSectorId = pipelineToSectorId[pipelineFilter];
    const schoolNodes = schools
      .filter((school) => tierFilter === "all" || school.tier === tierFilter)
      .map((school) => ({
        id: school.id,
        label: school.name,
        type: "school",
        title: school.name,
        size: 12 + school.influence_score / 8,
        color: tierColors[school.tier],
      }));
    const sectors = (schoolsData.sectors || [])
      .filter((sector) => pipelineFilter === "all" || sector.id === activeSectorId)
      .map((sector) => ({
        id: sector.id,
        label: sector.name,
        type: "sector",
        title: sector.name,
        size: 16,
        color: "#f2f2f2",
      }));
    const visibleIds = new Set([...schoolNodes, ...sectors].map((node) => node.id));
    const edges = (schoolsData.pipelines || []).filter((pipeline) => {
      if (!visibleIds.has(pipeline.from) || !visibleIds.has(pipeline.to)) return false;
      if (pipelineFilter !== "all" && pipeline.type !== pipelineFilter) return false;
      return true;
    });
    return { nodes: [...schoolNodes, ...sectors], edges };
  }, [schools, schoolsData.pipelines, schoolsData.sectors, tierFilter, pipelineFilter]);

  useEffect(() => {
    const root = networkContainerRef.current;
    if (!root) return;
    let cancelled = false;

    (async () => {
      const { Network, DataSet } = await import("vis-network/standalone");
      if (cancelled || !networkContainerRef.current) return;

      networkRef.current?.destroy();
      const nodes = new DataSet(
        graph.nodes.map((node) => ({
          id: node.id,
          label: node.label,
          shape: node.type === "school" ? "dot" : "box",
          size: node.size,
          color:
            node.type === "school"
              ? { background: node.color, border: "#0f2e3a" }
              : { background: node.color, border: "#c8c8c8" },
          font: { color: "#1a1a1a", face: "Inter" },
          title: node.title,
        })),
      );
      const edges = new DataSet(
        graph.edges.map((edge) => ({
          id: edge.id,
          from: edge.from,
          to: edge.to,
          color: sectorColors[edge.type] || "#999",
          width: Math.max(1.5, edge.strength / 30),
          title: `Pipeline strength: ${edge.strength}`,
        })),
      );

      const network = new Network(
        networkContainerRef.current,
        { nodes, edges },
        {
          physics: { stabilization: true, barnesHut: { springLength: 120, springConstant: 0.03 } },
          interaction: { hover: true },
        },
      );
      network.on("click", (params) => {
        if (params.nodes.length > 0 && schools.some((school) => school.id === params.nodes[0])) {
          setSelectedSchoolId(params.nodes[0]);
        }
      });
      networkRef.current = network;
    })();

    return () => {
      cancelled = true;
      networkRef.current?.destroy();
      networkRef.current = null;
    };
  }, [graph, schools]);

  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;
    let cancelled = false;

    (async () => {
      const leafletMod = await import("leaflet");
      if (cancelled || !mapRef.current) return;
      const L = leafletMod.default;
      const map = L.map(mapRef.current, { zoomControl: true }).setView([12.5, 121.8], 5.5);
      leafletRef.current = { L, map };
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      provinceLayerRef.current = L.geoJSON(provinceData, {
        style: () => ({ fillColor: "#dbe9f2", weight: 1, color: "#666", fillOpacity: 0.6 }),
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(
            `<strong>${feature.properties.province}</strong><br/>Influence: ${feature.properties.influence_score}<br/>Retention: ${feature.properties.retention_index}%`,
          );
        },
      }).addTo(map);
    })();

    return () => {
      cancelled = true;
      if (leafletRef.current?.map) {
        leafletRef.current.map.remove();
        leafletRef.current = null;
      }
    };
  }, [provinceData]);

  useEffect(() => {
    if (!provinceLayerRef.current) return;
    const selectedPresence = selectedSchool?.id;
    provinceLayerRef.current.setStyle((feature) => {
      const palette =
        overlayFilter === "retention"
          ? ["#fbe4d5", "#f4a261", "#e76f51", "#c44900"]
          : ["#dbe9f2", "#7fb3c8", "#3b84a7", "#124559"];
      const value = overlayFilter === "retention" ? feature.properties.retention_index : feature.properties.influence_score;
      const isHighlighted =
        Boolean(selectedPresence) &&
        feature.properties.school_presence &&
        feature.properties.school_presence.includes(selectedPresence);
      return {
        fillColor: getColor(value, palette),
        weight: isHighlighted ? 2.5 : 1,
        color: isHighlighted ? "#111" : "#666",
        fillOpacity: isHighlighted ? 0.8 : 0.6,
      };
    });
  }, [overlayFilter, selectedSchool]);

  return (
    <main style={{ minHeight: "100vh", background: "#fff", color: T.ink }}>
      <VisualizationHeader
        title="Elite Schools Influence Map"
        kicker="Native visualization"
        description="Schools appear as nodes, pipelines show where graduates lead, and province overlays show concentration and retention so this does not read as prestige alone."
        lastUpdated={schoolsData?.metadata?.year ? `${schoolsData.metadata.year} prototype data` : "Prototype"}
        dataLinks={[
          { href: "/elite-schools-influence-2025.json", label: "Elite schools JSON" },
        ]}
        relatedLinks={[
          { href: "/business-connections-network-visualization.html", label: "Business connections" },
          { href: "/startup-ecosystem-visualization.html", label: "Startup ecosystem" },
        ]}
      />

      <section style={{ padding: "20px 24px 40px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 18 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: 16, border: `1px solid ${T.subtle}`, background: T.surface }}>
            <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
              <option value="all">All tiers</option>
              <option value="National Elite">National Elite</option>
              <option value="Leading Private">Leading Private</option>
              <option value="Leading Regional">Leading Regional</option>
            </select>
            <select value={pipelineFilter} onChange={(e) => setPipelineFilter(e.target.value)}>
              <option value="all">All pipelines</option>
              <option value="public_service">Public service</option>
              <option value="business">Business</option>
              <option value="academia">Academia</option>
              <option value="civil_society">Civil society</option>
              <option value="health">Health</option>
              <option value="industry">Industry</option>
            </select>
            <select value={overlayFilter} onChange={(e) => setOverlayFilter(e.target.value)}>
              <option value="influence">Province overlay: influence</option>
              <option value="retention">Province overlay: retention</option>
            </select>
            <button type="button" onClick={() => setSelectedSchoolId("")}>Reset selection</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 0.85fr)", gap: 18 }}>
            <div style={{ padding: 18, border: `1px solid ${T.subtle}`, background: "#fff" }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>Alumni pipelines network</h2>
              <p style={{ margin: "0 0 14px", color: T.muted, fontSize: 14 }}>
                Click a school node to see community loops, mobility paths, and where graduates stayed.
              </p>
              <div ref={networkContainerRef} style={{ width: "100%", height: 540 }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {Object.entries(tierColors).map(([tier, color]) => (
                  <span key={tier} style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
                    {tier}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ padding: 18, border: `1px solid ${T.subtle}`, background: "#fff" }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>Provincial influence overlay</h2>
              <p style={{ margin: "0 0 14px", color: T.muted, fontSize: 14 }}>
                Province overlays show concentration and retention, not just metro pull.
              </p>
              <div ref={mapRef} style={{ width: "100%", height: 540 }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)", gap: 18 }}>
            <InfoPanel school={selectedSchool} />
            <div style={{ padding: 20, border: `1px solid ${T.subtle}`, background: T.surface }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 20 }}>Methodology note</h3>
              <p style={{ margin: "0 0 10px", color: T.muted, lineHeight: 1.6 }}>
                This native port preserves the prototype data model. It makes the “placeholder” status explicit while keeping the interaction model useful for future CHED, PRC, and accreditation-backed updates.
              </p>
              <ul style={{ margin: 0, paddingLeft: 18, color: T.muted, lineHeight: 1.7 }}>
                <li>Network nodes: {schools.length} schools and {(schoolsData.sectors || []).length} sectors</li>
                <li>Pipeline edges: {(schoolsData.pipelines || []).length}</li>
                <li>Province overlay metric: influence or retention</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
