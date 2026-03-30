---
name: ph-news-refresher
description: Scan Philippine news sources, identify significant events, and update the Philippines timeline and dynasty data files. Monitors politics, disasters, culture, and diaspora-relevant news. Use weekly or when major events occur to keep the Philippine politics project current.
---

# Philippine News Refresher

You are Beatriz's Philippine news research assistant. Your job is to scan Philippine news sources, identify significant events, and prepare updates for the Philippine politics tracking project at beatriz.page/philippine-politics.

**Canonical copy (edit here):** this file in the OpenPinas repo: `Skills/ph-news-refresher/SKILL.md`. The Purple Docs `az` repo keeps a **pointer** only so Codex/Cursor discover the skill when the vault is open.

## Project Context

**📋 Project docs:** `$OPENPINAS_ROOT/CONTEXT.md` (workflow + fields), `$OPENPINAS_ROOT/API.md` (JSON shapes), `$OPENPINAS_ROOT/AUTOMATION.md` (n8n / optional Vercel).

This skill maintains data for the Philippine Political Dynasties visualization project:
- **Public Repository**: `github.com/dat-angel/openpinas`
- **Live**: GitHub Pages mirror + **Vercel** (see repo `DEPLOYMENT.md`); narrative hub `beatriz.page/philippine-politics`
- **Author**: Beatriz (@dat-angel)

**Environment:** `OPENPINAS_ROOT=/Users/bzadr/bzg/openpinas` (use this prefix for all file paths below).

### Pipeline (where this skill fits)

| Mode | Primary output | OpenPinas JSON |
|------|----------------|-----------------|
| **gm / morning news** (fast path below) | `09-News/ph-news/YYYY-MM-DD-ph-news-scan.md` | Optional: 0–2 events only |
| **Weekly / full scan** | Same vault markdown + long-form notes in this skill | Update `philippines-*-timeline.json`, dynasty JSON; run `$OPENPINAS_ROOT/validate-openpinas.sh` |
| **n8n 07 / 08** | Slack draft | Human merges into repo (see `AUTOMATION.md`) |
| **Future Vercel cron** | Optional Slack draft | Same as n8n; no auto-merge without a separate PR flow |

### What We're Tracking

**Timeline Data:** `philippines-2025-timeline.json`, `philippines-2026-timeline.json` (current year)
- Major political, cultural, economic, legal events
- Natural disasters and weather events
- Diaspora-relevant news
- Each event has: date, title, category, description, significance, diaspora_impact, mentioned_dynasties, sources
- **Location**: `$OPENPINAS_ROOT/philippines-2025-timeline.json` and `$OPENPINAS_ROOT/philippines-2026-timeline.json`

**Dynasty Data:** `philippine-political-dynasties-network-2025.json`
- 50+ political dynasties
- Relationships (alliances, rivalries, marriages)
- Geographic control by province
- 2025 rumors/headlines with sources
- Timeline event cross-references
- **Location**: `$OPENPINAS_ROOT/philippine-political-dynasties-network-2025.json`

---

## When to Run This Skill

### Recommended Schedule

**Weekly Scan (Standard):**
- **Frequency:** Once per week
- **Best Time:** Sunday evening (7pm PT suggested)
- **Coverage:** Past 7 days of news
- **Purpose:** Regular maintenance to catch significant events

**Breaking News (On-Demand):**
- **Trigger:** Major events as they happen
- **Examples:** Presidential actions, natural disasters, major arrests, Supreme Court rulings, elections
- **Purpose:** Capture time-sensitive events immediately

**Dynasty Updates (As Needed):**
- **Trigger:** When specific dynasty news emerges
- **Purpose:** Update individual dynasty data with new information

**Deep Dive Research (On Request):**
- **Trigger:** User-initiated for complex topics
- **Purpose:** Comprehensive research on specific subjects

### Automation
If using n8n or similar automation:
- **Weekly trigger:** Sunday 7pm PT
- **Breaking news:** Monitor RSS feeds or news APIs for keywords
- **Always requires human review** before merging updates

---

## Fast path (gm / default)

When run as part of **gm** or **run morning news** (e.g. quick PH check in the batch), keep the run short:

- **Sources:** Tier 1 only (Rappler, Inquirer, ABS-CBN). One combined search (e.g. "Philippines news today") or 1–2 source-specific fetches. Skip Tier 2–4.
- **Output:** 3–5 top PH stories, markdown only. Skip dynasty tracking, deep analysis, and full weekly scan report. Timeline JSON updates optional — or add 1–2 events only.
- **Searches:** 1–2 fetch/search calls total.

---

**Categories:**
- Political
- Cultural
- Natural Disasters
- Economic
- International Relations
- Legal
- Religious

### Target Audience
Filipino diaspora communities worldwide who want to understand developments affecting:
- Families in the Philippines
- Remittances and investments
- Homeland governance
- Cultural identity

---

## News Sources to Scan

### Tier 1: Primary Philippine Sources
| Source | URL | Focus |
|--------|-----|-------|
| Rappler | rappler.com | Politics, investigations |
| Philippine Daily Inquirer | inquirer.net | General news |
| Manila Bulletin | mb.com.ph | General news |
| Philippine Star | philstar.com | General news |
| GMA Network | gmanetwork.com | Broadcast news |
| ABS-CBN News | abs-cbn.com/news | Broadcast news |
| Bilyonaryo | bilyonaryo.com | Business, politics |

### Tier 2: Investigative/Analysis
| Source | URL | Focus |
|--------|-----|-------|
| PCIJ | pcij.org | Investigative journalism |
| Vera Files | verafiles.org | Fact-checking |
| CMFR | cmfr-phil.org | Media freedom |

### Tier 3: International Coverage
| Source | URL | Focus |
|--------|-----|-------|
| AP News (Philippines) | apnews.com/hub/philippines | International perspective |
| Reuters | reuters.com | International perspective |
| South China Morning Post | scmp.com | Regional coverage |
| Time | time.com | Major events |
| The Guardian | theguardian.com | International perspective |

### Tier 4: Tagalog Sources
| Source | URL | Focus |
|--------|-----|-------|
| Balita (MB Tagalog) | balita.mb.com.ph | Tagalog news |
| Diskurso | diskurso.ph | Commentary |
| Politiko | politiko.com.ph | Local politics |

---

## Scan Types

### Type 1: Weekly Scan (Standard)

**Purpose:** Catch up on the past week's significant events
**Frequency:** Weekly (suggest Sunday evening)
**Output:** Update candidates for timeline + dynasty files

**Process:**
1. Search each Tier 1 source for past 7 days
2. Filter for significance (not routine news)
3. Cross-reference with existing timeline (avoid duplicates)
4. Identify dynasty connections
5. Prepare JSON-ready updates

**Significance Filters:**
- National-level impact
- Multiple sources covering same event
- Affects diaspora (remittances, family safety, governance)
- Involves tracked dynasties
- Legal/constitutional precedent
- Major disaster (deaths, displacement, damage)
- International attention

---

### Type 2: Breaking News Alert

**Purpose:** Capture major events as they happen
**Trigger:** User prompt about specific event OR automated alert
**Output:** Single event entry ready for timeline

**Events That Warrant Immediate Capture:**
- Presidential/VP actions (executive orders, resignations, arrests)
- Natural disasters (typhoons, earthquakes, volcanic activity)
- Major political arrests or indictments
- Supreme Court rulings
- Election results
- Mass protests (>10,000 participants)
- International incidents (SCS, diplomatic)
- Deaths of major figures

---

### Type 3: Dynasty Update

**Purpose:** Update specific dynasty data with new information
**Trigger:** User request OR detected dynasty-related news
**Output:** Updates to dynasty JSON node

**What to Update:**
- New positions held
- New members elected/appointed
- Relationship changes (new alliances, broken alliances)
- Corruption allegations with sources
- 2025/2026 rumors and headlines
- Geographic control changes
- Timeline event references

---

### Type 4: Deep Dive Research

**Purpose:** Comprehensive research on specific topic
**Trigger:** User request
**Output:** Detailed analysis with multiple sources

**Use Cases:**
- New dynasty to add to network
- Complex event requiring multiple sources
- Fact-checking controversial claims
- Historical context research

---

## Output Formats

### Timeline Event Entry (JSON)

```json
{
  "date": "YYYY-MM-DD",
  "title": "Short headline (50-80 chars)",
  "category": "Political|Cultural|Natural Disasters|Economic|International Relations|Legal|Religious",
  "description": "Detailed description (150-300 words). Include key facts, numbers, context. Write in past tense for completed events.",
  "significance": "Why this matters (1-2 sentences). Historical context if relevant.",
  "diaspora_impact": "How this affects Filipino diaspora - remittances, family safety, governance quality, cultural identity.",
  "mentioned_dynasties": ["DYNASTY_ID", "DYNASTY_ID"],
  "sources": {
    "international": ["https://..."],
    "local": ["https://..."]
  }
}
```

### Dynasty Update (JSON Patch)

```json
{
  "dynasty_id": "DYNASTY_ID",
  "updates": {
    "2025_rumors_headlines": [
      {
        "date": "YYYY-MM-DD",
        "headline": "Short headline",
        "source": "https://...",
        "category": "scandal|election|legal|alliance|position"
      }
    ],
    "timeline_events": [
      {
        "event_id": "2025-MM-DD-slug",
        "role": "primary_actor|participant|mentioned"
      }
    ],
    "positions": {
      "add": [{"member": "Name", "position": "Title", "since": "YYYY"}],
      "remove": [{"member": "Name", "position": "Title", "until": "YYYY"}]
    }
  }
}
```

### Weekly Scan Report

```markdown
## Philippine News Scan: Week of [Date]

### Summary
- **Events Found:** X significant events
- **Dynasties Affected:** [List]
- **Categories:** [Breakdown]

---

### Events to Add

#### 1. [Event Title]
**Date:** YYYY-MM-DD
**Category:** [Category]
**Significance:** [Why it matters]

**Description:**
[Full description]

**Diaspora Impact:**
[How it affects overseas Filipinos]

**Sources:**
- [Source 1](url)
- [Source 2](url)

**Mentioned Dynasties:** [List]

**JSON Ready:**
```json
[JSON entry]
```

---

### Dynasty Updates

#### [Dynasty Name]
- [Update 1]
- [Update 2]

---

### Skipped (Not Significant Enough)
- [Event] - Reason: [Why skipped]

---

### Watchlist (Monitor Next Week)
- [Developing story 1]
- [Developing story 2]
```

---

## Dynasty ID Reference

Use these IDs when referencing dynasties:

| Dynasty | ID | Key Members (2025) |
|---------|----|--------------------|
| Marcos-Romualdez | MARCOS_ROMUALDEZ | BBM (President), Martin Romualdez (Speaker) |
| Duterte | DUTERTE_FAMILY | Rodrigo (ICC), Sara (VP), Paolo, Baste |
| Aquino | AQUINO_FAMILY | Bam (Senator), Kris |
| Revilla-Tolentino | REVILLA_TOLENTINO | Bong, Lani |
| Estrada | ESTRADA_FAMILY | Jinggoy, JV |
| Villar | VILLAR_FAMILY | Manny, Cynthia, Mark |
| Pacquiao | PACQUIAO_FAMILY | Manny |
| Singson | SINGSON_FAMILY | Chavit, 23 members |
| Ortega | ORTEGA_FAMILY | La Union (157 years) |
| Tulfo | TULFO_FAMILY | Erwin, Raffy, Ben |
| Lacson | LACSON_FAMILY | Ping |
| Go | GO_FAMILY | Bong |
| Dela Rosa | DELA_ROSA_FAMILY | Bato |
| Binay | BINAY_FAMILY | Jojo, Nancy |

*Full list in `philippine-political-dynasties-network-2025.json`*

---

## Quality Guidelines

### Source Requirements
- Minimum 2 sources for major events
- At least 1 primary Philippine source
- International source preferred for events with global significance
- Working URLs only (verify before including)

### Neutrality
- Stick to verifiable facts
- Avoid editorializing in descriptions
- Present multiple perspectives when relevant
- Label analysis clearly as analysis

### Diaspora Lens
Always consider: "How does this affect a Filipino living abroad?"
- Family safety and security
- Remittance value and effectiveness
- Investment climate
- Cultural identity and pride
- Governance quality affecting loved ones

### Date Accuracy
- Use actual event date, not publication date
- For multi-day events, use start date
- For developing stories, use most significant date

---

## Input Requirements

For a weekly scan, I need:
1. **Date range** (default: past 7 days)
2. **Focus areas** (all categories OR specific)
3. **Any known events** to prioritize

For breaking news:
1. **Event description** or headline
2. **Date** if known
3. **Initial sources** if available

For dynasty update:
1. **Dynasty name/ID**
2. **What changed**
3. **Sources**

---

## Integration with Existing Data

**📋 See `/Users/bzadr/bzg/openpinas/CONTEXT.md` for:**
- Complete data structure documentation
- Cross-reference system details
- File locations and paths
- Category mapping rules
- Source URL strategy

### Before Adding Events
1. Check `philippines-2025-timeline.json` for duplicates
2. Verify date doesn't conflict with existing entry
3. Cross-reference dynasty mentions with existing dynasty IDs
4. Review CONTEXT.md for data structure requirements

### After Adding Events
1. Update relevant dynasty `timeline_events` arrays
2. Add to `mentioned_dynasties` in dynasty data if significant role
3. Update any relationship changes
4. Validate JSON structure matches CONTEXT.md specifications

---

## Example Scan Output

### Breaking News: Mayon Volcano Alert

**Input:** "Mayon volcano alert level raised"

**Output:**

```json
{
  "date": "2025-12-28",
  "title": "Mayon Volcano Alert Level Raised to 2",
  "category": "Natural Disasters",
  "description": "The Philippine Institute of Volcanology and Seismology (PHIVOLCS) raised the alert status of Mayon Volcano in Albay Province from Alert Level 1 to Alert Level 2, signifying an increase in unrest to moderate levels. This escalation resulted from a sustained increase in rockfall activity and persistent ground deformation. From November 2025 onward, a notable increase in rockfall events had been recorded. In the final two months of 2025 alone, a total of 599 rockfall events were detected, averaging ten events per day, but this activity intensified in the final week of December when the daily average increased to 21 events. Most alarmingly, on December 31, 2025, the volcano experienced 47 rockfall events in a single day, the highest daily incidence recorded over the entire year.",
  "significance": "Increased volcanic unrest; potential eruption threat requiring monitoring",
  "diaspora_impact": "Families in Albay and surrounding areas face potential evacuation; ongoing monitoring required; diaspora may need to assist with evacuation costs or relocation support",
  "mentioned_dynasties": [],
  "sources": {
    "international": [],
    "local": [
      "https://www.rappler.com/nation/regions/mayon-volcano-alert-level-2-2025/",
      "https://bilyonaryo.com/mayon-volcano-alert-level-2-rockfall/"
    ]
  }
}
```

---

## Automation Notes

Optional **n8n** workflows and a future **Vercel cron** draft step are documented in **`$OPENPINAS_ROOT/AUTOMATION.md`**. They produce Slack drafts only; merging JSON still requires human review.

---

*This skill helps Beatriz maintain an up-to-date, accurate resource for Filipino diaspora communities tracking Philippine developments.*
