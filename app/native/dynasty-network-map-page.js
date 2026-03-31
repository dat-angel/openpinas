import DynastyNetworkMapClient from "@/app/dynasty-map/DynastyNetworkMapClient";

/**
 * Native vis-network + Leaflet page for /dynasties-network-visualization.html.
 * JSON assets are copied to /dynasty-map/ by predev/prebuild (sync-openpinas-public).
 */
export default function DynastyNetworkMapPage() {
  return <DynastyNetworkMapClient />;
}
