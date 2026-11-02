"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import VisualizationHeader from "@/app/components/VisualizationHeader";

const nodeColors = {
  dynasty: "#0038A8",
  conglomerate: "#2b7a6d",
  pba_team: "#c44900",
  media: "#6c5b7b",
};

const edgeColors = {
  direct_ownership: "#0038A8",
  family_business: "#0038A8",
  business_political_network: "#6b7280",
  infrastructure_contracts: "#FFD700",
  government_contracts: "#FFD700",
  media_political_relationships: "#6c5b7b",
  campaign_financing: "#CE1126",
  marriage_connection: "#0066CC",
  franchise_denial: "#6c5b7b",
  political_retaliation: "#CE1126",
};

const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  surface: "#f7f7f5",
  accent: "#2d2de8",
};

function dynastyLabel(id) {
  return String(id || "").replaceAll("_", " ").replace("FAMILY", "").trim();
}

function buildBusinessGraph(businessData, dynasties) {
  const nodes = [];
  const edges = [];

  dynasties.forEach((dynasty) => {
    nodes.push({
      id: dynasty.id,
      label: dynasty.name.replace(" Dynasty", ""),
      color: nodeColors.dynasty,
      size: 24,
      shape: "dot",
      meta: { type: "dynasty", item: dynasty },
    });
  });

  (businessData?.sports?.pba_teams || []).forEach((team) => {
    nodes.push({
      id: team.team_id,
      label: team.name,
      color: nodeColors.pba_team,
      size: 18,
      shape: "dot",
      meta: { type: "pba_team", item: team },
    });

    (team.dynasty_connections || []).forEach((dynastyId) => {
      edges.push({
        id: `${team.team_id}-${dynastyId}-ownership`,
        from: team.team_id,
        to: dynastyId,
        type: "direct_ownership",
        label: "Ownership",
        dashes: false,
        width: 3,
      });
    });

    (team.political_connections || []).forEach((conn, index) => {
      if (!conn.dynasty) return;
      edges.push({
        id: `${team.team_id}-${conn.dynasty}-${conn.type}-${index}`,
        from: team.team_id,
        to: conn.dynasty,
        type: conn.type,
        label: conn.type.replaceAll("_", " "),
        dashes: conn.type === "business_political_network",
        width: 2,
        verification: conn.verification_status || "unknown",
        connection: conn,
      });
    });
  });

  (businessData?.corporations?.conglomerates || []).forEach((company) => {
    nodes.push({
      id: company.company_id,
      label: company.name,
      color: nodeColors.conglomerate,
      size: 28,
      shape: "dot",
      meta: { type: "conglomerate", item: company },
    });

    (company.dynasty_connections || []).forEach((dynastyId) => {
      edges.push({
        id: `${company.company_id}-${dynastyId}-ownership`,
        from: company.company_id,
        to: dynastyId,
        type: "direct_ownership",
        label: "Ownership",
        dashes: false,
        width: 4,
      });
    });

    (company.political_connections || []).forEach((conn, index) => {
      if (!conn.dynasty) return;
      edges.push({
        id: `${company.company_id}-${conn.dynasty}-${conn.type}-${index}`,
        from: company.company_id,
        to: conn.dynasty,
        type: conn.type,
        label: conn.type.replaceAll("_", " "),
        dashes: conn.type === "business_political_network" || conn.type === "infrastructure_contracts",
        width: 2,
        verification: conn.verification_status || "unknown",
        connection: conn,
      });
    });
  });

  (businessData?.corporations?.media || []).forEach((media) => {
    const id = media.company_id || media.media_id;
    nodes.push({
      id,
      label: media.name,
      color: nodeColors.media,
      size: 20,
      shape: "dot",
      meta: { type: "media", item: media },
    });

    (media.dynasty_connections || []).forEach((dynastyId) => {
      edges.push({
        id: `${id}-${dynastyId}-ownership`,
        from: id,
        to: dynastyId,
        type: "direct_ownership",
        label: "Ownership",
        dashes: false,
        width: 3,
      });
    });

    (media.political_connections || []).forEach((conn, index) => {
      if (!conn.dynasty) return;
      edges.push({
        id: `${id}-${conn.dynasty}-${conn.type}-${index}`,
        from: id,
        to: conn.dynasty,
        type: conn.type,
        label: conn.type.replaceAll("_", " "),
        dashes: true,
        width: 2,
        verification: conn.verification_status || "unknown",
        connection: conn,
      });
    });
  });

  return { nodes, edges };
}

function DetailBlock({ title, children }) {
  return (
    <div style={{ marginTop: 16 }}>
      <p
        style={{
          margin: "0 0 6px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: T.muted,
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function ConnectionsList({ connections = [] }) {
  if (!connections.length) return <p style={{ margin: 0, color: T.muted, fontSize: 14 }}>No annotated connections.</p>;
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {connections.map((conn, index) => (
        <div key={`${conn.type}-${index}`} style={{ borderLeft: "3px solid #e5e5e3", paddingLeft: 10 }}>
          <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600 }}>{conn.type.replaceAll("_", " ")}</p>
          <p style={{ margin: "0 0 4px", fontSize: 14, color: T.muted }}>{conn.description || "No description."}</p>
          <p style={{ margin: 0, fontSize: 12, color: T.muted }}>
            Verification: {conn.verification_status || "unknown"}
          </p>
        </div>
      ))}
    </div>
  );
}

function SelectedNodePanel({ selectedNode }) {
  if (!selectedNode) {
    return (
      <div style={{ padding: 20, background: "#fff", border: `1px solid ${T.subtle}` }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 20 }}>Select a node</h3>
        <p style={{ margin: 0, color: T.muted, lineHeight: 1.6 }}>
          Pick a dynasty, conglomerate, media outlet, or PBA team to inspect how ownership and political ties are encoded in the current dataset.
        </p>
      </div>
    );
  }

  const { type, item } = selectedNode.meta;
  return (
    <div style={{ padding: 20, background: "#fff", border: `1px solid ${T.subtle}` }}>
      <h3 style={{ margin: "0 0 8px", fontSize: 22 }}>{item.name}</h3>
      <p style={{ margin: "0 0 12px", color: T.muted, textTransform: "capitalize" }}>
        {type.replaceAll("_", " ")}
      </p>
      {type === "dynasty" ? (
        <>
          <p style={{ margin: 0, fontSize: 14 }}>Classification: {item.classification || "n/a"}</p>
          <p style={{ margin: "6px 0 0", fontSize: 14 }}>Power level: {item.power_level || "n/a"}</p>
          <DetailBlock title="Primary regions">
            <p style={{ margin: 0, color: T.muted }}>{(item.primary_regions || []).join(", ") || "n/a"}</p>
          </DetailBlock>
          <DetailBlock title="Related route">
            <a href={`/dynasties-network-visualization.html#dynasty-${item.id}`} style={{ color: T.accent }}>
              Open in dynasty map →
            </a>
          </DetailBlock>
        </>
      ) : null}

      {type === "pba_team" ? (
        <>
          <p style={{ margin: 0, fontSize: 14 }}>Owner: {item.owner || "n/a"}</p>
          <p style={{ margin: "6px 0 0", fontSize: 14 }}>Championships: {item.championships || 0}</p>
          <DetailBlock title="Dynasty connections">
            <p style={{ margin: 0, color: T.muted }}>
              {(item.dynasty_connections || []).map(dynastyLabel).join(", ") || "None"}
            </p>
          </DetailBlock>
          <DetailBlock title="Political connections">
            <ConnectionsList connections={item.political_connections || []} />
          </DetailBlock>
        </>
      ) : null}

      {type === "conglomerate" ? (
        <>
          <p style={{ margin: 0, fontSize: 14 }}>Ownership: {item.ownership || "n/a"}</p>
          <DetailBlock title="Businesses">
            <p style={{ margin: 0, color: T.muted }}>{(item.businesses || []).join(", ") || "n/a"}</p>
          </DetailBlock>
          <DetailBlock title="Dynasty connections">
            <p style={{ margin: 0, color: T.muted }}>
              {(item.dynasty_connections || []).map(dynastyLabel).join(", ") || "None"}
            </p>
          </DetailBlock>
          <DetailBlock title="Political connections">
            <ConnectionsList connections={item.political_connections || []} />
          </DetailBlock>
        </>
      ) : null}

      {type === "media" ? (
        <>
          <p style={{ margin: 0, fontSize: 14 }}>Ownership: {item.ownership || "n/a"}</p>
          <p style={{ margin: "6px 0 0", fontSize: 14 }}>Status: {item.status || "n/a"}</p>
          <DetailBlock title="Platforms">
            <p style={{ margin: 0, color: T.muted }}>{(item.platforms || []).join(", ") || "n/a"}</p>
          </DetailBlock>
          <DetailBlock title="Political connections">
            <ConnectionsList connections={item.political_connections || []} />
          </DetailBlock>
        </>
      ) : null}
    </div>
  );
}

export default function BusinessConnectionsClient({ businessData, dynasties }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [showDynasties, setShowDynasties] = useState(true);
  const [showBusinesses, setShowBusinesses] = useState(true);
  const [showPBA, setShowPBA] = useState(true);
  const [showMedia, setShowMedia] = useState(true);
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [selectedNodeId, setSelectedNodeId] = useState("");

  const graph = useMemo(() => buildBusinessGraph(businessData, dynasties), [businessData, dynasties]);

  const filtered = useMemo(() => {
    const nodes = graph.nodes.filter((node) => {
      const type = node.meta.type;
      if (type === "dynasty" && !showDynasties) return false;
      if (type === "conglomerate" && !showBusinesses) return false;
      if (type === "pba_team" && !showPBA) return false;
      if (type === "media" && !showMedia) return false;
      return true;
    });

    const visible = new Set(nodes.map((node) => node.id));
    let edges = graph.edges.filter((edge) => visible.has(edge.from) && visible.has(edge.to));
    if (verificationFilter !== "all") {
      edges = edges.filter((edge) => {
        if (!edge.verification) return true;
        if (verificationFilter === "verified") return edge.verification === "verified";
        if (verificationFilter === "partially_verified") return edge.verification === "partially_verified";
        return edge.verification === "needs_verification" || edge.verification === "needs_research";
      });
    }

    return { nodes, edges };
  }, [graph, showDynasties, showBusinesses, showPBA, showMedia, verificationFilter]);

  const selectedNode = filtered.nodes.find((node) => node.id === selectedNodeId) || null;

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    let cancelled = false;

    (async () => {
      const { Network, DataSet } = await import("vis-network/standalone");
      if (cancelled || !containerRef.current) return;

      networkRef.current?.destroy();
      const nodes = new DataSet(
        filtered.nodes.map((node) => ({
          id: node.id,
          label: node.label,
          shape: node.shape,
          size: node.size,
          color: { background: node.color, border: "#ffffff" },
          font: { color: "#0d0d0d", size: 12, face: "Inter" },
        })),
      );
      const edges = new DataSet(
        filtered.edges.map((edge) => ({
          id: edge.id,
          from: edge.from,
          to: edge.to,
          label: edge.label,
          dashes: edge.dashes,
          width: edge.width,
          color: { color: edgeColors[edge.type] || "#6b7280" },
          font: { size: 10, align: "middle" },
          arrows: { to: { enabled: true, scaleFactor: 0.55 } },
        })),
      );

      const network = new Network(
        containerRef.current,
        { nodes, edges },
        {
          physics: { stabilization: { iterations: 200 } },
          interaction: { hover: true, tooltipDelay: 200 },
          nodes: { borderWidth: 2 },
          edges: { smooth: { type: "continuous" } },
        },
      );
      network.on("click", (params) => {
        if (params.nodes.length > 0) setSelectedNodeId(params.nodes[0]);
      });
      networkRef.current = network;
    })();

    return () => {
      cancelled = true;
      networkRef.current?.destroy();
      networkRef.current = null;
    };
  }, [filtered]);

  const stats = {
    businesses: filtered.nodes.filter((node) => node.meta.type !== "dynasty").length,
    dynasties: filtered.nodes.filter((node) => node.meta.type === "dynasty").length,
    edges: filtered.edges.length,
  };

  return (
    <main style={{ minHeight: "100vh", background: "#fff", color: T.ink }}>
      <VisualizationHeader
        title="Business Connections Network"
        kicker="Native visualization"
        description="Interactive network showing how conglomerates, PBA assets, and media outlets overlap with dynastic power. This native page replaces the legacy HTML-only visualization."
        lastUpdated={businessData?.metadata?.last_updated}
        dataLinks={[
          { href: "/business-connections-2025.json", label: "Business JSON" },
          { href: "/philippine-political-dynasties-network-2025.json", label: "Dynasties JSON" },
        ]}
        relatedLinks={[
          { href: "/elite-schools-influence-visualization.html", label: "Elite schools" },
          { href: "/startup-ecosystem-visualization.html", label: "Startup ecosystem" },
        ]}
      />

      <section style={{ padding: "20px 24px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gap: 18 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              padding: 16,
              border: `1px solid ${T.subtle}`,
              background: T.surface,
            }}
          >
            <label><input type="checkbox" checked={showDynasties} onChange={() => setShowDynasties((v) => !v)} /> Dynasties</label>
            <label><input type="checkbox" checked={showBusinesses} onChange={() => setShowBusinesses((v) => !v)} /> Conglomerates</label>
            <label><input type="checkbox" checked={showPBA} onChange={() => setShowPBA((v) => !v)} /> PBA teams</label>
            <label><input type="checkbox" checked={showMedia} onChange={() => setShowMedia((v) => !v)} /> Media</label>
            <select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)}>
              <option value="all">All verification statuses</option>
              <option value="verified">Verified only</option>
              <option value="partially_verified">Partially verified</option>
              <option value="needs_verification">Needs verification / research</option>
            </select>
            <button type="button" onClick={() => networkRef.current?.fit({ animation: true })}>
              Fit network
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 1, background: T.subtle, border: `1px solid ${T.subtle}` }}>
            {[
              { label: "Visible businesses", value: stats.businesses },
              { label: "Visible dynasties", value: stats.dynasties },
              { label: "Visible connections", value: stats.edges },
              { label: "Data maturity", value: businessData?.metadata?.status || "n/a" },
            ].map((item) => (
              <div key={item.label} style={{ background: "#fff", padding: 16 }}>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{item.value}</p>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: T.muted, textTransform: "uppercase" }}>{item.label}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(320px, 0.8fr)", gap: 18, alignItems: "start" }}>
            <div style={{ border: `1px solid ${T.subtle}`, background: "#fff" }}>
              <div ref={containerRef} style={{ width: "100%", height: "72vh", minHeight: 620 }} />
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              <SelectedNodePanel selectedNode={selectedNode} />
              <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.subtle}` }}>
                <h3 style={{ margin: "0 0 10px", fontSize: 18 }}>What still needs research</h3>
                <p style={{ margin: "0 0 10px", color: T.muted, lineHeight: 1.6 }}>
                  Government contracts and campaign financing remain template-level datasets. This native rewrite surfaces that gap directly instead of pretending those layers are complete.
                </p>
                <p style={{ margin: 0, fontSize: 13, color: T.muted }}>
                  Contracts seeded: {(businessData?.government_contracts?.contracts || []).length} · Contributions seeded: {(businessData?.campaign_financing?.contributions || []).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
