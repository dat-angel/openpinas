# Philippine Corruption & POGO Case Tracker

A comprehensive tracker for corruption cases and POGO-related crimes in the Philippines, with a focus on transparency and accountability.

## Project Status

**Status**: MVP Complete ✅

This is the initial MVP (Minimum Viable Product) for the Corruption Case Tracker, built as part of Priority 2 from the OpenPinas project roadmap.

## Features

### Current (MVP)
- ✅ **Landing Page** - Overview with statistics dashboard
- ✅ **Case List** - Browse all cases with filtering and search
  - Filter by category, status, year
  - Search by case title, accused, charges, location
  - Statistics dashboard
- ✅ **Case Detail Pages** - Detailed case information
  - Timeline visualization
  - Accused parties
  - POGO connections
  - Charges and political connections
  - Sources and links
- ✅ **Alice Guo Case** - Complete detail page for high-profile case

### Data
- 3 cases currently tracked (including Alice Guo)
- POGO operations data
- Statistics and analytics

## Project Structure

```
corruption-tracker/
├── index.html              # Landing page
├── cases/
│   ├── index.html          # Case list page
│   └── alice-guo.html       # Alice Guo case detail
├── data/
│   └── pogo-corruption-cases-2025.json
├── js/
│   ├── stats.js            # Statistics for landing page
│   ├── cases.js            # Case list functionality
│   ├── case-detail.js      # Case detail page functionality
│   └── timeline.js         # Timeline component
├── css/
│   └── styles.css          # Main stylesheet
└── README.md
```

## Getting Started

### Local Development

1. Navigate to the project directory:
   ```bash
   cd "My Drive/Explore/Philippines/corruption-tracker"
   ```

2. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```

3. Open in browser:
   ```
   http://localhost:8000
   ```

### Viewing the Site

- **Landing Page**: `index.html`
- **Case List**: `cases/index.html`
- **Alice Guo Case**: `cases/alice-guo.html`

## Design System

Reuses the design system from OpenPinas:
- Color scheme: Ink, muted, paper, accent colors
- Typography: Spectral (serif) for headings, IBM Plex Sans for UI
- Components: Cards, stats, sections, timeline

## Data Format

Cases are stored in JSON format with the following structure:
- Case metadata (ID, title, category, status)
- Accused parties
- POGO connections
- Timeline events
- Charges
- Political connections
- Sources

See `data/pogo-corruption-cases-2025.json` for the complete schema.

## Next Steps

### Phase 2 Enhancements (Planned)
- [ ] Add 10-20 more POGO cases
- [ ] Add general corruption cases (PDAF scam, etc.)
- [ ] Network visualization (cases, accused, dynasties)
- [ ] Map visualization (case locations)
- [ ] Dynasty connections (link to OpenPinas)
- [ ] Related cases linking

### Phase 3 Integration
- [ ] Full integration with OpenPinas
- [ ] Cross-project navigation
- [ ] Unified search across projects

## Related Projects

- **OpenPinas**: [../Openpinas/](../Openpinas/) - Political dynasties tracking
- **GitHub**: [https://github.com/dat-angel/openpinas](https://github.com/dat-angel/openpinas)

## License

See LICENSE file in parent directory.

## Notes

- This is a private development project
- Data is sourced from news articles, government reports, and investigations
- Cases are tracked for transparency and accountability purposes
- Designed for Filipino diaspora communities and transparency advocates

