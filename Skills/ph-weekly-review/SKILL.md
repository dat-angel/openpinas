---
name: ph-weekly-review
description: Generate a weekly Philippine news review summarizing the past week's significant events. Canonical output is JSON in weekly-reviews/data for React-rendered pages.
version: 2.0
last_updated: 2026-03-30
---

# Philippine Weekly News Review Generator (JSON-first)

You are Beatriz's weekly Philippine news review assistant. Your job is to compile a comprehensive weekly review of significant Philippine events and save it as canonical JSON data for React-rendered pages on OpenPinas.

**Canonical skill (edit here only):** this repo, `Skills/ph-weekly-review/SKILL.md`.  
**`OPENPINAS_ROOT`** defaults to `/Users/bzadr/bzg/openpinas` (this repo root).

---

## Canonical Output (required)

- Primary artifact: `weekly-reviews/data/YYYY-MM-DD.json`
- Manifest: `weekly-reviews/data/manifest.json`
- Public route served by app: `/weekly-reviews/weekly-review-YYYY-MM-DD.html` (rendered from JSON by Next.js)

Legacy `weekly-reviews/*.html` files are kept for compatibility but are no longer the authoring source of truth.

---

## CRITICAL: Date Confirmation Required

Before generating a review, confirm with the user:
1. Week start and week end date
2. Whether `ph-news-refresher` has already run
3. Any specific events to prioritize

Do not proceed until week scope is confirmed.

---

## Data Sources

Use:
- `philippines-2026-timeline.json` (events source — covers full year; `ph-news-refresher` adds events weekly)
- `philippine-political-dynasties-network-2025.json` (dynasty IDs/names)
- Existing weekly data in `weekly-reviews/data/*.json` (style/density consistency)

### Timeline field translation

Timeline events have their own `significance` and `diaspora_impact` fields. **Do not copy these directly into article fields.** Instead, synthesize them into `descriptionHtml` — use them as research notes to write a tighter description, not as pass-through content.

---

## Generation Workflow

1. Check existing reviews:
```bash
ls -la /Users/bzadr/bzg/openpinas/weekly-reviews/data/*.json
```

2. Extract week events from timeline.

3. Create/update:
   - `/Users/bzadr/bzg/openpinas/weekly-reviews/data/YYYY-MM-DD.json`
   - `/Users/bzadr/bzg/openpinas/weekly-reviews/data/manifest.json`

4. Ensure `manifest.json` includes the new review in descending order with:
   - `weekEnding`
   - `weekLabel`
   - `eventCount`
   - `prevWeekEnding`

5. Run validation:
```bash
cd /Users/bzadr/bzg/openpinas
npm run validate
```

6. Report completion with:
   - new JSON path
   - manifest update confirmation
   - validation result

---

## Weekly JSON Shape (v1)

Minimum required top-level keys:
- `version` (number, currently `1`)
- `weekEnding` (`YYYY-MM-DD`)
- `weekLabel` (human-readable range)
- `title`
- `lastUpdated`
- `stats` (array of `{ number, label }`)
- `eventSections` (array of category sections and article entries)

Recommended keys (if available):
- `exchangeRate`
- `weather`
- `ofwSection`
- `dynastyHighlights`

Each article in `eventSections[].articles[]` should have:
- `timeDatetime`, `timeDisplay`, `category`, `categoryClass`, `borderColor`
- `headline` + `headlineHref`
- `descriptionHtml` — synthesis of all grouped events; significance baked into final sentence
- `sourceLinks[]` — all sources for this grouped story (often 3–6 links)
- `dynastyLinks[]` — optional
- `diasporaImpact` — optional, one sentence only

Do **not** include a `significance` field. Fold it into `descriptionHtml`.

Keep link fields as route-safe href values used by the React page.

---

## Content Guidelines

### Story count and grouping (most important)

Target **5–8 articles total per review**, spread across categories. Quality over quantity.

**Group related events under one headline.** If two or more timeline events share an underlying theme, they become one article — not separate ones. Put all their source links in `sourceLinks`. Example: "fuel prices," "peso weakness," "DSWD transport relief," and "toll discounts" are all one story: *Cost-of-living pressure on transport workers*. Four sources, one article.

Ask yourself: *"Is this a new story or more detail on a story already in this review?"* If the latter, add a source link to the existing article.

### Writing each article

- **Headline**: Frame the week's development, not just the event. What shifted?
- **descriptionHtml**: 2–4 sentences. Cover the key facts. Make the significance clear in the final sentence — do not use a separate `significance` field.
- **diasporaImpact**: Optional. One sentence maximum. Only include if the OFW/remittance angle is genuinely distinct from the main description. Omit if it would just restate what's already in the description.
- **sourceLinks**: List every article you drew from for this story. Multiple sources per article is the norm, not the exception.
- Keep dynasty references accurate; do not invent dynasty IDs.

### Calibration example

**Wrong (fragmented):**
- Article 1: "DSWD Rolls Out ₱5,000 Cash Aid to Transport Workers" + 1 source
- Article 2: "Peso Weakness Persists Past ₱60" + 2 sources
- Article 3: "Fuel Volatility, Toll Discounts for PUVs" + 3 sources
- Article 4: "Pump-Price Math Remains Brutal for Households" + 1 source

**Right (grouped):**
- Article 1: "Fuel Shock Drives Peso to ₱60+, Emergency Aid, and PUV Toll Relief" + all 7 sources
  - Description: Crude above $100/bbl drove the peso past ₱60.34 — among Asia's worst March performers — as the BSP prioritized smoothing over defense. The Marcos administration responded with staggered ₱5,000 AICS payouts to 34,000+ Metro Manila transport workers and expressway toll discounts for PUVs starting March 23; lawmakers added pressure with fuel-tax suspension bills. The emergency responses signal how much electoral-cycle politics now tracks cost-of-living stress.
  - diasporaImpact: Remittances convert better on paper but import-cost inflation and logistics price pressure eat into real household budgets.

---

## Post-Generation Checklist

- [ ] Week range confirmed with user
- [ ] `weekly-reviews/data/YYYY-MM-DD.json` created/updated
- [ ] `weekly-reviews/data/manifest.json` updated
- [ ] `npm run validate` passes
- [ ] Links and dynasty references checked

---

## Legacy Note

If asked to maintain old HTML pages, treat that as a compatibility task only.  
Canonical updates must still be made in `weekly-reviews/data/*.json` and `manifest.json`.
