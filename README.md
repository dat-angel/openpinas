# Philippine Political Dynasties: News Source & Data Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DATA)

Open data platform tracking Philippine political power structures, business connections, and major events. Interactive visualizations showing how political families maintain control across 71 provinces.

**Live Demo**: [dat-angel.github.io/openpinas](https://dat-angel.github.io/openpinas/)

## What's Here

- 📰 **Weekly News Digests** - Significant events organized by category
- 🗺️ **Interactive Network Map** - Dynasty relationships and geographic control
- 📅 **Timeline** - Chronological view of major events with dynasty connections
- 📊 **Datasets** - 50+ dynasties, 450+ members, 71 provinces tracked

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
- `philippines-2026-timeline.json` - Timeline of major events (2026)
- `business-connections-2025.json` - Business-political connections (PBA teams, conglomerates, media ownership)

**Visualizations:**
- `dynasties-network-visualization.html` - Interactive network and map
- `interactive-timeline/` - Timeline visualization
- `weekly-reviews/` - Weekly review template and archive

**Documentation:**
- `docs/business-connections/` - Business connections project documentation

## Key Stats (2025)

- 50+ dynasties tracked
- 450+ members tracked
- 71 of 82 provinces (86.6%) controlled by dynasties
- 67% of congressional seats held by dynastic families
- Longest-running: Ortega family (157 years, La Union)

## Features

**Network Visualization:**
- Interactive force-directed graph showing dynasty connections
- Filter by power level, crisis status, or region
- Switch between network and map views
- Click any dynasty for detailed info (members, control, alliances, timeline events)

**Timeline Visualization:**
- Chronological view of 54 major 2025 events
- Filter by category (Political, Cultural, Natural Disasters, etc.)
- Each event shows involved dynasties with links to network map

**Weekly Reviews:**
- Summaries of significant weekly events
- Statistics dashboard and dynasty highlights
- Links to full timeline and dynasty profiles

## Why This Matters

Political dynasties have been a defining feature of Philippine politics since independence. Despite a constitutional mandate against political dynasties, no Anti-Political Dynasty Law has been passed in over 35 years.

Understanding these power structures helps us:
- Make sense of political news and events
- See connections between corruption scandals and political families
- Track which regions have stable leadership vs. ongoing crises
- Understand how business and political power intersect

## Related Work & Why OpenPinas

I’m building OpenPinas alongside strong academic, civic, and investigative work. This project doesn’t replace them—it connects them.

**Related projects worth following (full list here):**
- Sources and related projects: `sources-and-related-projects.html`
- Ateneo Policy Center Political Dynasties Dataset: https://www.inclusivedemocracy.ph/data-and-infographics
- PCIJ Political Dynasties Database: https://pcij.org/political-dynasties/
- BetterGov Dynasty Tracker: https://dynasty-tracker.bettergov.ph

**Why OpenPinas exists:**
- Cross-links dynasties, timelines, business connections, and geography in one place
- Curated summaries provide fast context on complex power structures
- Open JSON datasets that can be audited, reused, and extended

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
