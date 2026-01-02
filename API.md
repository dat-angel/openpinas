# OpenPinas API Documentation

> **Note:** Currently, OpenPinas serves data as static JSON files. This document describes the current data structure and future API plans.

## Current Data Access

All data is available as JSON files in the repository:

- `philippine-political-dynasties-network-2025.json` - Dynasty network data
- `philippines-2025-timeline.json` - Timeline events
- `pogo-corruption-cases-2025.json` - Corruption cases
- `regional-data.json` - Regional statistics

### Accessing Data

**Via GitHub:**
```
https://raw.githubusercontent.com/dat-angel/openpinas/main/philippine-political-dynasties-network-2025.json
```

**Via GitHub Pages:**
```
https://dat-angel.github.io/openpinas/philippine-political-dynasties-network-2025.json
```

**Local Development:**
```bash
# Clone the repository
git clone https://github.com/dat-angel/openpinas.git
cd openpinas

# Access JSON files directly
cat philippine-political-dynasties-network-2025.json
```

## Data Structures

### Dynasty Network Data

**File:** `philippine-political-dynasties-network-2025.json`

**Structure:**
```json
{
  "philippine_political_dynasties_network": {
    "metadata": {
      "title": "...",
      "version": "4.0",
      "last_updated": "2026-01-01",
      "total_dynasties": 71,
      "total_members_tracked": 148
    },
    "nodes": {
      "dynasties": [
        {
          "id": "DYNASTY_ID",
          "name": "Dynasty Name",
          "key_members": [...],
          "geographic_control": [...],
          "power_level": "national|regional|local",
          "establishment_date": 1868
        }
      ]
    },
    "edges": {
      "relationships": [
        {
          "id": "RELATIONSHIP_ID",
          "source": "DYNASTY_ID_1",
          "target": "DYNASTY_ID_2",
          "type": "marriage|alliance|conflict",
          "description": "..."
        }
      ]
    }
  }
}
```

### Timeline Data

**File:** `philippines-2025-timeline.json`

**Structure:**
```json
{
  "metadata": {
    "title": "...",
    "year": 2025,
    "total_events": 49
  },
  "timeline": [
    {
      "date": "2025-01-15",
      "title": "Event Title",
      "description": "...",
      "category": "Political|Cultural|Natural Disaster|...",
      "mentioned_dynasties": ["DYNASTY_ID_1", "DYNASTY_ID_2"],
      "sources": ["https://..."]
    }
  ]
}
```

### Corruption Cases Data

**File:** `pogo-corruption-cases-2025.json`

**Structure:**
```json
{
  "metadata": {
    "title": "...",
    "total_cases": 0
  },
  "cases": [
    {
      "case_id": "CASE_ID",
      "title": "Case Title",
      "category": "POGO-related|...",
      "status": "ongoing_investigation|filed|...",
      "accused": [...],
      "timeline": [...],
      "sources": {...}
    }
  ]
}
```

## Usage Examples

### JavaScript (Fetch API)

```javascript
// Fetch dynasty data
fetch('https://dat-angel.github.io/openpinas/philippine-political-dynasties-network-2025.json')
  .then(response => response.json())
  .then(data => {
    const dynasties = data.philippine_political_dynasties_network.nodes.dynasties;
    console.log(`Found ${dynasties.length} dynasties`);
  });

// Fetch timeline
fetch('https://dat-angel.github.io/openpinas/philippines-2025-timeline.json')
  .then(response => response.json())
  .then(data => {
    const events = data.timeline;
    console.log(`Found ${events.length} events`);
  });
```

### Python

```python
import json
import urllib.request

# Fetch dynasty data
url = 'https://dat-angel.github.io/openpinas/philippine-political-dynasties-network-2025.json'
with urllib.request.urlopen(url) as response:
    data = json.loads(response.read())
    dynasties = data['philippine_political_dynasties_network']['nodes']['dynasties']
    print(f"Found {len(dynasties)} dynasties")
```

### Node.js

```javascript
const https = require('https');
const fs = require('fs');

https.get('https://dat-angel.github.io/openpinas/philippine-political-dynasties-network-2025.json', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log(`Found ${json.philippine_political_dynasties_network.nodes.dynasties.length} dynasties`);
  });
});
```

## Future API Plans

See [ROADMAP.md](ROADMAP.md) for planned API features:

- RESTful API endpoints
- GraphQL API
- Real-time updates
- Filtering and search endpoints
- Export formats (CSV, PDF)
- Rate limiting
- API versioning

## Data License

All data is licensed under [CC BY 4.0](LICENSE-DATA). You are free to:
- Share and redistribute
- Adapt and remix
- Use commercially

**Requirement:** Provide attribution to OpenPinas and link to the license.

## Rate Limits

Currently, there are no rate limits. However, please be respectful:
- Don't make excessive requests
- Cache data when possible
- Consider cloning the repository for local access

## Support

- **Issues**: [GitHub Issues](https://github.com/dat-angel/openpinas/issues)
- **Questions**: Open a [question issue](https://github.com/dat-angel/openpinas/issues/new?template=question.md)
- **Data Corrections**: [Data update issue](https://github.com/dat-angel/openpinas/issues/new?template=data_update.md)

## Contributing

Want to improve the API or data structure? See [CONTRIBUTING.md](CONTRIBUTING.md).

