# Weekly Philippine News Reviews

This directory contains weekly review pages that summarize significant Philippine events for each week of 2026.

## Files

- **`weekly-review-template.html`** - Template file for generating new weekly reviews
- **`index.html`** - Archive listing of all weekly reviews
- **`weekly-review-YYYY-MM-DD.html`** - Individual weekly review pages (generated from template)

## How to Generate a Weekly Review

### Option 1: Using the AI Skill (Recommended)

1. Run the `ph-weekly-review` skill with the week date range
2. The skill will generate the HTML file automatically
3. Save it as `weekly-review-YYYY-MM-DD.html` (use the end date of the week)

### Option 2: Manual Generation

1. Copy `weekly-review-template.html` to `weekly-review-YYYY-MM-DD.html`
2. Update the `WEEK_CONFIG` object in the JavaScript section:
   ```javascript
   const WEEK_CONFIG = {
     startDate: "2026-01-05",  // Start of week (Monday)
     endDate: "2026-01-11",    // End of week (Sunday)
     timelineFile: "../philippines-2026-timeline.json",
     weekLabel: "January 5-11, 2026"
   };
   ```
3. Save the file
4. The page will automatically load and display events from the timeline JSON

## Features

- **Statistics Dashboard**: Shows total events, political events, disasters, and dynasty mentions
- **Categorized Events**: Events organized by category (Political, Natural Disasters, Cultural, etc.)
- **Dynasty Highlights**: Special section highlighting dynasty-related news
- **Links to Visualizations**:
  - Each event links to the full timeline
  - Dynasty mentions link to the network map
  - Navigation to all project pages
- **Responsive Design**: Works on desktop and mobile devices

## File Naming Convention

- Format: `weekly-review-YYYY-MM-DD.html`
- Use the **end date** of the week (Sunday)
- Example: `weekly-review-2026-01-11.html` for the week ending January 11, 2026

## Integration

The weekly reviews integrate with:
- **Timeline**: `../interactive-timeline/` - Links to specific events
- **Dynasty Map**: `../dynasties-network-visualization.html` - Links to dynasty profiles
- **Timeline JSON**: `../philippines-2026-timeline.json` - Source data

## Updating the Archive

To add a new review to the archive listing (`index.html`), update the `reviews` array in the JavaScript:

```javascript
const reviews = [
  {
    date: "2026-01-11",
    weekRange: "January 5-11, 2026",
    filename: "weekly-review-2026-01-11.html",
    eventCount: 5
  },
  // Add more reviews...
];
```

## Related Skills

- **ph-news-refresher**: Scan news sources and update timeline/dynasty JSON files
- **ph-weekly-review**: Generate weekly review HTML pages (this system)

## Notes

- The template requires the timeline JSON file to exist
- Events are automatically filtered by date range
- All links are relative paths, suitable for local development and GitHub Pages
- The design matches the existing project aesthetic

