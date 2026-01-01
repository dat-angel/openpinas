# Guide: Adding New Cases to the Corruption Tracker

This guide helps you systematically add new POGO and corruption cases to the tracker.

## Quick Start

1. **Research the case** from news sources
2. **Use the template** below to structure the data
3. **Add to JSON file** following the existing format
4. **Validate** the JSON structure
5. **Test** that it appears correctly

---

## Case Template

Copy this template and fill in the details:

```json
{
  "case_id": "UNIQUE_CASE_ID",
  "title": "Case Title - Brief Description",
  "category": "POGO-related",
  "subcategories": ["human_trafficking", "tax_evasion", "identity_fraud"],
  "filing_date": "YYYY-MM-DD",
  "status": "ongoing_investigation",
  "priority": "high",
  "court_agency": "Agency Name (e.g., NBI, PNP, DOJ)",
  "location": {
    "municipality": "City/Municipality",
    "province": "Province",
    "region": "Region"
  },
  "accused": [
    {
      "name": "Full Name",
      "aliases": ["Alias 1", "Alias 2"],
      "position": "Position/Title",
      "position_dates": "YYYY-YYYY",
      "nationality_claimed": "Filipino",
      "nationality_alleged": "If different",
      "status": "under_investigation",
      "current_status": "suspended/arrested/etc",
      "dynasty_connection": "DYNASTY_ID or null",
      "political_party": "Party name or null"
    }
  ],
  "pogo_connections": [
    {
      "company": "Company Name",
      "location": "City, Province",
      "connection_type": "land_owner_operator/suspected_connection/tax_evasion",
      "description": "How this POGO is connected to the case",
      "status": "raided_closed/under_investigation/active",
      "date_raided": "YYYY-MM-DD",
      "victims_rescued": 0,
      "permit_issued_by": "LGU or Agency",
      "license_status": "revoked/active/pending"
    }
  ],
  "charges": [
    "Charge 1",
    "Charge 2",
    "Charge 3"
  ],
  "amount_involved_php": 0,
  "human_trafficking_victims": 0,
  "timeline": [
    {
      "date": "YYYY-MM-DD",
      "event": "Event Title",
      "description": "What happened on this date",
      "sources": ["https://news-source-url.com"]
    }
  ],
  "political_connections": [
    {
      "connection_type": "local_government/business/protection",
      "description": "How politics is involved",
      "dynasty": "DYNASTY_ID or null",
      "details": "Additional details"
    }
  ],
  "dynasty_connections": ["DYNASTY_ID_1", "DYNASTY_ID_2"],
  "related_cases": ["CASE_ID_1", "CASE_ID_2"],
  "significance": "Why this case matters - 1-2 sentences",
  "diaspora_impact": "How this affects diaspora communities - 1-2 sentences",
  "sources": {
    "senate": ["URL if available"],
    "nbi": ["URL if available"],
    "news": [
      "https://www.rappler.com/...",
      "https://www.inquirer.net/...",
      "https://www.philstar.com/..."
    ]
  },
  "last_updated": "YYYY-MM-DD"
}
```

---

## Field Guidelines

### Required Fields
- `case_id`: Unique identifier (e.g., `POGO_TAX_2024`, `COMPANY_NAME_2024`)
- `title`: Clear, descriptive title
- `category`: Usually "POGO-related" for POGO cases
- `filing_date`: When case was filed/started (YYYY-MM-DD)
- `status`: Current status (see status options below)
- `location`: At minimum, province or region

### Status Options
- `ongoing_investigation` - Still being investigated
- `filed` - Case filed in court
- `under_trial` - Currently in trial
- `convicted` - Found guilty
- `dismissed` - Case dismissed
- `acquitted` - Found not guilty

### Priority Levels
- `high` - Major case, high profile, significant impact
- `medium` - Notable but less prominent
- `low` - Minor case

### Subcategories (for POGO cases)
- `human_trafficking`
- `tax_evasion`
- `identity_fraud`
- `money_laundering`
- `kidnapping`
- `corruption`
- `bribery`

### Connection Types (POGO)
- `land_owner_operator` - Owns/operates the POGO
- `suspected_connection` - Suspected but not confirmed
- `tax_evasion` - Tax-related connection
- `human_trafficking` - Trafficking connection
- `permit_protection` - Issued permits or provided protection

---

## Research Sources

### Primary Sources
1. **Rappler** - https://www.rappler.com
   - Search: "POGO" + "case" + year
   - Good for: Breaking news, investigations

2. **Philippine Daily Inquirer** - https://www.inquirer.net
   - Search: "POGO" + "corruption"
   - Good for: Detailed reporting

3. **Philippine Star** - https://www.philstar.com
   - Search: "POGO" + "raid"
   - Good for: Updates, official statements

4. **PCIJ** (Philippine Center for Investigative Journalism) - https://pcij.org
   - Good for: Deep investigations, data

### Government Sources
- **NBI** (National Bureau of Investigation) - Press releases
- **PNP** (Philippine National Police) - Press releases
- **Senate** - Committee hearings, reports
- **Ombudsman** - Case filings (if accessible)

### What to Look For
- Case filing dates
- Names of accused parties
- Company names
- Locations (municipality, province)
- Number of victims
- Amounts involved
- Charges filed
- Timeline of events
- Political connections

---

## Adding to JSON File

### Step 1: Open the file
```
corruption-tracker/data/pogo-corruption-cases-2025.json
```

### Step 2: Add case to cases array
- Find the `"cases": [` array
- Add your new case object (with comma after previous case)
- Make sure JSON syntax is correct (commas, quotes, brackets)

### Step 3: Update statistics
After adding cases, update the statistics section:
```json
"statistics": {
  "total_cases": <new total>,
  "by_status": {
    "ongoing_investigation": <count>,
    "filed": <count>,
    "under_trial": <count>,
    "dismissed": <count>,
    "convicted": <count>,
    "acquitted": <count>
  },
  "by_category": {
    "POGO-related": <count>
  },
  "human_trafficking_victims": <total>,
  "total_amount_php": <total>,
  "pogo_operations_raided": <count>,
  "pogo_operations_active": <count>
}
```

### Step 4: Add POGO operations (if applicable)
If the case involves a POGO operation, add to `pogo_operations` array:
```json
{
  "company": "Company Name",
  "location": {
    "municipality": "City",
    "province": "Province",
    "region": "Region"
  },
  "status": "closed_raided",
  "license_status": "revoked",
  "license_issued_by": "PAGCOR",
  "permit_issued_by": "LGU Name",
  "date_established": "YYYY",
  "date_raided": "YYYY-MM-DD",
  "date_closed": "YYYY-MM-DD",
  "political_connections": ["CASE_ID"],
  "dynasty_connections": [],
  "victims_rescued": 0,
  "charges": ["charge1", "charge2"],
  "related_cases": ["CASE_ID"]
}
```

---

## Validation Checklist

Before committing, verify:

- [ ] JSON is valid (use JSON validator)
- [ ] All required fields are present
- [ ] Dates are in YYYY-MM-DD format
- [ ] URLs in sources start with http:// or https://
- [ ] Case IDs are unique
- [ ] Statistics are updated
- [ ] No trailing commas
- [ ] All strings are properly quoted
- [ ] Related cases reference valid case IDs
- [ ] Dynasty connections reference valid dynasty IDs (if linking to OpenPinas)

### Validate JSON
```bash
python3 -m json.tool data/pogo-corruption-cases-2025.json
```

If it prints the JSON without errors, it's valid!

---

## Testing

After adding a case:

1. **Start local server:**
   ```bash
   cd corruption-tracker
   python3 -m http.server 8000
   ```

2. **Check case list:**
   - Go to `http://localhost:8000/cases/`
   - Verify your case appears
   - Test filters (category, status, year)
   - Test search

3. **Check network view:**
   - Go to `http://localhost:8000/network.html`
   - Verify case appears in network
   - Check connections are correct

4. **Check map view:**
   - Go to `http://localhost:8000/map.html`
   - Verify case appears on map
   - Check location is correct

5. **Check statistics:**
   - Go to `http://localhost:8000/cases/#statistics`
   - Verify counts are correct

---

## Example: Complete Case Entry

Here's a complete example based on Alice Guo case:

```json
{
  "case_id": "ALICE_GUO_2024",
  "title": "Alice Guo Identity Fraud & POGO Connections",
  "category": "POGO-related",
  "subcategories": ["identity_fraud", "human_trafficking", "corruption"],
  "filing_date": "2024-05-01",
  "status": "ongoing_investigation",
  "priority": "high",
  "court_agency": "Senate of the Philippines, NBI, PNP",
  "location": {
    "municipality": "Bamban",
    "province": "Tarlac",
    "region": "Central Luzon"
  },
  "accused": [
    {
      "name": "Alice Guo",
      "aliases": ["Guo Hua Ping"],
      "position": "Mayor, Bamban, Tarlac",
      "position_dates": "2022-2024",
      "nationality_claimed": "Filipino",
      "nationality_alleged": "Chinese",
      "status": "under_investigation",
      "current_status": "suspended",
      "dynasty_connection": null,
      "political_party": null
    }
  ],
  "pogo_connections": [
    {
      "company": "Hongsheng Gaming Technology Inc.",
      "location": "Bamban, Tarlac",
      "connection_type": "land_owner_operator",
      "description": "POGO operated on land owned/connected to Alice Guo",
      "status": "raided_closed",
      "date_raided": "2024-03-13",
      "victims_rescued": 875,
      "permit_issued_by": "Bamban LGU (Local Government Unit)",
      "license_status": "revoked"
    }
  ],
  "charges": [
    "Identity fraud",
    "Falsification of documents",
    "Human trafficking (complicity)",
    "Graft and corruption",
    "Violation of Anti-Trafficking in Persons Act"
  ],
  "amount_involved_php": null,
  "human_trafficking_victims": 875,
  "timeline": [
    {
      "date": "2024-03-13",
      "event": "POGO Raid",
      "description": "PNP raids Hongsheng Gaming Technology Inc. in Bamban, rescues 875 individuals",
      "sources": ["https://www.rappler.com/nation/pnp-raids-pogo-facility-bamban-tarlac/"]
    },
    {
      "date": "2024-05-01",
      "event": "Senate Investigation Begins",
      "description": "Senate Committee starts probe into Alice Guo's identity and POGO connections",
      "sources": ["https://www.rappler.com/nation/senate-probes-alice-guo-identity-pogo-connections/"]
    }
  ],
  "political_connections": [
    {
      "connection_type": "local_government",
      "description": "Mayor of Bamban, issued permits for POGO operations",
      "dynasty": null,
      "details": "Used position to facilitate POGO operations"
    }
  ],
  "dynasty_connections": [],
  "related_cases": [],
  "significance": "High-profile case exposing how POGO operations are facilitated by local government officials.",
  "diaspora_impact": "Shows how corruption enables human trafficking and illegal operations.",
  "sources": {
    "senate": [],
    "nbi": [],
    "news": [
      "https://www.rappler.com/nation/alice-guo-pogo-bamban-tarlac/",
      "https://www.inquirer.net/nation/alice-guo-identity-investigation/"
    ]
  },
  "last_updated": "2024-07-15"
}
```

---

## Tips

1. **Start with high-profile cases** - They have more complete information
2. **Use consistent naming** - Case IDs should follow a pattern
3. **Document sources** - Always include news article URLs
4. **Keep timelines chronological** - Oldest to newest
5. **Be specific with locations** - Municipality + Province is best
6. **Update regularly** - Cases change status, add timeline events
7. **Link related cases** - Use `related_cases` array to connect cases

---

## Common Issues

### JSON Syntax Errors
- Missing commas between objects
- Trailing commas (not allowed in JSON)
- Unclosed brackets or braces
- Unescaped quotes in strings

**Fix:** Use a JSON validator or `python3 -m json.tool`

### Missing Data
- If you don't know a field, use `null` (not empty string)
- For optional arrays, use empty array `[]`
- For optional objects, use `null` or omit the field

### Case Not Appearing
- Check case is in `cases` array (not outside)
- Verify JSON is valid
- Check browser console for errors
- Ensure statistics are updated

---

## Next Steps

After adding cases:
1. Validate JSON
2. Test locally
3. Commit to GitHub
4. Update README if needed
5. Consider creating detail pages for major cases

---

**Questions?** Check existing cases in the JSON file for examples, or refer to the Alice Guo case as a complete reference.

