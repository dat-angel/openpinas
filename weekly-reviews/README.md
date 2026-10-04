# Weekly Philippine News Reviews

Canonical format as of April 2026. JSON-first, compact editorial voice.

- Canonical content: `weekly-reviews/data/YYYY-MM-DD.json`
- Canonical archive: `weekly-reviews/data/manifest.json`
- Public route: `/weekly-reviews/weekly-review-YYYY-MM-DD.html` (React-rendered from JSON)
- Legacy HTML files in this directory: compatibility only, not updated

---

## Editorial Standard (April 2026 onward)

### Story count
**5–8 articles total per review.** Not one article per timeline event — one article per *story*. Related events are grouped.

### Grouping rule
If two or more events share an underlying theme, they become one article with multiple source links. Ask: *is this a new story, or more detail on a story already in this review?* If the latter, add sources to the existing article.

Example: fuel prices + peso weakness + DSWD transport relief + toll discounts = one article (*Cost-of-living pressure on transport workers*), four source links.

### Article structure
| Field | Rule |
|---|---|
| `headline` | Frame the week's *development*, not just the event. What shifted? |
| `descriptionHtml` | 2–4 sentences. Key facts + significance in the final sentence. |
| `diasporaImpact` | Optional. One sentence. Omit if it restates the description. |
| `sourceLinks[]` | All articles drawn from for this grouped story. Often 3–6 links. |
| `dynastyLinks[]` | Optional. |
| `significance` | **Do not use.** Fold into `descriptionHtml`. |

---

## How To Generate A Weekly Review

### Step 1: Run ph-news-refresher (if not already done)
Updates `philippines-2026-timeline.json` with the week's events.

### Step 2: Run ph-weekly-review skill
```
/ph-weekly-review
```
Confirm week start/end date when prompted. The skill outputs:
- `weekly-reviews/data/YYYY-MM-DD.json`
- `weekly-reviews/data/manifest.json` (updated)

### Step 3: Validate
```bash
npm run validate
# For a restored range of Saturday editions:
node scripts/validate-weekly-coverage.mjs 2026-06-27 2026-09-05
```

---

## File Naming

- Week key: `YYYY-MM-DD` (week **ending** date, Saturday)
- JSON: `weekly-reviews/data/YYYY-MM-DD.json`
- Public route: `/weekly-reviews/weekly-review-YYYY-MM-DD.html`

## 2026 Schedule

Weekly, non-overlapping Sunday–Saturday windows. Source data from `philippines-2026-timeline.json`, verified against dated reporting and original releases. `lastUpdated` is the actual preparation date, including for historical backfills.

Link each regular edition to the nearest available earlier regular edition; repair those links when filling gaps. Keep special editions in the archive without inserting them into the regular weekly chain. Update `content/now-developing.json` only when adding a newer completed edition, so historical backfills do not move the homepage backward. Coverage runs through the October 3, 2026 edition. The October 4–10 edition is due after October 10 closes.

## Related Skills

- `ph-news-refresher` — scans news, updates timeline and dynasty source data
- `ph-weekly-review` — generates weekly JSON + manifest from timeline data

## Integration

- Timeline: `/interactive-timeline/index.html`
- Dynasty map: `/dynasties-network-visualization.html`
- Source data: `philippines-2026-timeline.json`
