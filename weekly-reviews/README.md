# Weekly Philippine News Reviews

This directory now uses a JSON-first workflow for weekly reviews.

- Canonical content: `weekly-reviews/data/YYYY-MM-DD.json`
- Canonical archive: `weekly-reviews/data/manifest.json`
- Public route: `/weekly-reviews/weekly-review-YYYY-MM-DD.html` (React-rendered from JSON)

## Files

- `data/manifest.json` - Weekly review index used by the app.
- `data/YYYY-MM-DD.json` - Structured weekly review content.
- `weekly-review-YYYY-MM-DD.html` - Legacy compatibility files (non-canonical).

## How To Generate A Weekly Review

### Option 1: Using The AI Skill (Recommended)

1. Run the `ph-weekly-review` skill with the week date range.
2. Generate/update:
   - `weekly-reviews/data/YYYY-MM-DD.json`
   - `weekly-reviews/data/manifest.json`
3. Validate:
   - `npm run validate`

### Option 2: Import Existing Legacy HTML

If you need to migrate old HTML files into canonical JSON:

```bash
npm run import:weekly-json
```

## File Naming Convention

- Week key format: `YYYY-MM-DD` (week ending date).
- JSON file: `weekly-reviews/data/YYYY-MM-DD.json`.
- Public route: `/weekly-reviews/weekly-review-YYYY-MM-DD.html`.

## Integration

- Timeline route: `/interactive-timeline/index.html`
- Dynasty map route: `/dynasties-network-visualization.html`
- Timeline source data: `philippines-2026-timeline.json`

## Updating The Archive

Update `weekly-reviews/data/manifest.json` in descending date order.

Each review entry should include:
- `weekEnding`
- `weekLabel`
- `eventCount`
- `prevWeekEnding`

## Related Skills

- `ph-news-refresher`: updates timeline/dynasty source data.
- `ph-weekly-review`: creates weekly JSON + manifest entries.

## Notes

- JSON is canonical; legacy HTML is compatibility-only.
- Validation is Node-based: `npm run validate`.

