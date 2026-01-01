# Philippine Political Dynasties: News Source & Data Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DATA)

Tracking major political dynasties, their relationships, and major events for the Filipino diaspora. Currently tracking 71 dynasties (national and major regional), with ongoing expansion. Interactive visualizations showing how political families maintain control across 71 provinces.

**Live Demo**: [dat-angel.github.io/openpinas](https://dat-angel.github.io/openpinas/)

## What's Here

- 📰 **Weekly News Digests** - Significant events organized by category
- 🗺️ **Interactive Network Map** - Dynasty relationships and geographic control
- 📅 **Timeline** - Chronological view of major events with dynasty connections
- 📊 **Regional Analysis** - Dynasties and corruption cases by province across Luzon, Visayas, and Mindanao
- 📊 **Datasets** - 71 dynasties, 148+ key members, 71 provinces tracked
- ⚖️ **Corruption Case Tracker** - POGO-related cases, corruption tracking, and accountability

## Quick Start

You need a local web server to run the visualizations (browser security restrictions):

```bash
git clone https://github.com/dat-angel/openpinas.git
cd openpinas
python3 -m http.server 8000
```

Then open http://localhost:8000/ in your browser

## Files

**Data:**
- `philippine-political-dynasties-network-2025.json` - Dynasty data, relationships, geographic control
- `philippines-2025-timeline.json` - Timeline of major events

**Visualizations:**
- `dynasties-network-visualization.html` - Interactive network and map
- `interactive-timeline/` - Timeline visualization
- `regional-visualization.html` - Regional analysis by province (Luzon, Visayas, Mindanao)
- `weekly-reviews/` - Weekly review template and archive

**Projects:**
- `corruption-tracker/` - Corruption & POGO case tracker (MVP complete)
  - Case list with filtering and search
  - Detailed case pages with timelines
  - Statistics dashboard

## Key Stats (2025)

**Current Dataset Scope:**
- 71 major dynasties tracked (curated subset of ~250 total political families)
- Focus: National power dynasties and high-profile regional dynasties
- Coverage includes: Negros Occidental, Pangasinan, Bicol, Zamboanga, Metro Manila cities, Iloilo, Bohol, Bulacan, Pampanga, Tarlac, Cotabato, and more
- 148+ key members tracked
- 45+ provinces/regions with detailed geographic mapping
- Regional breakdown: 37 dynasties in Luzon, 17 in Visayas, 18 in Mindanao

**Philippine Political Reality:**
- 71 of 82 provinces (86.6%) controlled by dynasties
- 67% of congressional seats held by dynastic families
- ~250 political families across all levels of government
- Longest-running: Ortega family (157 years, La Union)

*Note: This dataset prioritizes dynasties with national reach, 2025 events, corruption connections, or significant media coverage. Many regional and local dynasties are not yet included.*

## Features

**Network Visualization:**
- Interactive force-directed graph showing dynasty connections
- Filter by power level, crisis status, or region
- Switch between network and map views
- Click any dynasty for detailed info (members, control, alliances, timeline events)

**Timeline Visualization:**
- Chronological view of 49 major 2025 events
- Filter by category (Political, Cultural, Natural Disasters, etc.)
- Each event shows involved dynasties with links to network map

**Regional Analysis:**
- Interactive charts showing dynasties and corruption cases by province
- Filter by region (Luzon, Visayas, Mindanao)
- Sortable table with province-level statistics
- Visual breakdown of political power concentration across regions

**Weekly Reviews:**
- Summaries of significant weekly events
- Statistics dashboard and dynasty highlights
- Links to full timeline and dynasty profiles

## Why This Matters

Political dynasties have been a defining feature of Philippine politics since independence. Despite a constitutional mandate against political dynasties, no Anti-Political Dynasty Law has been passed in over 35 years.

For the 10+ million Filipinos living abroad, understanding these power structures helps us:
- Make sense of news from back home
- Understand how governance affects our families
- See connections between corruption scandals and political families
- Track which regions have stable leadership vs. ongoing crises

## Data Structure

The timeline and dynasty datasets are **complementary but standalone**:

- **Timeline → Dynasties**: Each event includes `mentioned_dynasties` array
- **Dynasties → Timeline**: Each dynasty includes `timeline_events` array
- Both JSON files work independently (cross-references are optional)

## Data Sources

- Philippine Center for Investigative Journalism (PCIJ)
- Rappler
- Philippine Daily Inquirer
- Manila Bulletin
- Philippine Star
- Wikipedia
- International news sources

## Contributing

Found a new event or dynasty connection? Update the JSON files, validate the syntax, and open a Pull Request.

For major changes, open an issue first so we can discuss the approach.

## License

- **Code** (HTML, CSS, JavaScript): [MIT License](LICENSE)
- **Data** (JSON files): [CC BY 4.0](LICENSE-DATA)

Use the code however you want. Use the data too, just give attribution. This is for educational and research purposes.

## Contact

- **Website**: [beatriz.page](https://beatriz.page)
- **GitHub**: [@dat-angel](https://github.com/dat-angel)

---

If you find this useful, please star it on GitHub or share it with others. Together, we can make political power structures more transparent and understandable.
