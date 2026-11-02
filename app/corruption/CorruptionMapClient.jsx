"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import VisualizationHeader from "@/app/components/VisualizationHeader";
import "leaflet/dist/leaflet.css";

const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  surface: "#f7f7f5",
  accent: "#2d2de8",
};

const provinceCoordinates = {
  Tarlac: [15.4833, 120.5833],
  Bamban: [15.4833, 120.5833],
  Manila: [14.5995, 120.9842],
  "Metro Manila": [14.6042, 121.0],
  NCR: [14.6042, 121.0],
  "Central Luzon": [15.4833, 120.5833],
  CALABARZON: [14.2667, 121.4167],
  Multiple: [12.8797, 121.774],
};

function getCoordinates(location) {
  if (!location) return [12.8797, 121.774];
  if (location.municipality && provinceCoordinates[location.municipality]) return provinceCoordinates[location.municipality];
  if (location.province && provinceCoordinates[location.province]) return provinceCoordinates[location.province];
  if (location.region && provinceCoordinates[location.region]) return provinceCoordinates[location.region];
  return [12.8797, 121.774];
}

function getStatusColor(status) {
  const value = String(status || "").toLowerCase();
  if (value.includes("ongoing") || value.includes("investigation")) return "#f77f00";
  if (value.includes("convicted")) return "#0b6e4f";
  if (value.includes("dismissed") || value.includes("acquitted")) return "#b23a48";
  if (value.includes("filed") || value.includes("trial")) return "#124559";
  return "#666";
}

function getStatusIcon(status) {
  const value = String(status || "").toLowerCase();
  if (value.includes("ongoing") || value.includes("investigation")) return "⏳";
  if (value.includes("convicted")) return "✓";
  if (value.includes("dismissed") || value.includes("acquitted")) return "✕";
  if (value.includes("filed") || value.includes("trial")) return "📋";
  return "•";
}

function formatAmount(amount) {
  if (!amount) return "n/a";
  if (amount >= 1000000000) return `₱${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `₱${(amount / 1000000).toFixed(1)}M`;
  return `₱${amount.toLocaleString()}`;
}

function caseHref(caseId) {
  if (caseId === "ALICE_GUO_2024") return "/corruption-tracker/cases/alice-guo.html";
  if (caseId === "FLOOD_CONTROL_2025") return "/corruption-tracker/cases/flood-control.html";
  if (caseId === "POGO_TAX_2023") return "/corruption-tracker/cases/pogo-tax.html";
  if (caseId === "POGO_TRAFFICKING_2024") return "/corruption-tracker/cases/pogo-trafficking.html";
  return "/corruption-tracker/index.html";
}

function CaseCard({ item, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.case_id)}
      style={{
        textAlign: "left",
        padding: 14,
        border: `1px solid ${active ? "#2d2de8" : "#e5e5e3"}`,
        background: active ? "#f8f8ff" : "#fff",
        cursor: "pointer",
      }}
    >
      <p style={{ margin: "0 0 6px", fontSize: 11, textTransform: "uppercase", color: "#6b7280" }}>{item.category}</p>
      <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>{item.title}</h3>
      <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
        {item.status} · {item.location?.province || item.location?.region || "Philippines"}
      </p>
    </button>
  );
}

export default function CorruptionMapClient({ casesData }) {
  const mapContainerRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef([]);
  const [showOngoing, setShowOngoing] = useState(true);
  const [showConvicted, setShowConvicted] = useState(true);
  const [showPOGO, setShowPOGO] = useState(true);
  const [showTrafficking, setShowTrafficking] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState("");

  const filteredCases = useMemo(() => {
    return (casesData.cases || []).filter((caseItem) => {
      const status = String(caseItem.status || "").toLowerCase();
      const isOngoing = status.includes("ongoing") || status.includes("investigation") || status.includes("under_investigation");
      const isConvicted = status.includes("convicted");
      if (isOngoing && !showOngoing) return false;
      if (isConvicted && !showConvicted) return false;
      const isPOGO = caseItem.category === "POGO-related";
      const hasTrafficking = Boolean(caseItem.human_trafficking_victims) || (caseItem.subcategories || []).includes("human_trafficking");
      if (isPOGO && !showPOGO) return false;
      if (hasTrafficking && !showTrafficking) return false;
      return true;
    });
  }, [casesData.cases, showOngoing, showConvicted, showPOGO, showTrafficking]);

  const selectedCase = filteredCases.find((caseItem) => caseItem.case_id === selectedCaseId) || filteredCases[0] || null;

  useEffect(() => {
    if (!mapContainerRef.current || leafletRef.current) return;
    let cancelled = false;

    (async () => {
      const leafletMod = await import("leaflet");
      if (cancelled || !mapContainerRef.current) return;
      const L = leafletMod.default;
      const map = L.map(mapContainerRef.current).setView([12.8797, 121.774], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      leafletRef.current = { L, map };
    })();

    return () => {
      cancelled = true;
      if (leafletRef.current?.map) {
        leafletRef.current.map.remove();
        leafletRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!leafletRef.current) return;
    const { L, map } = leafletRef.current;
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    filteredCases.forEach((caseItem) => {
      const color = getStatusColor(caseItem.status);
      const marker = L.marker(getCoordinates(caseItem.location), {
        icon: L.divIcon({
          className: "case-marker",
          html: `<div style="width:28px;height:28px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:12px;color:white;">${getStatusIcon(caseItem.status)}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      }).addTo(map);
      marker.on("click", () => setSelectedCaseId(caseItem.case_id));
      marker.bindPopup(`<strong>${caseItem.title}</strong><br/>${caseItem.status}`);
      markersRef.current.push(marker);
    });

    if (markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [filteredCases]);

  useEffect(() => {
    if (!selectedCaseId && filteredCases[0]) {
      setSelectedCaseId(filteredCases[0].case_id);
    }
  }, [filteredCases, selectedCaseId]);

  return (
    <main style={{ minHeight: "100vh", background: "#fff", color: T.ink }}>
      <VisualizationHeader
        title="Corruption Cases Map"
        kicker="Native visualization"
        description="See where corruption, trafficking, and POGO-related cases cluster across the Philippines."
        lastUpdated={casesData?.metadata?.last_updated}
        dataLinks={[
          { href: "/pogo-corruption-cases-2025.json", label: "Corruption JSON" },
        ]}
        relatedLinks={[
          { href: "/corruption-tracker/index.html", label: "Corruption tracker" },
          { href: "/corruption-tracker/network.html", label: "Corruption network" },
        ]}
      />

      <section style={{ padding: "20px 24px 40px" }}>
        <div style={{ maxWidth: 1260, margin: "0 auto", display: "grid", gap: 18 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: 16, border: `1px solid ${T.subtle}`, background: T.surface }}>
            <label><input type="checkbox" checked={showOngoing} onChange={() => setShowOngoing((v) => !v)} /> Ongoing</label>
            <label><input type="checkbox" checked={showConvicted} onChange={() => setShowConvicted((v) => !v)} /> Convicted</label>
            <label><input type="checkbox" checked={showPOGO} onChange={() => setShowPOGO((v) => !v)} /> POGO cases</label>
            <label><input type="checkbox" checked={showTrafficking} onChange={() => setShowTrafficking((v) => !v)} /> Human trafficking</label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)", gap: 18 }}>
            <div style={{ border: `1px solid ${T.subtle}`, background: "#fff" }}>
              <div ref={mapContainerRef} style={{ width: "100%", height: "72vh", minHeight: 620 }} />
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ display: "grid", gap: 10 }}>
                {filteredCases.map((caseItem) => (
                  <CaseCard key={caseItem.case_id} item={caseItem} active={selectedCase?.case_id === caseItem.case_id} onSelect={setSelectedCaseId} />
                ))}
              </div>
              {selectedCase ? (
                <div style={{ padding: 20, border: `1px solid ${T.subtle}`, background: "#fff" }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 22 }}>{selectedCase.title}</h3>
                  <p style={{ margin: "0 0 8px", color: T.muted }}>
                    {selectedCase.status} · {selectedCase.category}
                  </p>
                  <p style={{ margin: "0 0 8px", fontSize: 14 }}>
                    Location: {[selectedCase.location?.municipality, selectedCase.location?.province, selectedCase.location?.region].filter(Boolean).join(", ")}
                  </p>
                  <p style={{ margin: "0 0 8px", fontSize: 14 }}>Amount involved: {formatAmount(selectedCase.amount_involved_php)}</p>
                  {selectedCase.human_trafficking_victims ? (
                    <p style={{ margin: "0 0 8px", fontSize: 14 }}>Victims: {selectedCase.human_trafficking_victims.toLocaleString()}</p>
                  ) : null}
                  <p style={{ margin: "0 0 12px", color: T.muted, lineHeight: 1.6 }}>{selectedCase.significance}</p>
                  <a href={caseHref(selectedCase.case_id)} style={{ color: T.accent }}>
                    Open case file →
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
