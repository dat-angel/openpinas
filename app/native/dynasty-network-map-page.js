"use client";

/**
 * Full vis-network + Leaflet experience ships as a static bundle under /dynasty-map/
 * (generated in predev/prebuild). This route keeps /dynasties-network-visualization.html
 * in the Next app while preserving all legacy behavior.
 */
export default function DynastyNetworkMapPage() {
  return (
    <iframe
      title="Philippine Political Dynasties Network Map"
      src="/dynasty-map/index.html"
      style={{ border: 0, width: "100vw", height: "100vh", display: "block" }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    />
  );
}
