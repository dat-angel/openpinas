export const VISUALIZATION_ENTRIES = [
  {
    id: "dynasty-map",
    href: "/dynasties-network-visualization.html",
    title: "Dynasty Network Map",
    kicker: "Power maps",
    description:
      "Trace alliances, rivalries, and territorial control in an interactive network and map view.",
    group: "Core",
    status: "native",
  },
  {
    id: "timeline",
    href: "/interactive-timeline/index.html",
    title: "Timeline",
    kicker: "Event sequence",
    description:
      "Review major Philippine events, filter by category, and see which dynasties were involved.",
    group: "Core",
    status: "native",
  },
  {
    id: "weekly-reviews",
    href: "/weekly-reviews/index.html",
    title: "Weekly Reviews",
    kicker: "Curated analysis",
    description:
      "Scan weekly briefings that connect headlines, dynasties, diaspora impact, and public-life context.",
    group: "Core",
    status: "native",
  },
  {
    id: "business-connections",
    href: "/business-connections-network-visualization.html",
    title: "Business Connections",
    kicker: "Money and ownership",
    description:
      "Map conglomerates, sports assets, media holdings, and political-business overlap across the Philippine elite.",
    group: "Systems",
    status: "native",
  },
  {
    id: "elite-schools",
    href: "/elite-schools-influence-visualization.html",
    title: "Elite Schools",
    kicker: "Class reproduction",
    description:
      "Trace school prestige, alumni pipelines, and provincial influence as an infrastructure of power.",
    group: "Systems",
    status: "native",
  },
  {
    id: "startup-ecosystem",
    href: "/startup-ecosystem-visualization.html",
    title: "Startup Ecosystem",
    kicker: "Capital and founders",
    description:
      "Follow startups, investors, and founders where tech ambition intersects with family networks, capital, and elite institutions.",
    group: "Systems",
    status: "wrapped",
  },
  {
    id: "regional",
    href: "/regional-visualization.html",
    title: "Regional Visualization",
    kicker: "Geographic lens",
    description:
      "Compare regional patterns and subnational power concentration across the Philippine political landscape.",
    group: "Systems",
    status: "wrapped",
  },
  {
    id: "corruption-tracker",
    href: "/corruption-tracker/index.html",
    title: "Corruption Tracker",
    kicker: "Case files",
    description:
      "Browse major corruption, trafficking, and POGO-related cases with timelines and case summaries.",
    group: "Corruption",
    status: "native",
  },
  {
    id: "corruption-network",
    href: "/corruption-tracker/network.html",
    title: "Corruption Network",
    kicker: "Scandal as structure",
    description:
      "Inspect the relationship map behind cases, implicated actors, dynastic ties, and POGO operators.",
    group: "Corruption",
    status: "native",
  },
  {
    id: "corruption-map",
    href: "/corruption-tracker/map.html",
    title: "Corruption Map",
    kicker: "Geography of exposure",
    description:
      "See where corruption cases cluster across provinces, regions, and local political strongholds.",
    group: "Corruption",
    status: "native",
  },
  {
    id: "flood-control-network",
    href: "/corruption-tracker/flood-control-network.html",
    title: "Flood Control Network",
    kicker: "Case-specific deep dive",
    description:
      "Follow the flood-control scandal through its contractor, project, and political relationship web.",
    group: "Corruption",
    status: "wrapped",
  },
];

export const FEATURED_VISUAL_IDS = [
  "business-connections",
  "elite-schools",
  "startup-ecosystem",
  "corruption-network",
  "corruption-map",
];

export const VISUAL_GROUP_ORDER = ["Core", "Systems", "Corruption"];

export function getVisualizationById(id) {
  return VISUALIZATION_ENTRIES.find((entry) => entry.id === id) || null;
}

export function getVisualizationsByIds(ids) {
  return ids
    .map((id) => getVisualizationById(id))
    .filter(Boolean);
}

export function groupVisualizations() {
  return VISUAL_GROUP_ORDER.map((group) => ({
    group,
    items: VISUALIZATION_ENTRIES.filter((entry) => entry.group === group),
  })).filter((section) => section.items.length > 0);
}
