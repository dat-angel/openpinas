# Monthly Philippine News Reviews

This directory contains monthly review pages that aggregate weekly reviews into comprehensive monthly summaries for visualizing in the interactive timeline.

## Files

- **`monthly-review-template.html`** - Template file for generating new monthly reviews
- **`index.html`** - Archive listing of all monthly reviews
- **`monthly-review-YYYY-MM.html`** - Individual monthly review pages
- **`MONTHLY_REVIEW_SKILL_GUIDE.md`** - Detailed guide for creating monthly reviews

## How to Generate a Monthly Review

### Option 1: Using the AI Skill (Recommended)

1. Run the `ph-monthly-review` skill with the month and year
2. The skill will aggregate weekly reviews and generate the HTML file
3. Save it as `monthly-review-YYYY-MM.html`

### Option 2: Manual Generation

1. Copy `monthly-review-template.html` to `monthly-review-YYYY-MM.html`
2. Update the `MONTH_CONFIG` object in the JavaScript section:
   ```javascript
   const MONTH_CONFIG = {
     month: 1,  // January = 1, February = 2, etc.
     year: 2026,
     monthName: "January",
     timelineFile: "../philippines-2026-timeline.json",
     weeklyReviews: [
       { file: "../weekly-reviews/weekly-review-2026-01-02.html", range: "Dec 27 - Jan 2", events: 7 },
       // ... add all weekly reviews for the month
     ]
   };
   ```
3. Update the month overview text
4. Update economic indicators manually
5. Save the file

## Features

- **Statistics Dashboard**: Total events, political events, disasters, economic, dynasties mentioned
- **Month Overview**: Comprehensive summary of the month's key developments
- **Top Stories**: Highlights of the most significant events
- **Category Breakdown**: Events organized by type
- **Dynasty Activity**: Which dynasties were most active/mentioned
- **Economic Indicators**: PHP:USD exchange rate range for the month
- **Weekly Reviews Links**: Direct links to detailed weekly coverage

## File Naming Convention

- Format: `monthly-review-YYYY-MM.html`
- Use the year and two-digit month
- Examples:
  - `monthly-review-2026-01.html` (January 2026)
  - `monthly-review-2026-02.html` (February 2026)

## Integration

Monthly reviews integrate with:
- **Timeline**: `../interactive-timeline/` - Links to specific events
- **Dynasty Map**: `../dynasties-network-visualization.html` - Links to dynasty profiles
- **Weekly Reviews**: `../weekly-reviews/` - Detailed weekly coverage
- **Timeline JSON**: `../philippines-2026-timeline.json` - Source data

## Updating the Archive

To add a new review to `index.html`, update the `reviews` array:

```javascript
const reviews = [
  {
    date: "2026-01",
    monthName: "January 2026",
    filename: "monthly-review-2026-01.html",
    eventCount: 23,
    weeklyReviews: 3,
    highlights: "Budget signing, ASEAN chairmanship, Mayon alert"
  },
  // Add more reviews...
];
```

## Related Skills

- **ph-news-refresher**: Scan news sources and update timeline/dynasty JSON files
- **ph-weekly-review**: Generate weekly review HTML pages
- **ph-monthly-review**: Generate monthly review HTML pages (this system)

## Notes

- Monthly reviews aggregate data from weekly reviews and the timeline JSON
- Each month should have all its weekly reviews created before generating the monthly review
- The overview section should be written manually to provide context and analysis
- Economic indicators should be updated manually with month-end data
