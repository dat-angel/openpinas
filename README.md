# Philippine Political Dynasties: News Source & Data Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DATA)
[![GitHub](https://img.shields.io/github/followers/dat-angel?label=Follow&style=social)](https://github.com/dat-angel)

## Overview

I've been building this project to help Filipino diaspora communities understand what's happening in the Philippines. It started as a curiosity about how political families maintain control across generations, and it's grown into a resource that tracks 50+ dynasties, their relationships, and major events.

For the 10+ million Filipinos living abroad, understanding these power structures matters. Our remittances directly impact families affected by governance quality. When corruption scandals break or natural disasters expose infrastructure failures, we need to understand who's responsible and how power networks operate.

**What's here:**
- 📰 **Weekly News Digests** - I summarize significant events each week, organized by category
- 🗺️ **Interactive Visualizations** - Network graphs showing dynasty relationships, plus maps of geographic control
- 📊 **Datasets** - 50+ dynasties, 450+ members, 71 provinces tracked
- 🔗 **Cross-References** - Events linked to dynasties, dynasties linked to events

**Live Demo**: [beatriz.page/philippine-politics](https://beatriz.page/philippine-politics)

**Author**: [Beatriz](https://beatriz.page) | [GitHub](https://github.com/dat-angel)

## Files

### Data Files
- **`philippine-political-dynasties-network-2025.json`** - Complete dataset of political dynasties, relationships, and geographic control
- **`philippines-2025-timeline.json`** - Timeline of major Philippine events in 2025
- **`philippines-2026-timeline.json`** - Timeline of major Philippine events in 2026 (ongoing)

### Visualizations
- **`dynasties-network-visualization.html`** - Interactive network and map visualization
- **`interactive-timeline/`** - Interactive timeline visualization

### Weekly Digests
- **`weekly-reviews/`** - Weekly news digests summarizing significant events
  - `weekly-review-template.html` - Template for generating weekly reviews
  - `weekly-review-YYYY-MM-DD.html` - Individual weekly review pages
  - `index.html` - Archive of all weekly reviews

## Cross-References Between Timeline and Dynasties

The timeline and dynasty datasets are **complementary but standalone**:

### Timeline → Dynasties
- Each timeline event includes a `mentioned_dynasties` array listing which political dynasties were involved
- Click on dynasty names in the timeline to jump to the network visualization
- Example: The "Vice President Sara Duterte Impeachment Complaint Filed" event references `["DUTERTE_FAMILY", "MARCOS_ROMUALDEZ", "ROMUALDEZ_FAMILY"]`

### Dynasties → Timeline
- Each dynasty includes a `timeline_events` array showing which 2025 events they participated in
- Events are categorized by role: `primary_actor`, `participant`, or `mentioned`
- Click on a dynasty node in the network visualization to see their timeline events
- Example: The Duterte Dynasty's timeline events include ICC arrest, impeachment proceedings, and midterm elections

### Standalone Usage
Both JSON files can be used independently:
- The timeline JSON works without the dynasty data (dynasty references are optional)
- The dynasty JSON works without the timeline data (timeline events are optional)
- This allows for flexible data usage and future expansion

## Quick Start

### Running the Visualization

Due to browser security restrictions (CORS), you cannot open the HTML files directly. You need to use a local web server:

#### Option 1: Python (Recommended)
```bash
git clone https://github.com/dat-angel/philippine-political-dynasties.git
cd philippine-political-dynasties
python3 -m http.server 8000
```

Then open in browser:
- Weekly Reviews: http://localhost:8000/weekly-reviews/
- Network Map: http://localhost:8000/dynasties-network-visualization.html
- Timeline: http://localhost:8000/interactive-timeline/

#### Option 2: Node.js
```bash
git clone https://github.com/dat-angel/philippine-political-dynasties.git
cd philippine-political-dynasties
npx serve
```

#### Option 3: VS Code Live Server
Install the "Live Server" extension and right-click the HTML file to "Open with Live Server"

## Features

### Weekly News Digests
I write these every week to catch you up on what matters. Each digest includes:
- Events organized by category (Political, Natural Disasters, Cultural, Economic, Legal, International Relations)
- A quick stats dashboard showing what happened that week
- Links to the full timeline and dynasty profiles
- Focus on diaspora relevance—how events affect families back home, remittances, and governance quality

### Network Visualization
The interactive network graph shows how dynasties connect:
- Color-coded by dynasty classification (using Filipino flag colors)
- Filter by power level, crisis status, or region
- Click any dynasty to see detailed info—key members, geographic control, alliances, rivalries
- Switch between network view and map view
- Each dynasty shows their 2025 timeline events right in the info panel

### Timeline Visualization
A chronological view of major events in 2025:
- Filter by category to focus on what you care about
- Each event shows which dynasties were involved—click to jump to their network profiles
- Full descriptions explain what happened, why it matters, and how it affects the diaspora
- Links back to the network map so you can see the bigger picture

### Map Visualization
See where dynasties actually control territory:
- Interactive map of the Philippines with province-level detail
- Color-coded markers show which dynasty controls each province
- Click any province to see control details and dynasty info
- Filter by region (Luzon, Visayas, Mindanao) to focus on specific areas

### Information Panel
When you click a dynasty, you'll see:
- Key members (with Wikipedia links)
- Their historical timeline
- Which provinces they control
- Alliances and rivalries with other dynasties
- Corruption allegations and investigations
- Their 2025 timeline events (linked to the full timeline)
- Recent rumors and headlines with source links

### Glossary Panel
- Definitions of key terms used in the visualization
- Accessible via "Glossary" button in controls

## Glossary of Terms

### Dynasty Classifications

**Imperial Dynasty** - Highest level of political dynasty power. Controls national-level positions (President, Vice President, Senators) and has extensive influence across multiple regions. Examples: Marcos-Romualdez, Ortega.

**Dominant Dynasty** - Very high power dynasty with strong regional control and significant national influence. Often controls multiple provinces or major cities. Examples: Singson, Duterte.

**Major Dynasty** - High power dynasty with substantial regional control and multiple family members in office. Typically controls one or more provinces. Examples: Revilla-Tolentino, Pacquiao, Aquino.

**Established Dynasty** - Moderate-high power dynasty with stable regional control and established political presence. Has maintained power for significant duration. Examples: Villar, Kho.

**Rising Dynasty** - Growing power dynasty that is expanding its political influence and control. Often newer dynasties gaining momentum. Examples: Tulfo.

**Minor Dynasty** - Lower power dynasty with limited regional control and fewer positions held. May be in decline or just starting. Examples: Aquino (2025 status).

**New Dynasty** - Recently established political dynasty just beginning to build political power. Examples: Cadiz.

### Power Levels

**National** - Dynasty has members in national positions (President, Vice President, Senators, Cabinet Secretaries). Examples: Marcos-Romualdez (President), Duterte (VP, former President).

**Regional** - Dynasty primarily controls regional positions (Governors, Mayors, Congressional Districts). Most dynasties fall into this category.

### Relationship Types

**Alliance** - Political partnership between dynasties, often for mutual support and shared interests. Shown as solid blue lines in the network.

**Rivalry** - Political opposition or competition between dynasties, often involving conflicts over power or territory. Shown as dashed red lines.

**Corruption Network** - Connections between dynasties and contractors/officials involved in corrupt practices, particularly in infrastructure projects. Shown as thick gold lines.

**Marriage** - Family connections through marriage that create political alliances. Shown as solid blue lines.

### Control Status

**Absolute Control** - Dynasty controls all major positions in a province (Governor, Vice Governor, all Congressional seats, Mayor of capital). Example: Ilocos Norte (Marcos), Ilocos Sur (Singson).

**Complete Monopoly** - Single family controls all top positions in a province, effectively eliminating political competition. Example: Masbate (Kho family).

**Contested Control** - Multiple dynasties competing for control of the same region, often involving conflicts. Example: Maguindanao (Ampatuan vs Mangudadatu).

**Power Shared** - Multiple dynasties share control of a region through cooperation or division of positions. Example: Cavite (Revilla-Tolentino and Remulla families).

### Crisis Levels

**Critical** - Dynasty facing severe challenges such as legal proceedings, impeachment, or major scandals. Examples: Duterte (ICC detention, VP impeachment), Estrada (dynasty collapse).

**High** - Dynasty facing significant challenges including investigations, business scandals, or electoral losses. Examples: Villar (business scandals).

**Stable** - Dynasty maintaining normal operations without major crises.

### Key Political Terms

**Pork Barrel Scam** - Corruption scheme where legislators allocate government funds (Priority Development Assistance Fund) to fake NGOs in exchange for kickbacks. Major scandal exposed in 2013 involving multiple senators and representatives.

**ICC (International Criminal Court)** - International tribunal that prosecutes individuals for crimes against humanity, genocide, and war crimes. Former President Rodrigo Duterte is the first Philippine leader to face trial at ICC.

**DPWH (Department of Public Works and Highways)** - Philippine government agency responsible for infrastructure projects. Frequently involved in corruption scandals, including the 2025 flood control corruption scandal where $2 billion was lost.

**Impeachment** - Constitutional process to remove high-ranking officials (President, Vice President, Supreme Court Justices) from office for violations of the Constitution, treason, bribery, graft, corruption, or betrayal of public trust.

**UniTeam** - Political alliance between the Marcos and Duterte families that won the 2022 elections. The alliance completely broke down in 2025.

**Midterm Elections** - Elections held in the middle of a presidential term (every 3 years) to elect 12 of 24 Senators, all House Representatives, and local officials.

## Data Structure

### JSON Structure

The `philippine-political-dynasties-network-2025.json` file contains:

- **metadata** - Information about the dataset, version, and updates
- **nodes.dynasties** - Array of dynasty objects with:
  - Basic information (name, patriarch, established date)
  - Classification and power level
  - Key members with Wikipedia links
  - Geographic regions and coordinates
  - Alliances and rivalries
  - Corruption allegations
  - 2025 rumors and headlines with source URLs
- **edges.relationships** - Array of relationship objects showing:
  - Source and target dynasties
  - Relationship type (alliance, rivalry, corruption_network, marriage)
  - Strength and description
- **geographic_nodes.provinces** - Array of province objects showing:
  - Controlling dynasty
  - Control duration and strength
  - Positions held

## Color Scheme

The visualization uses colors inspired by the Philippine flag:

- **Blue (#0038A8)** - Imperial dynasties, alliances
- **Red (#CE1126)** - Dominant dynasties, rivalries
- **Bright Blue (#0066CC)** - Major dynasties, marriage relationships
- **Crimson (#DC143C)** - Established dynasties
- **Gold (#FFD700)** - Rising dynasties, corruption networks
- **Forest Green (#228B22)** - Minor dynasties
- **Orange-Red (#FF6B35)** - New dynasties

## Usage Tips

1. **Click on nodes** to see detailed dynasty information
2. **Use filters** to focus on specific power levels, crisis status, or regions
3. **Toggle relationship types** to show/hide alliances, rivalries, or corruption networks
4. **Switch to map view** to see geographic distribution
5. **Click map markers** to see province control details
6. **Use Glossary button** to see definitions of terms
7. **Click Wikipedia icons** (📖) next to member names for more information
8. **Click headlines** in the info panel to read full articles

## Key Statistics (2025)

- **Total Dynasties Tracked**: 50+
- **Total Members Tracked**: 450+
- **Provinces Controlled by Dynasties**: 71 of 82 (86.6%)
- **Congressional Dynastic Representation**: 67%
- **Mayoral Positions Dynastic**: 53%
- **Longest-Running Dynasty**: Ortega family (157 years, La Union)
- **Largest Single-Family Candidacy**: Singson family (23 members in 2025)

## Why This Matters

Political dynasties have been a defining feature of Philippine politics since independence. Despite a constitutional mandate against political dynasties (Article II, Section 26), no Anti-Political Dynasty Law has been passed in over 35 years of attempts.

The 2025 midterm elections showed continued dynastic dominance, but also some shifts—the Estrada dynasty collapsed, while the Aquino family made a surprising comeback. These changes matter because they affect governance quality, infrastructure projects, and how our remittances are used.

For the diaspora, understanding these power structures helps us:
- Make sense of news from back home
- Understand how governance affects our families
- See connections between corruption scandals and political families
- Track which regions have stable leadership vs. ongoing crises

## Data Sources

- Philippine Center for Investigative Journalism (PCIJ)
- Rappler
- Philippine Daily Inquirer
- Manila Bulletin
- Philippine Star
- Wikipedia
- International news sources (Time, ABC News, etc.)

## Technical Details

### Libraries Used
- **vis-network** - Network graph visualization
- **Leaflet.js** - Interactive map visualization
- **OpenStreetMap** - Map tiles

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design for mobile and desktop

## Troubleshooting

### "Error loading network data"
- Make sure you're using a local web server (not opening file:// directly)
- Check that `philippine-political-dynasties-network-2025.json` is in the same directory
- Check browser console (F12) for detailed error messages
- Verify JSON file is valid (no syntax errors)

### Map not showing
- Check internet connection (map tiles require online access)
- Verify Leaflet.js library is loading
- Check browser console for JavaScript errors

### Links not working
- Some Wikipedia links may not exist for all members (auto-generated URLs)
- News article URLs are examples and may need to be updated with actual article links
- All links open in new tabs

## Contributing

I'd love your help keeping this project current. Here's how you can contribute:

**Data Updates:**
- Found a new event or dynasty connection? Update the JSON files
- Validate JSON syntax before submitting
- If you add new fields, update the visualizations too
- Test everything locally before opening a PR

**How to Contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Test locally with a web server
5. Open a Pull Request with a clear description

For major changes, open an issue first so we can discuss the approach. I'm especially interested in:
- New events to add to the timeline
- Dynasty relationship updates
- Geographic control changes
- Improvements to the visualizations

## License

This project uses a dual license:

- **Code and Visualizations** (HTML, CSS, JavaScript): [MIT License](LICENSE)
- **Data** (JSON files with compiled information): [CC BY 4.0](LICENSE-DATA)

**What this means:**
- Use the code however you want (MIT is permissive)
- Use the data too, just give attribution (CC BY 4.0)
- This is for educational and research purposes
- All data comes from publicly available sources

## Acknowledgments

This project wouldn't exist without:
- **Data sources**: Philippine Center for Investigative Journalism (PCIJ), Rappler, Philippine Daily Inquirer, Manila Bulletin, Philippine Star, Wikipedia, and international news sources
- **Visualization libraries**: [vis-network.js](https://visjs.github.io/vis-network/) for the network graph, [Leaflet.js](https://leafletjs.com/) for the map
- **Map tiles**: [OpenStreetMap](https://www.openstreetmap.org/) for the Philippines map

Maraming salamat to everyone who's helped with data, feedback, and encouragement.

## Contact

- **Website**: [beatriz.page](https://beatriz.page)
- **GitHub**: [@dat-angel](https://github.com/dat-angel)
- **Issues**: [GitHub Issues](https://github.com/dat-angel/philippine-political-dynasties/issues)

---

**Last Updated**: January 2026  
**Data Scope**: Historical (1868) through 2025, with ongoing 2026 updates

If you find this useful, please star it on GitHub or share it with others. Together, we can make political power structures more transparent and understandable.

