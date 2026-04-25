import casesData from "@/pogo-corruption-cases-2025.json";
import CorruptionMapClient from "@/app/corruption/CorruptionMapClient";

export default function CorruptionMapPage() {
  return <CorruptionMapClient casesData={casesData} />;
}
