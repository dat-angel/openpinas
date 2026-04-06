# OpenPinas

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DATA)

Open data platform tracking Philippine political power structures, business connections, and major events. Interactive visualizations showing how political families maintain control across 71 provinces.

**Live site:** [openpinas.dev](https://openpinas.dev)

**Data endpoint:** `https://dat-angel.github.io/openpinas/<file>.json` — GitHub Pages serves the raw JSON files directly. Use this in scripts and notebooks when you want a stable, CDN-backed URL without hitting the Vercel app. See [API.md](./API.md) for examples.

---

## Migration: HTML → Next.js

This project is being migrated from standalone HTML files to a **Next.js (JavaScript) application**. Here's what that means:

| | Before | Now |
|---|---|---|
| **Tech** | Static HTML/CSS/JS files | Next.js (React, static export) |
| **Hosting** | GitHub Pages | Vercel → `openpinas.dev` |
| **Pages** | `.html` files in repo root | `app/` directory (React components) |
| **URL format** | `/dynasties-network-visualization.html` | Same paths preserved — no broken links |

**Status:** Core pages (home, dynasties index, corruption tracker, weekly reviews) are running as Next.js components. Visualization pages (network map, timeline, interactive charts) are still HTML-based and served as static assets via the `[...slug]` route while they are being ported.

---

## What's Here

- **Weekly News Digests** — Significant events organized by category
- **Interactive Network Map** — Dynasty relationships and geographic control
- **Timeline** — Chronological view of major events with dynasty connections
- **Datasets** — 50+ dynasties, 450+ members, 71 provinces tracked

## Quick Start

```bash
git clone https://github.com/dat-angel/openpinas.git
cd openpinas
npm install
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) in your browser.

## Files

**App (Next.js):**
- `app/` — Next.js app directory (layouts, pages, components)
- `app/globals.css` — Design tokens and global styles
- `app/layout.js` — Root layout with sticky nav
- `app/page.js` — Homepage
- `app/native/` — Page components (home, dynasties, corruption tracker, weekly reviews)

**Data:**
- `philippine-political-dynasties-network-2025.json` — Dynasty data, relationships, geographic control
- `philippines-2025-timeline.json` — Timeline of major events
- `philippines-2026-timeline.json` — Timeline of major events (2026)
- `business-connections-2025.json` — Business-political connections

**Visualizations (HTML, being ported):**
- `dynasties-network-visualization.html` — Interactive network and map
- `interactive-timeline/` — Timeline visualization
- `weekly-reviews/` — Weekly review template and archive

**Documentation:**
- `CONTEXT.md` — Data rules and agent workflow
- `Skills/` — Canonical agent skills (`ph-news-refresher`, `ph-weekly-review`)
- `API.md` — JSON structures and fetch examples
- `DEPLOYMENT.md` — Vercel + GitHub Pages
- `AUTOMATION.md` — News pipeline

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
- Click any dynasty for detailed info

**Timeline Visualization:**
- Chronological view of major 2025–2026 events
- Filter by category (Political, Cultural, Natural Disasters, etc.)
- Each event shows involved dynasties with links to network map

**Weekly Reviews:**
- Summaries of significant weekly events
- Statistics dashboard and dynasty highlights
- Links to full timeline and dynasty profiles

## Why This Matters

Political dynasties have been a defining feature of Philippine politics since independence. Despite a constitutional mandate against political dynasties, no Anti-Political Dynasty Law has been passed in over 35 years.

Understanding these power structures helps:
- Make sense of political news and events
- See connections between corruption scandals and political families
- Track which regions have stable leadership vs. ongoing crises
- Understand how business and political power intersect

## Related Work

- Sources and related projects: [openpinas.dev/sources-and-related-projects.html](https://openpinas.dev/sources-and-related-projects.html)
- Ateneo Policy Center Political Dynasties Dataset: https://www.inclusivedemocracy.ph/data-and-infographics
- PCIJ Political Dynasties Database: https://pcij.org/political-dynasties/
- BetterGov Dynasty Tracker: https://dynasty-tracker.bettergov.ph

## Data Structure

The timeline and dynasty datasets are **complementary but standalone**:

- **Timeline → Dynasties**: Each event includes a `mentioned_dynasties` array
- **Dynasties → Timeline**: Each dynasty includes a `timeline_events` array
- Both JSON files work independently

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

For major changes, open an issue first.

## License

- **Code** (JavaScript/React/CSS): [MIT License](LICENSE)
- **Data** (JSON files): [CC BY 4.0](LICENSE-DATA)

Use the code however you want. Use the data too, just give attribution.

## Contact

- **Website**: [beatriz.page](https://beatriz.page)
- **GitHub**: [@dat-angel](https://github.com/dat-angel)

---

If you find this useful, please star it on GitHub or share it with others.
