"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import VisualizationHeader from "@/app/components/VisualizationHeader";

const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  surface: "#f7f7f5",
  accent: "#2d2de8",
};

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function caseHref(caseId) {
  if (caseId === "ALICE_GUO_2024") return "/corruption-tracker/cases/alice-guo.html";
  if (caseId === "FLOOD_CONTROL_2025") return "/corruption-tracker/cases/flood-control.html";
  if (caseId === "POGO_TAX_2023") return "/corruption-tracker/cases/pogo-tax.html";
  if (caseId === "POGO_TRAFFICKING_2024") return "/corruption-tracker/cases/pogo-trafficking.html";
  return `/corruption-tracker/cases/${slugify(caseId)}.html`;
}

function formatAmount(amount) {
  if (!amount) return null;
  if (amount >= 1000000000) return `₱${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `₱${(amount / 1000000).toFixed(1)}M`;
  return `₱${amount.toLocaleString()}`;
}

function buildGraph(casesData, dynasties) {
  const nodes = [];
  const edges = [];
  const seen = new Set();

  const ensureNode = (node) => {
    if (seen.has(node.id)) return;
    seen.add(node.id);
    nodes.push(node);
  };

  (casesData.cases || []).forEach((caseItem) => {
    const caseId = `case_${caseItem.case_id}`;
    ensureNode({
      id: caseId,
      label: caseItem.title.length > 30 ? `${caseItem.title.slice(0, 30)}...` : caseItem.title,
      shape: "box",
      size: 24,
      color: "#1976D2",
      meta: { type: "case", item: caseItem },
    });

    (caseItem.accused || []).forEach((accused) => {
      const accusedId = `accused_${slugify(accused.name)}`;
      ensureNode({
        id: accusedId,
        label: accused.name,
        shape: "dot",
        size: 18,
        color: "#c44900",
        meta: { type: "accused", item: accused },
      });
      edges.push({ id: `${caseId}-${accusedId}`, from: caseId, to: accusedId, type: "accused" });
    });

    (caseItem.pogo_connections || []).forEach((pogo) => {
      const pogoId = `pogo_${slugify(pogo.company)}`;
      ensureNode({
        id: pogoId,
        label: pogo.company.length > 26 ? `${pogo.company.slice(0, 26)}...` : pogo.company,
        shape: "triangle",
        size: 18,
        color: "#f77f00",
        meta: { type: "pogo", item: pogo },
      });
      edges.push({ id: `${caseId}-${pogoId}`, from: caseId, to: pogoId, type: "pogo" });
    });

    (caseItem.dynasty_connections || []).forEach((entry, index) => {
      let dynastyNode = null;
      if (typeof entry === "string") {
        const match = dynasties.find((dynasty) => dynasty.id === entry);
        dynastyNode = match
          ? {
              id: `dynasty_${match.id}`,
              label: match.name.replace(" Dynasty", ""),
              shape: "diamond",
              size: 20,
              color: "#0b6e4f",
              meta: { type: "dynasty", item: match },
            }
          : {
              id: `dynasty_${entry}`,
              label: entry.replaceAll("_", " "),
              shape: "diamond",
              size: 20,
              color: "#0b6e4f",
              meta: { type: "dynasty_note", item: { dynasty: entry, connection: entry } },
            };
      } else {
        const label = entry.member || entry.dynasty || `Dynasty ${index + 1}`;
        dynastyNode = {
          id: `dynasty_${slugify(label)}`,
          label,
          shape: "diamond",
          size: 20,
          color: "#0b6e4f",
          meta: { type: "dynasty_note", item: entry },
        };
      }
      ensureNode(dynastyNode);
      edges.push({ id: `${caseId}-${dynastyNode.id}-${index}`, from: caseId, to: dynastyNode.id, type: "dynasty" });
    });
  });

  return { nodes, edges };
}

function DetailPanel({ node }) {
  if (!node) {
    return (
      <div style={{ padding: 20, background: "#fff", border: `1px solid ${T.subtle}` }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 20 }}>Select a node</h3>
        <p style={{ margin: 0, color: T.muted, lineHeight: 1.6 }}>
          Choose a case, accused party, POGO operator, or dynasty connection to inspect the current corruption graph.
        </p>
      </div>
    );
  }

  const { type, item } = node.meta;
  return (
    <div style={{ padding: 20, background: "#fff", border: `1px solid ${T.subtle}` }}>
      <h3 style={{ margin: "0 0 8px", fontSize: 22 }}>{item.title || item.name || item.company || item.member || item.dynasty}</h3>
      <p style={{ margin: "0 0 12px", color: T.muted, textTransform: "capitalize" }}>{type.replaceAll("_", " ")}</p>
      {type === "case" ? (
        <>
          <p style={{ margin: 0, fontSize: 14 }}>Status: {item.status}</p>
          <p style={{ margin: "6px 0 0", fontSize: 14 }}>Category: {item.category}</p>
          {item.location ? (
            <p style={{ margin: "6px 0 0", fontSize: 14 }}>
              Location: {[item.location.municipality, item.location.province, item.location.region].filter(Boolean).join(", ")}
            </p>
          ) : null}
          {item.amount_involved_php ? (
            <p style={{ margin: "6px 0 0", fontSize: 14 }}>Amount: {formatAmount(item.amount_involved_php)}</p>
          ) : null}
          {item.human_trafficking_victims ? (
            <p style={{ margin: "6px 0 0", fontSize: 14 }}>Victims: {item.human_trafficking_victims.toLocaleString()}</p>
          ) : null}
          <div style={{ marginTop: 14 }}>
            <a href={caseHref(item.case_id)} style={{ color: T.accent }}>
              Open case file →
            </a>
          </div>
        </>
      ) : null}
      {type === "accused" ? (
        <>
          <p style={{ margin: 0, fontSize: 14 }}>Position: {item.position || "n/a"}</p>
          <p style={{ margin: "6px 0 0", fontSize: 14 }}>Status: {item.status || "n/a"}</p>
          {item.current_status ? <p style={{ margin: "6px 0 0", fontSize: 14 }}>Current status: {item.current_status}</p> : null}
          {item.sentence ? <p style={{ margin: "6px 0 0", fontSize: 14 }}>Sentence: {item.sentence}</p> : null}
        </>
      ) : null}
      {type === "pogo" ? (
        <>
          <p style={{ margin: 0, fontSize: 14 }}>Location: {item.location || "n/a"}</p>
          <p style={{ margin: "6px 0 0", fontSize: 14 }}>Status: {item.status || "n/a"}</p>
          {item.victims_rescued ? <p style={{ margin: "6px 0 0", fontSize: 14 }}>Victims rescued: {item.victims_rescued}</p> : null}
          <p style={{ margin: "6px 0 0", color: T.muted, fontSize: 14 }}>{item.description}</p>
        </>
      ) : null}
      {type === "dynasty" ? (
        <>
          <p style={{ margin: 0, fontSize: 14 }}>Power level: {item.power_level || "n/a"}</p>
          <p style={{ margin: "6px 0 0", fontSize: 14 }}>Classification: {item.classification || "n/a"}</p>
        </>
      ) : null}
      {type === "dynasty_note" ? (
        <>
          <p style={{ margin: 0, fontSize: 14 }}>Dynasty: {item.dynasty || "n/a"}</p>
          {item.member ? <p style={{ margin: "6px 0 0", fontSize: 14 }}>Member: {item.member}</p> : null}
          {item.role ? <p style={{ margin: "6px 0 0", fontSize: 14 }}>Role: {item.role}</p> : null}
          {item.connection ? <p style={{ margin: "6px 0 0", color: T.muted, fontSize: 14 }}>{item.connection}</p> : null}
        </>
      ) : null}
    </div>
  );
}

export default function CorruptionNetworkClient({ casesData, dynasties }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [showCases, setShowCases] = useState(true);
  const [showAccused, setShowAccused] = useState(true);
  const [showDynasties, setShowDynasties] = useState(true);
  const [showPOGO, setShowPOGO] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState("");

  const graph = useMemo(() => buildGraph(casesData, dynasties), [casesData, dynasties]);
  const filtered = useMemo(() => {
    const nodes = graph.nodes.filter((node) => {
      if (node.meta.type === "case" && !showCases) return false;
      if (node.meta.type === "accused" && !showAccused) return false;
      if ((node.meta.type === "dynasty" || node.meta.type === "dynasty_note") && !showDynasties) return false;
      if (node.meta.type === "pogo" && !showPOGO) return false;
      return true;
    });
    const visible = new Set(nodes.map((node) => node.id));
    const edges = graph.edges.filter((edge) => visible.has(edge.from) && visible.has(edge.to));
    return { nodes, edges };
  }, [graph, showCases, showAccused, showDynasties, showPOGO]);

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
          font: { color: node.meta.type === "case" ? "#0D47A1" : "#ffffff", face: "Inter", strokeWidth: node.meta.type === "case" ? 0 : 2, strokeColor: "#000000" },
        })),
      );
      const edges = new DataSet(
        filtered.edges.map((edge) => ({
          id: edge.id,
          from: edge.from,
          to: edge.to,
          color:
            edge.type === "accused"
              ? { color: "#1976D2" }
              : edge.type === "pogo"
                ? { color: "#f77f00" }
                : { color: "#0b6e4f" },
          width: 2,
          dashes: edge.type === "dynasty",
          arrows: { to: { enabled: true, scaleFactor: 0.7 } },
        })),
      );
      const network = new Network(
        containerRef.current,
        { nodes, edges },
        {
          physics: {
            stabilization: { iterations: 200 },
            barnesHut: { gravitationalConstant: -2000, springLength: 200, springConstant: 0.04 },
          },
          interaction: { hover: true, tooltipDelay: 200 },
          edges: { smooth: { type: "continuous", roundness: 0.5 } },
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

  return (
    <main style={{ minHeight: "100vh", background: "#fff", color: T.ink }}>
      <VisualizationHeader
        title="Corruption Cases Network"
        kicker="Native visualization"
        description="See how cases, accused parties, POGO operators, and dynasty links connect across the corruption tracker."
        lastUpdated={casesData?.metadata?.last_updated}
        dataLinks={[
          { href: "/pogo-corruption-cases-2025.json", label: "Corruption JSON" },
        ]}
        relatedLinks={[
          { href: "/corruption-tracker/index.html", label: "Corruption tracker" },
          { href: "/corruption-tracker/map.html", label: "Corruption map" },
        ]}
      />

      <section style={{ padding: "20px 24px 40px" }}>
        <div style={{ maxWidth: 1260, margin: "0 auto", display: "grid", gap: 18 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: 16, border: `1px solid ${T.subtle}`, background: T.surface }}>
            <label><input type="checkbox" checked={showCases} onChange={() => setShowCases((v) => !v)} /> Cases</label>
            <label><input type="checkbox" checked={showAccused} onChange={() => setShowAccused((v) => !v)} /> Accused</label>
            <label><input type="checkbox" checked={showDynasties} onChange={() => setShowDynasties((v) => !v)} /> Dynasties</label>
            <label><input type="checkbox" checked={showPOGO} onChange={() => setShowPOGO((v) => !v)} /> POGO operations</label>
            <button type="button" onClick={() => networkRef.current?.fit({ animation: true })}>Fit network</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 1, background: T.subtle, border: `1px solid ${T.subtle}` }}>
            {[
              { label: "Cases", value: filtered.nodes.filter((node) => node.meta.type === "case").length },
              { label: "Accused", value: filtered.nodes.filter((node) => node.meta.type === "accused").length },
              { label: "POGO links", value: filtered.nodes.filter((node) => node.meta.type === "pogo").length },
              { label: "Visible edges", value: filtered.edges.length },
            ].map((item) => (
              <div key={item.label} style={{ background: "#fff", padding: 16 }}>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{item.value}</p>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: T.muted, textTransform: "uppercase" }}>{item.label}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 0.85fr)", gap: 18 }}>
            <div style={{ border: `1px solid ${T.subtle}`, background: "#fff" }}>
              <div ref={containerRef} style={{ width: "100%", height: "70vh", minHeight: 600 }} />
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              <DetailPanel node={selectedNode} />
              <div style={{ padding: 20, border: `1px solid ${T.subtle}`, background: T.surface }}>
                <h3 style={{ margin: "0 0 10px", fontSize: 18 }}>Case mix</h3>
                <p style={{ margin: 0, color: T.muted, lineHeight: 1.6 }}>
                  This native page makes the graph explicit: four major cases, multiple accused parties, and a thinner dynasty layer that should expand as more structured case metadata is added.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
