# Philippine Political Dynasties: News Source & Data Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DATA)

I've been tracking Philippine political dynasties and major events for the Filipino diaspora. This project started as a curiosity about how political families maintain control across generations, and it's grown into a resource that tracks 50+ dynasties, their relationships, and major events.

For the 10+ million Filipinos living abroad, understanding these power structures matters. Our remittances directly impact families affected by governance quality. When corruption scandals break or natural disasters expose infrastructure failures, we need to understand who's responsible and how power networks operate.

**Live Site**: [dat-angel.github.io/philippine-political-dynasties](https://dat-angel.github.io/philippine-political-dynasties/)

## What's Here

- **Weekly News Digests** - I summarize significant events each week, organized by category
- **Interactive Network Map** - Shows how dynasties connect, their relationships, and geographic control
- **Timeline** - Chronological view of major events with dynasty connections
- **Datasets** - 50+ dynasties, 450+ members, 71 provinces tracked

## Quick Start

You need a local web server to run the visualizations (browser security restrictions):

```bash
git clone https://github.com/dat-angel/philippine-political-dynasties.git
cd philippine-political-dynasties
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
- `weekly-reviews/` - Weekly review template and archive

## Key Stats (2025)

- 50+ dynasties tracked
- 450+ members tracked
- 71 of 82 provinces (86.6%) controlled by dynasties
- 67% of congressional seats held by dynastic families
- Longest-running: Ortega family (157 years, La Union)

## Why This Matters

Political dynasties have been a defining feature of Philippine politics since independence. Despite a constitutional mandate against political dynasties, no Anti-Political Dynasty Law has been passed in over 35 years of attempts.

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
- International news sources

## Contributing

I'd love your help keeping this current. Found a new event or dynasty connection? Update the JSON files, validate the syntax, and open a Pull Request.

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
