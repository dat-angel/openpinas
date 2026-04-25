import businessData from "@/business-connections-2025.json";
import dynastiesRoot from "@/philippine-political-dynasties-network-2025.json";
import BusinessConnectionsClient from "@/app/business-connections/BusinessConnectionsClient";

export default function BusinessConnectionsPage() {
  const dynasties =
    dynastiesRoot?.philippine_political_dynasties_network?.nodes?.dynasties?.map((dynasty) => ({
      id: dynasty.id,
      name: dynasty.name,
      classification: dynasty.classification,
      power_level: dynasty.power_level,
      primary_regions: dynasty.primary_regions,
    })) || [];

  return <BusinessConnectionsClient businessData={businessData} dynasties={dynasties} />;
}
