export interface CorruptionCase {
  slug: string
  title: string
  shortTitle: string
  category: string
  subcategories: string[]
  status: "convicted" | "ongoing" | "investigation" | "acquitted"
  priority: "high" | "medium" | "low"
  filingDate: string
  location: {
    municipality: string
    province: string
    region: string
  }
  accused: {
    name: string
    position: string
    status: string
    sentence?: string
  }[]
  amountInvolvedPhp: number
  victims?: number
  description: string
  keyEvents: {
    date: string
    event: string
  }[]
  charges: string[]
}

export const corruptionCases: CorruptionCase[] = [
  {
    slug: "alice-guo",
    title: "Alice Guo Identity Fraud & POGO Connections",
    shortTitle: "Alice Guo POGO Case",
    category: "POGO-related",
    subcategories: ["identity_fraud", "human_trafficking", "corruption", "money_laundering", "tax_evasion"],
    status: "convicted",
    priority: "high",
    filingDate: "2024-05-01",
    location: {
      municipality: "Bamban",
      province: "Tarlac",
      region: "Central Luzon",
    },
    accused: [
      {
        name: "Alice Guo",
        position: "Former Mayor, Bamban, Tarlac",
        status: "convicted",
        sentence: "Life imprisonment",
      },
    ],
    amountInvolvedPhp: 100000000,
    victims: 875,
    description: "Former Bamban mayor convicted of identity fraud after being exposed as Chinese national Guo Hua Ping. Linked to POGO operations that trafficked hundreds of workers.",
    keyEvents: [
      { date: "2024-03-13", event: "POGO Raid - 875 victims rescued" },
      { date: "2024-05-01", event: "Senate investigation begins" },
      { date: "2024-07-17", event: "Alice Guo flees to Indonesia" },
      { date: "2024-09-06", event: "Captured and returned to Philippines" },
      { date: "2025-11-15", event: "Convicted - Life imprisonment" },
    ],
    charges: [
      "Qualified human trafficking",
      "Identity fraud",
      "Falsification of documents",
      "Money laundering",
      "Tax evasion",
      "Graft and corruption",
    ],
  },
  {
    slug: "flood-control",
    title: "Flood Control Infrastructure Corruption Scandal",
    shortTitle: "Flood Control Corruption",
    category: "Infrastructure",
    subcategories: ["graft", "plunder", "bribery", "kickbacks"],
    status: "ongoing",
    priority: "high",
    filingDate: "2025-06-15",
    location: {
      municipality: "Various",
      province: "Nationwide",
      region: "Multiple Regions",
    },
    accused: [
      {
        name: "Multiple Politicians",
        position: "Senators, Representatives, Local Officials",
        status: "under investigation",
      },
    ],
    amountInvolvedPhp: 2000000000,
    description: "P2 billion corruption scandal involving flood control infrastructure projects. Multiple senators and local officials implicated in kickback scheme.",
    keyEvents: [
      { date: "2025-06-15", event: "Whistleblower testimony to Senate" },
      { date: "2025-07-28", event: "Marcos addresses scandal in SONA" },
      { date: "2025-09-11", event: "Independent Commission established" },
      { date: "2025-12-25", event: "Mass arrests of implicated officials" },
    ],
    charges: [
      "Plunder",
      "Graft and corruption",
      "Bribery",
      "Malversation of public funds",
    ],
  },
  {
    slug: "pogo-tax",
    title: "POGO Industry Tax Evasion Cases",
    shortTitle: "POGO Tax Evasion",
    category: "POGO-related",
    subcategories: ["tax_evasion", "regulatory_violations"],
    status: "ongoing",
    priority: "medium",
    filingDate: "2023-01-01",
    location: {
      municipality: "Various",
      province: "Metro Manila",
      region: "NCR",
    },
    accused: [
      {
        name: "Multiple POGO Operators",
        position: "Gaming Operators",
        status: "under investigation",
      },
    ],
    amountInvolvedPhp: 50000000000,
    description: "Widespread tax evasion by Philippine Offshore Gaming Operators estimated at P50 billion. BIR and PAGCOR investigations ongoing.",
    keyEvents: [
      { date: "2023-01-01", event: "BIR launches POGO tax audit" },
      { date: "2024-12-31", event: "POGO ban takes effect" },
      { date: "2025-03-01", event: "Tax collection efforts continue" },
    ],
    charges: [
      "Tax evasion",
      "Failure to file returns",
      "Regulatory violations",
    ],
  },
  {
    slug: "pogo-trafficking",
    title: "POGO Human Trafficking Operations",
    shortTitle: "POGO Trafficking",
    category: "POGO-related",
    subcategories: ["human_trafficking", "illegal_detention", "labor_violations"],
    status: "ongoing",
    priority: "high",
    filingDate: "2023-06-01",
    location: {
      municipality: "Various",
      province: "Multiple",
      region: "Nationwide",
    },
    accused: [
      {
        name: "Multiple POGO Operators",
        position: "Gaming Operators",
        status: "various",
      },
    ],
    amountInvolvedPhp: 0,
    victims: 5000,
    description: "Human trafficking operations connected to POGO facilities across the country. Thousands of foreign workers rescued from illegal detention and forced labor.",
    keyEvents: [
      { date: "2023-06-01", event: "First major POGO trafficking raid" },
      { date: "2024-03-13", event: "Bamban POGO raid - 875 rescued" },
      { date: "2024-12-31", event: "POGO ban signed into law" },
      { date: "2025-01-01", event: "Nationwide POGO shutdown" },
    ],
    charges: [
      "Qualified human trafficking",
      "Illegal detention",
      "Labor law violations",
      "Immigration violations",
    ],
  },
]

export function getCorruptionCaseBySlug(slug: string): CorruptionCase | undefined {
  return corruptionCases.find((c) => c.slug === slug)
}

export function getAllCorruptionCaseSlugs(): string[] {
  return corruptionCases.map((c) => c.slug)
}

export function getHighPriorityCases(): CorruptionCase[] {
  return corruptionCases.filter((c) => c.priority === "high")
}
