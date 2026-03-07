import { weeklyReviews } from "./data/weekly-reviews"

export interface SearchResult {
  id: string
  title: string
  description: string
  category: "dynasty" | "corruption" | "weekly-review" | "province" | "timeline"
  url: string
  relevance?: number
}

// Static search index built from known data
// In production, this would be built at build time from JSON files
const DYNASTIES: SearchResult[] = [
  {
    id: "marcos-romualdez",
    title: "Marcos-Romualdez Dynasty",
    description: "National-level imperial dynasty controlling the presidency. Primary regions: Ilocos Norte, Leyte. Patriarch: Ferdinand Marcos Jr.",
    category: "dynasty",
    url: "/dynasties/marcos-romualdez",
  },
  {
    id: "duterte",
    title: "Duterte Dynasty",
    description: "Political dynasty based in Davao. Includes former President Rodrigo Duterte and Vice President Sara Duterte-Carpio.",
    category: "dynasty",
    url: "/dynasties/duterte",
  },
  {
    id: "aquino",
    title: "Aquino Dynasty",
    description: "Historical political family. Includes former Presidents Corazon and Benigno Aquino III. Opposition to current administration.",
    category: "dynasty",
    url: "/dynasties/aquino",
  },
  {
    id: "arroyo",
    title: "Arroyo Dynasty",
    description: "Pampanga-based dynasty. Former President Gloria Macapagal-Arroyo now senior deputy speaker.",
    category: "dynasty",
    url: "/dynasties/arroyo",
  },
  {
    id: "estrada",
    title: "Estrada Dynasty",
    description: "Manila-based political family. Former President Joseph Estrada. Multiple family members in local and national politics.",
    category: "dynasty",
    url: "/dynasties/estrada",
  },
  {
    id: "villar",
    title: "Villar Dynasty",
    description: "Business-political dynasty. Las Pinas-based. Real estate empire. Senator Cynthia Villar, former Senator Manny Villar.",
    category: "dynasty",
    url: "/dynasties/villar",
  },
  {
    id: "binay",
    title: "Binay Dynasty",
    description: "Makati-based dynasty. Former Vice President Jejomar Binay. Multiple family members held Makati positions.",
    category: "dynasty",
    url: "/dynasties/binay",
  },
  {
    id: "dy",
    title: "Dy Dynasty",
    description: "Isabela-based rising dynasty. Faustino Dy III became House Speaker in 2025. Growing national influence.",
    category: "dynasty",
    url: "/dynasties/dy",
  },
  {
    id: "revilla-tolentino",
    title: "Revilla-Tolentino Dynasty",
    description: "Cavite-based dynasty. Senator Bong Revilla. Entertainment industry connections.",
    category: "dynasty",
    url: "/dynasties/revilla-tolentino",
  },
  {
    id: "singson",
    title: "Singson Dynasty",
    description: "Ilocos Sur-based dynasty. Governor Jeremias Singson. Long-standing regional control.",
    category: "dynasty",
    url: "/dynasties/singson",
  },
  {
    id: "tulfo",
    title: "Tulfo Dynasty",
    description: "Media-political family. Senator Raffy Tulfo. Broadcasting empire turned political influence.",
    category: "dynasty",
    url: "/dynasties/tulfo",
  },
  {
    id: "pacquiao",
    title: "Pacquiao Dynasty",
    description: "Sarangani-based. Boxing legend turned politician Manny Pacquiao. Former senator and presidential candidate.",
    category: "dynasty",
    url: "/dynasties/pacquiao",
  },
]

const CORRUPTION_CASES: SearchResult[] = [
  {
    id: "alice-guo",
    title: "Alice Guo POGO Case",
    description: "Former Bamban mayor convicted of identity fraud, human trafficking, and POGO connections. 875 victims rescued. Life imprisonment.",
    category: "corruption",
    url: "/corruption-tracker/alice-guo",
  },
  {
    id: "flood-control",
    title: "Flood Control Corruption Scandal",
    description: "P2 billion flood control corruption scandal. Multiple politicians implicated. Senate investigation ongoing.",
    category: "corruption",
    url: "/corruption-tracker/flood-control",
  },
  {
    id: "pogo-tax",
    title: "POGO Tax Evasion Cases",
    description: "Widespread tax evasion by Philippine Offshore Gaming Operators. BIR investigations. Multiple cases ongoing.",
    category: "corruption",
    url: "/corruption-tracker/pogo-tax",
  },
  {
    id: "pogo-trafficking",
    title: "POGO Human Trafficking",
    description: "Human trafficking operations connected to POGO facilities. Multiple raids. Hundreds of victims rescued.",
    category: "corruption",
    url: "/corruption-tracker/pogo-trafficking",
  },
]

const PROVINCES: SearchResult[] = [
  { id: "ilocos-norte", title: "Ilocos Norte", description: "Marcos stronghold in Northern Luzon. Governor Matthew Marcos Manotoc.", category: "province", url: "/explore/provinces/ilocos-norte" },
  { id: "cebu", title: "Cebu", description: "Major province in Visayas. Garcia dynasty defeated in 2025 after 30 years. Political realignment.", category: "province", url: "/explore/provinces/cebu" },
  { id: "davao", title: "Davao", description: "Duterte stronghold in Mindanao. Mayor Sebastian Duterte. Political tensions with national government.", category: "province", url: "/explore/provinces/davao" },
  { id: "leyte", title: "Leyte", description: "Romualdez family base. Eastern Visayas. Former Speaker Martin Romualdez.", category: "province", url: "/explore/provinces/leyte" },
  { id: "manila", title: "Manila", description: "National capital. Estrada family base. Mayor Honey Lacuna.", category: "province", url: "/explore/provinces/manila" },
  { id: "makati", title: "Makati", description: "Financial center. Former Binay stronghold. Business district.", category: "province", url: "/explore/provinces/makati" },
  { id: "isabela", title: "Isabela", description: "Dy dynasty base. Cagayan Valley. Rising political influence.", category: "province", url: "/explore/provinces/isabela" },
  { id: "pampanga", title: "Pampanga", description: "Arroyo family base. Central Luzon. Former President GMA.", category: "province", url: "/explore/provinces/pampanga" },
]

// Convert weekly reviews to search results
const WEEKLY_REVIEWS: SearchResult[] = weeklyReviews.map((review) => ({
  id: `weekly-${review.slug}`,
  title: `${review.topStory} - ${review.dateRange}`,
  description: review.excerpt,
  category: "weekly-review" as const,
  url: `/weekly-reviews/${review.slug}`,
}))

// Combine all search data
const SEARCH_INDEX: SearchResult[] = [
  ...DYNASTIES,
  ...CORRUPTION_CASES,
  ...PROVINCES,
  ...WEEKLY_REVIEWS,
]

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "")
}

function calculateRelevance(item: SearchResult, query: string): number {
  const normalizedQuery = normalizeText(query)
  const normalizedTitle = normalizeText(item.title)
  const normalizedDescription = normalizeText(item.description)
  
  let score = 0
  
  // Exact title match
  if (normalizedTitle === normalizedQuery) score += 100
  
  // Title starts with query
  if (normalizedTitle.startsWith(normalizedQuery)) score += 50
  
  // Title contains query
  if (normalizedTitle.includes(normalizedQuery)) score += 30
  
  // Description contains query
  if (normalizedDescription.includes(normalizedQuery)) score += 10
  
  // Individual word matches
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean)
  for (const word of queryWords) {
    if (word.length < 2) continue
    if (normalizedTitle.includes(word)) score += 5
    if (normalizedDescription.includes(word)) score += 2
  }
  
  return score
}

export function searchIndex(query: string, category?: string, limit = 10): SearchResult[] {
  if (!query || query.trim().length < 2) return []
  
  let results = SEARCH_INDEX
  
  // Filter by category if specified
  if (category && category !== "all") {
    results = results.filter((item) => item.category === category)
  }
  
  // Calculate relevance and filter
  const scored = results
    .map((item) => ({
      ...item,
      relevance: calculateRelevance(item, query),
    }))
    .filter((item) => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
  
  return scored
}

export function getSearchSuggestions(): string[] {
  return [
    "Marcos-Romualdez Dynasty",
    "Alice Guo POGO Case",
    "Flood Control Corruption",
    "Duterte ICC Detention",
    "Cebu Garcia Dynasty",
    "2026 Budget",
  ]
}

export function getCategories() {
  return [
    { label: "All", value: "all" },
    { label: "Dynasties", value: "dynasty" },
    { label: "Corruption Cases", value: "corruption" },
    { label: "Weekly Reviews", value: "weekly-review" },
    { label: "Provinces", value: "province" },
  ]
}
