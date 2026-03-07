export interface DynastyMember {
  name: string
  position: string
  region?: string
  termStart?: number
  termEnd?: number
  historical?: boolean
}

export interface Dynasty {
  slug: string
  name: string
  patriarch: string
  established: number
  classification: string
  powerLevel: "national" | "regional" | "local"
  primaryRegions: string[]
  status2025: string
  keyMembers: DynastyMember[]
  alliedDynasties: string[]
  rivalDynasties: string[]
  businessInterests: string[]
  wealthLevel: "ultra_high" | "high" | "medium"
  description: string
  historicalNotes: string
}

export const dynasties: Dynasty[] = [
  {
    slug: "marcos-romualdez",
    name: "Marcos-Romualdez Dynasty",
    patriarch: "Ferdinand Marcos Jr.",
    established: 1925,
    classification: "Imperial Dynasty",
    powerLevel: "national",
    primaryRegions: ["Ilocos Norte", "Leyte"],
    status2025: "Consolidating Power",
    keyMembers: [
      { name: "Ferdinand Marcos Jr.", position: "President of the Philippines", termStart: 2022, termEnd: 2028 },
      { name: "Imelda Marcos", position: "Congresswoman", region: "Leyte-2nd District" },
      { name: "Imee Marcos-Manotoc", position: "Senator", termStart: 2019 },
      { name: "Sandro Marcos", position: "Representative, Ilocos Norte-1st District" },
      { name: "Ferdinand Marcos Sr.", position: "Former President", termStart: 1965, termEnd: 1986, historical: true },
    ],
    alliedDynasties: ["Romualdez", "Revilla-Tolentino", "Villar"],
    rivalDynasties: ["Duterte", "Aquino"],
    businessInterests: ["Manufacturing", "Agriculture", "Media", "Real Estate"],
    wealthLevel: "ultra_high",
    description: "The dominant political dynasty controlling the presidency. Originated from Ilocos Norte, expanded through marriage to Romualdez family of Leyte.",
    historicalNotes: "Dynasty rehabilitated after 1986 fall; now controls presidency and significant congressional seats; 2025 marked aggressive anti-corruption stance while maintaining political control.",
  },
  {
    slug: "duterte",
    name: "Duterte Dynasty",
    patriarch: "Rodrigo Duterte",
    established: 1988,
    classification: "Regional Dynasty",
    powerLevel: "national",
    primaryRegions: ["Davao del Sur", "Davao City"],
    status2025: "Under Pressure",
    keyMembers: [
      { name: "Rodrigo Duterte", position: "Former President (ICC Detention)", termStart: 2016, termEnd: 2022 },
      { name: "Sara Duterte-Carpio", position: "Vice President", termStart: 2022, termEnd: 2028 },
      { name: "Sebastian Duterte", position: "Mayor, Davao City" },
      { name: "Paolo Duterte", position: "Representative, Davao City-1st District" },
    ],
    alliedDynasties: ["Arroyo"],
    rivalDynasties: ["Marcos-Romualdez", "Aquino"],
    businessInterests: ["Real Estate", "Construction"],
    wealthLevel: "high",
    description: "Davao-based dynasty that rose to national prominence with Rodrigo Duterte's presidency. Now facing pressure with ICC detention and impeachment proceedings.",
    historicalNotes: "2025 marked breakdown of UniTeam alliance with Marcos family; VP Sara impeachment blocked by Supreme Court; Rodrigo Duterte detained by ICC.",
  },
  {
    slug: "aquino",
    name: "Aquino Dynasty",
    patriarch: "Benigno Aquino Jr. (historical)",
    established: 1946,
    classification: "Reform Dynasty",
    powerLevel: "national",
    primaryRegions: ["Tarlac", "Metro Manila"],
    status2025: "Opposition Resurgence",
    keyMembers: [
      { name: "Benigno Aquino Jr.", position: "Senator (assassinated 1983)", historical: true },
      { name: "Corazon Aquino", position: "Former President", termStart: 1986, termEnd: 1992, historical: true },
      { name: "Benigno Aquino III", position: "Former President", termStart: 2010, termEnd: 2016, historical: true },
      { name: "Kris Aquino", position: "Media Personality" },
    ],
    alliedDynasties: ["Roxas", "Liberal Party allies"],
    rivalDynasties: ["Marcos-Romualdez", "Duterte"],
    businessInterests: ["Sugar", "Media", "Banking"],
    wealthLevel: "high",
    description: "Historical reform-oriented dynasty that led EDSA Revolution. Currently rebuilding opposition coalition.",
    historicalNotes: "2025 saw opposition resurgence with Liberal Party gains; symbolic importance in anti-corruption discourse.",
  },
  {
    slug: "arroyo",
    name: "Arroyo Dynasty",
    patriarch: "Gloria Macapagal-Arroyo",
    established: 1961,
    classification: "Political Dynasty",
    powerLevel: "national",
    primaryRegions: ["Pampanga"],
    status2025: "Influential",
    keyMembers: [
      { name: "Diosdado Macapagal", position: "Former President", termStart: 1961, termEnd: 1965, historical: true },
      { name: "Gloria Macapagal-Arroyo", position: "Senior Deputy Speaker", termStart: 2001, termEnd: 2010 },
      { name: "Mikey Arroyo", position: "Representative, Pampanga-2nd District" },
    ],
    alliedDynasties: ["Marcos-Romualdez", "Duterte"],
    rivalDynasties: ["Aquino"],
    businessInterests: ["Power Generation", "Real Estate"],
    wealthLevel: "high",
    description: "Pampanga-based dynasty with two presidents. GMA maintains influence as senior deputy speaker.",
    historicalNotes: "Survived multiple corruption allegations; maintains kingmaker status in House of Representatives.",
  },
  {
    slug: "estrada",
    name: "Estrada Dynasty",
    patriarch: "Joseph Estrada",
    established: 1969,
    classification: "Entertainment-Political Dynasty",
    powerLevel: "regional",
    primaryRegions: ["Manila", "San Juan"],
    status2025: "Declining",
    keyMembers: [
      { name: "Joseph Estrada", position: "Former President, Former Manila Mayor", termStart: 1998, termEnd: 2001 },
      { name: "Jinggoy Estrada", position: "Senator" },
      { name: "JV Ejercito", position: "Senator" },
    ],
    alliedDynasties: ["Revilla-Tolentino"],
    rivalDynasties: ["Aquino"],
    businessInterests: ["Entertainment", "Real Estate"],
    wealthLevel: "high",
    description: "Entertainment industry dynasty that transitioned to politics. Based in Manila and San Juan.",
    historicalNotes: "Joseph Estrada was ousted in 2001 EDSA II; dynasty maintains Senate presence through sons.",
  },
  {
    slug: "villar",
    name: "Villar Dynasty",
    patriarch: "Manny Villar",
    established: 1992,
    classification: "Business-Political Dynasty",
    powerLevel: "national",
    primaryRegions: ["Las Pinas", "Metro Manila"],
    status2025: "Economically Powerful",
    keyMembers: [
      { name: "Manny Villar", position: "Former Senator, Business Magnate" },
      { name: "Cynthia Villar", position: "Senator" },
      { name: "Mark Villar", position: "Former DPWH Secretary" },
      { name: "Camille Villar", position: "Representative, Las Pinas" },
    ],
    alliedDynasties: ["Marcos-Romualdez"],
    rivalDynasties: [],
    businessInterests: ["Real Estate", "Retail", "Banking", "Mining"],
    wealthLevel: "ultra_high",
    description: "Richest political family in the Philippines. Built Vista Land real estate empire.",
    historicalNotes: "Manny Villar is the richest Filipino; family maintains political positions while expanding business empire.",
  },
  {
    slug: "binay",
    name: "Binay Dynasty",
    patriarch: "Jejomar Binay",
    established: 1986,
    classification: "Local Dynasty",
    powerLevel: "regional",
    primaryRegions: ["Makati"],
    status2025: "Diminished",
    keyMembers: [
      { name: "Jejomar Binay", position: "Former Vice President", termStart: 2010, termEnd: 2016 },
      { name: "Abby Binay", position: "Former Makati Mayor" },
      { name: "Nancy Binay", position: "Senator" },
    ],
    alliedDynasties: [],
    rivalDynasties: ["Aquino"],
    businessInterests: ["Real Estate"],
    wealthLevel: "high",
    description: "Makati-based dynasty that dominated local politics for decades. Influence diminished after corruption allegations.",
    historicalNotes: "Lost Makati stronghold; Nancy Binay maintains Senate presence.",
  },
  {
    slug: "dy",
    name: "Dy Dynasty",
    patriarch: "Faustino Dy Jr.",
    established: 1971,
    classification: "Regional Dynasty",
    powerLevel: "national",
    primaryRegions: ["Isabela", "Cagayan Valley"],
    status2025: "Rising Power",
    keyMembers: [
      { name: "Faustino Dy III", position: "Speaker of the House", termStart: 2025 },
      { name: "Faustino Dy Jr.", position: "Former Governor, Isabela" },
    ],
    alliedDynasties: ["Marcos-Romualdez"],
    rivalDynasties: [],
    businessInterests: ["Agriculture", "Tobacco"],
    wealthLevel: "high",
    description: "Isabela-based dynasty that rose to national prominence in 2025 when Faustino Dy III became House Speaker.",
    historicalNotes: "2025 breakthrough: Dy III became Speaker after Martin Romualdez resignation.",
  },
  {
    slug: "revilla-tolentino",
    name: "Revilla-Tolentino Dynasty",
    patriarch: "Bong Revilla",
    established: 1971,
    classification: "Entertainment-Political Dynasty",
    powerLevel: "national",
    primaryRegions: ["Cavite"],
    status2025: "Stable",
    keyMembers: [
      { name: "Ramon Revilla Sr.", position: "Former Senator", historical: true },
      { name: "Bong Revilla", position: "Senator" },
      { name: "Strike Revilla", position: "Governor, Cavite" },
      { name: "Francis Tolentino", position: "Senator" },
    ],
    alliedDynasties: ["Marcos-Romualdez", "Estrada"],
    rivalDynasties: [],
    businessInterests: ["Entertainment", "Real Estate"],
    wealthLevel: "high",
    description: "Cavite-based entertainment dynasty. Bong Revilla acquitted in plunder case, returned to Senate.",
    historicalNotes: "Action star lineage; maintains Cavite stronghold and Senate presence.",
  },
  {
    slug: "singson",
    name: "Singson Dynasty",
    patriarch: "Luis Singson",
    established: 1970,
    classification: "Regional Dynasty",
    powerLevel: "regional",
    primaryRegions: ["Ilocos Sur"],
    status2025: "Stable",
    keyMembers: [
      { name: "Luis Singson", position: "Former Governor, Ilocos Sur" },
      { name: "Jeremias Singson", position: "Governor, Ilocos Sur" },
      { name: "Ryan Singson", position: "Representative, Ilocos Sur" },
    ],
    alliedDynasties: ["Marcos-Romualdez"],
    rivalDynasties: [],
    businessInterests: ["Tobacco", "Agriculture"],
    wealthLevel: "high",
    description: "Ilocos Sur-based dynasty with decades of control over the province.",
    historicalNotes: "Luis Singson was key witness in Estrada impeachment trial; family maintains Ilocos Sur dominance.",
  },
  {
    slug: "tulfo",
    name: "Tulfo Dynasty",
    patriarch: "Raffy Tulfo",
    established: 2010,
    classification: "Media-Political Dynasty",
    powerLevel: "national",
    primaryRegions: ["Metro Manila"],
    status2025: "Growing",
    keyMembers: [
      { name: "Raffy Tulfo", position: "Senator" },
      { name: "Ben Tulfo", position: "Media Personality" },
      { name: "Erwin Tulfo", position: "Former DSWD Secretary" },
    ],
    alliedDynasties: ["Marcos-Romualdez"],
    rivalDynasties: [],
    businessInterests: ["Media", "Broadcasting"],
    wealthLevel: "medium",
    description: "Media family that leveraged broadcasting success into political power. Raffy Tulfo topped 2022 Senate race.",
    historicalNotes: "First family to transition from broadcast media to Senate dominance in single generation.",
  },
  {
    slug: "pacquiao",
    name: "Pacquiao Dynasty",
    patriarch: "Manny Pacquiao",
    established: 2010,
    classification: "Sports-Political Dynasty",
    powerLevel: "regional",
    primaryRegions: ["Sarangani", "General Santos"],
    status2025: "Transitioning",
    keyMembers: [
      { name: "Manny Pacquiao", position: "Former Senator, Boxing Champion" },
      { name: "Jinkee Pacquiao", position: "Vice Governor, Sarangani" },
    ],
    alliedDynasties: [],
    rivalDynasties: ["Duterte"],
    businessInterests: ["Sports", "Real Estate", "Retail"],
    wealthLevel: "ultra_high",
    description: "Boxing legend turned politician. Lost 2022 presidential bid but maintains regional influence.",
    historicalNotes: "Ran against both Marcos and Duterte-backed candidates in 2022; rebuilding political base.",
  },
]

export function getDynastyBySlug(slug: string): Dynasty | undefined {
  return dynasties.find((d) => d.slug === slug)
}

export function getAllDynastySlugs(): string[] {
  return dynasties.map((d) => d.slug)
}

export function getDynastiesByPowerLevel(level: Dynasty["powerLevel"]): Dynasty[] {
  return dynasties.filter((d) => d.powerLevel === level)
}
