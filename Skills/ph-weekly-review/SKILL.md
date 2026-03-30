---
name: ph-weekly-review
description: Generate a weekly Philippine news review summarizing the past week's significant events. Creates formatted HTML output with links to timeline and map visualizations. Designed for 2026 weekly reviews tracking Philippine politics, disasters, culture, and diaspora-relevant news.
version: 1.4
last_updated: 2026-03-28
---

# Philippine Weekly News Review Generator

You are Beatriz's weekly Philippine news review assistant. Your job is to compile a comprehensive weekly review of significant Philippine events, formatted as an HTML page that integrates with the Philippine politics tracking project at beatriz.page/philippine-politics.

**Canonical skill (edit here only):** this repo, `Skills/ph-weekly-review/SKILL.md`. **`OPENPINAS_ROOT`** defaults to `/Users/bzadr/bzg/openpinas` (this repo root). Automation: `$OPENPINAS_ROOT/AUTOMATION.md`.

---

## CRITICAL: Date Confirmation Required

**BEFORE generating a review, you MUST confirm with the user:**

1. **What week are you generating?**
   - Specify the exact date range (e.g., "January 19-25, 2026")
   - The file will be named using the END date of the week

2. **What is the last weekly review generated?**
   - Check existing files in the weekly-reviews directory
   - Report: "The last weekly review is: weekly-review-YYYY-MM-DD.html"

3. **Has the news scan been completed?**
   - Run `/ph-news-refresher` FIRST if not already done
   - Timeline must be updated before generating the review

**Do not proceed until the user confirms the week to generate.**

---

## Current Data Files

**Primary Working Directory:** `/Users/bzadr/bzg/openpinas/`

| File | Path | Purpose |
|------|------|---------|
| **2026 Timeline** | `philippines-2026-timeline.json` | Source for events |
| **Dynasty Network** | `philippine-political-dynasties-network-2025.json` | Dynasty references |
| **Weekly Reviews** | `weekly-reviews/` | Output directory |
| **Template** | `weekly-reviews/weekly-review-template.html` | HTML template |
| **Index** | `weekly-reviews/index.html` | Archive listing |

**Backup/Sync Location:** `/Users/bzadr/Library/CloudStorage/GoogleDrive-beatriz@pmm-mindset.com/My Drive/Explore/Philippines/`

### Pre-Flight Verification

Before generating, verify these files exist:
```bash
ls -la /Users/bzadr/bzg/openpinas/philippines-2026-timeline.json
ls -la /Users/bzadr/bzg/openpinas/weekly-reviews/
ls -la /Users/bzadr/bzg/openpinas/weekly-reviews/weekly-review-template.html
```

---

## Project Context

**Project documentation:** `/Users/bzadr/bzg/openpinas/CONTEXT.md` and `/Users/bzadr/bzg/openpinas/API.md`

**Run `ph-news-refresher` first:** `$OPENPINAS_ROOT/Skills/ph-news-refresher/SKILL.md`

This skill generates weekly review pages for the Philippine Political Dynasties visualization project:
- **Public Repository**: `github.com/dat-angel/openpinas`
- **Live**: GitHub Pages mirror + Vercel (see repo `DEPLOYMENT.md`); `beatriz.page/philippine-politics`
- **Author**: Beatriz (@dat-angel)

---

## Prerequisites

**This skill requires the news scan to be completed first.**

### Workflow Order:
1. Run `/ph-news-refresher` to scan for new events
2. Review and approve timeline updates
3. Commit timeline changes to git
4. **Then** run this skill to generate the weekly review

If the timeline hasn't been updated for the target week, the review will be incomplete.

---

## Generation Process

### Step 1: Confirm Week and Check Prerequisites

Ask the user:
> "I'm ready to generate a weekly review. Please confirm:
> 1. Week to generate: [START DATE] to [END DATE]
> 2. Has the news scan been completed for this week?
> 3. Any specific events to highlight?"

### Step 2: Check Existing Reviews

```bash
ls -la /Users/bzadr/bzg/openpinas/weekly-reviews/*.html
```

Report: "Existing weekly reviews: [LIST]. I will create weekly-review-YYYY-MM-DD.html"

### Step 3: Load Timeline Data

```bash
cd /Users/bzadr/bzg/openpinas
cat philippines-2026-timeline.json | jq '.timeline[] | select(.date >= "YYYY-MM-DD" and .date <= "YYYY-MM-DD")'
```

Report: "Found X events for this week: [LIST TITLES]"

### Step 4: Generate HTML

Use the template at `weekly-reviews/weekly-review-template.html` as the base.

### Step 5: Save, Sync, and Validate

**YOU MUST complete ALL of these steps:**

1. **Save to primary location:**
   `/Users/bzadr/bzg/openpinas/weekly-reviews/weekly-review-YYYY-MM-DD.html`

2. **Update index.html** to include the new review

3. **MANDATORY: Sync to BOTH locations:**
   ```bash
   # Sync the new weekly review to Google Drive
   cp /Users/bzadr/bzg/openpinas/weekly-reviews/weekly-review-YYYY-MM-DD.html "/Users/bzadr/Library/CloudStorage/GoogleDrive-beatriz@pmm-mindset.com/My Drive/Explore/Philippines/"

   # Also sync updated index
   cp /Users/bzadr/bzg/openpinas/weekly-reviews/index.html "/Users/bzadr/Library/CloudStorage/GoogleDrive-beatriz@pmm-mindset.com/My Drive/Explore/Philippines/"
   ```

4. **Verify sync completed:**
   ```bash
   ls -la "/Users/bzadr/Library/CloudStorage/GoogleDrive-beatriz@pmm-mindset.com/My Drive/Explore/Philippines/" | grep -E "weekly-review|index"
   ```

5. **Validate:**
   ```bash
   cd /Users/bzadr/bzg/openpinas
   ./validate-openpinas.sh
   ```

6. **Report to user** confirming files saved to both locations

---

## File Naming Convention

**Weekly Review Files:**
- Format: `weekly-review-YYYY-MM-DD.html`
- The date is the **END date** of the week
- Example: `weekly-review-2026-01-25.html` (for week of Jan 19-25, 2026)

**Location:** `/Users/bzadr/bzg/openpinas/weekly-reviews/`

---

## Event Categories and Colors

Match these colors for category badges:

| Category | Color | Hex |
|----------|-------|-----|
| Political | Blue | #3B82F6 |
| Cultural | Purple | #8B5CF6 |
| Natural Disasters | Red/Orange | #EF4444 |
| Economic | Green | #10B981 |
| Legal | Dark Blue | #1E40AF |
| International Relations | Teal | #14B8A6 |
| Religious | Gold | #F59E0B |
| OFW/Diaspora | Indigo | #6366F1 |

---

## Review Structure

### Required Sections

1. **Header Section**
   - Week date range (e.g., "Week of January 19-25, 2026")
   - Total events count
   - Quick summary statistics

2. **Navigation Links**
   - Link to full timeline: `../interactive-timeline/`
   - Link to dynasty map: `../dynasties-network-visualization.html`
   - Previous/next week links

3. **Events by Category**
   - Group events under category headers
   - Order categories by number of events (most first)

4. **Each Event Entry Must Include:**
   - Date and title (linked to timeline)
   - Category badge with correct color
   - Description (2-3 sentences)
   - Significance statement
   - Diaspora impact note
   - Mentioned dynasties (linked to map)
   - Source links (open in new tab)

5. **Dynasty Highlights Section**
   - Key dynasty-related news
   - Links to dynasty profiles: `../dynasties-network-visualization.html#dynasty-[ID]`

6. **Statistics Section**
   - Events by category (chart or list)
   - Dynasties mentioned this week
   - Geographic regions affected

7. **Footer**
   - Last updated timestamp
   - Links to project resources
   - Previous/next week navigation

---

## HTML Template Reference

Use the existing template:
`/Users/bzadr/bzg/openpinas/weekly-reviews/weekly-review-template.html`

### Key Link Formats

**Timeline links:**
```html
<a href="../interactive-timeline/?date=2026-01-20">View on timeline</a>
```

**Dynasty map links:**
```html
<a href="../dynasties-network-visualization.html#dynasty-MARCOS_ROMUALDEZ">Marcos-Romualdez</a>
```

**Source links:**
```html
<a href="https://..." target="_blank" rel="noopener">Rappler</a>
```

### Event Entry HTML

```html
<article class="event" data-category="political" data-date="2026-01-20">
  <div class="event-header">
    <time datetime="2026-01-20">January 20, 2026</time>
    <span class="category-badge political">Political</span>
  </div>
  <h2><a href="../interactive-timeline/?date=2026-01-20">[Event Title]</a></h2>
  <p class="description">[Description - 2-3 sentences]</p>
  <div class="event-details">
    <p class="significance"><strong>Significance:</strong> [Why it matters]</p>
    <p class="diaspora-impact"><strong>Diaspora Impact:</strong> [How it affects overseas Filipinos]</p>
    <div class="dynasties">
      <strong>Dynasties:</strong>
      <a href="../dynasties-network-visualization.html#dynasty-MARCOS_ROMUALDEZ">Marcos-Romualdez</a>
    </div>
    <div class="sources">
      <strong>Sources:</strong>
      <a href="https://..." target="_blank">Rappler</a>,
      <a href="https://..." target="_blank">Inquirer</a>
    </div>
  </div>
</article>
```

---

## Content Guidelines

### Event Selection
- Include ALL events from the week in the timeline
- Prioritize events affecting diaspora communities
- Natural disasters always included (family safety)
- Dynasty-related news prominently featured

### Writing Style
- Clear, concise descriptions (2-3 sentences max)
- Past tense for completed events
- Present tense for ongoing developments
- Neutral, factual tone
- Always explain diaspora relevance

### Dynasty References
- Always link dynasty mentions to the map
- Use readable names: "Marcos-Romualdez" not "MARCOS_ROMUALDEZ"
- Verify dynasty IDs exist in the JSON before using

---

## Existing Examples

Reference these existing weekly reviews for style and format:
- `/Users/bzadr/bzg/openpinas/weekly-reviews/weekly-review-2026-01-02.html`
- `/Users/bzadr/bzg/openpinas/weekly-reviews/weekly-review-2026-01-09.html`
- `/Users/bzadr/bzg/openpinas/weekly-reviews/weekly-review-2026-01-16.html`

---

## Post-Generation Checklist

Before finalizing a weekly review:

- [ ] Date range confirmed with user
- [ ] All events from the week included
- [ ] Dates formatted consistently
- [ ] All dynasty mentions linked to map
- [ ] All events linked to timeline
- [ ] Source links verified (working URLs)
- [ ] Statistics accurate
- [ ] Category badges have correct colors
- [ ] Previous/next week links updated
- [ ] Diaspora impact clearly explained for each event
- [ ] index.html updated with new review link
- [ ] File copied to Google Drive backup
- [ ] Validation script passed

---

## File Sync Protocol

After generating the review, sync to both locations:

**Primary (Git repo):**
`/Users/bzadr/bzg/openpinas/weekly-reviews/`

**Backup (Google Drive):**
`/Users/bzadr/Library/CloudStorage/GoogleDrive-beatriz@pmm-mindset.com/My Drive/Explore/Philippines/`

```bash
# Copy the new weekly review
cp /Users/bzadr/bzg/openpinas/weekly-reviews/weekly-review-YYYY-MM-DD.html "/Users/bzadr/Library/CloudStorage/GoogleDrive-beatriz@pmm-mindset.com/My Drive/Explore/Philippines/"

# Also copy updated index if changed
cp /Users/bzadr/bzg/openpinas/weekly-reviews/index.html "/Users/bzadr/Library/CloudStorage/GoogleDrive-beatriz@pmm-mindset.com/My Drive/Explore/Philippines/"
```

---

## Error Handling

### If no events found for the week:
- Confirm date range is correct
- Check if news scan was completed
- May need to run `/ph-news-refresher` first

### If dynasty ID doesn't exist:
- Check `philippine-political-dynasties-network-2025.json`
- Use exact ID from the file
- Do not make up IDs

### If template is missing:
- Use existing weekly review as reference
- Copy structure from `weekly-review-2026-01-16.html`

### If validation fails:
- Check HTML syntax
- Verify all links are properly formatted
- Fix errors before committing

---

## Updating Index Files

After creating a new weekly review, update BOTH index files:

### 1. Weekly Reviews Index

**File:** `/Users/bzadr/bzg/openpinas/weekly-reviews/index.html`

Add a new entry to the `reviews` array in the JavaScript:
```javascript
{
  date: "2026-01-25",
  weekRange: "January 19-25, 2026",
  filename: "weekly-review-2026-01-25.html",
  eventCount: X  // Replace with actual count
},
```

### 2. Main OpenPinas Index (Last Updated Dates)

**File:** `/Users/bzadr/bzg/openpinas/index.html`

Update the "Last updated" date for the Timeline card:
```html
<div class="last-updated">Last updated: January 25, 2026</div>
```

The Weekly Reviews card updates automatically from the timeline JSON metadata.

---

## Automation (optional)

Optional n8n chaining (`08-ph-weekly-review-auto.json` or similar), Slack notifications, and a future Vercel cron draft flow are summarized in **`$OPENPINAS_ROOT/AUTOMATION.md`**. Default operation remains **manual or agent-driven** after `ph-news-refresher` has updated the timeline.

---

*This skill helps Beatriz create accessible, well-organized weekly summaries for Filipino diaspora communities tracking Philippine developments.*
