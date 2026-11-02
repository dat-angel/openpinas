import casesData from "@/pogo-corruption-cases-2025.json";
import dynastiesRoot from "@/philippine-political-dynasties-network-2025.json";
import CorruptionNetworkClient from "@/app/corruption/CorruptionNetworkClient";

export default function CorruptionNetworkPage() {
  const dynasties =
    dynastiesRoot?.philippine_political_dynasties_network?.nodes?.dynasties?.map((dynasty) => ({
      id: dynasty.id,
      name: dynasty.name,
      classification: dynasty.classification,
      power_level: dynasty.power_level,
    })) || [];
  return <CorruptionNetworkClient casesData={casesData} dynasties={dynasties} />;
}
