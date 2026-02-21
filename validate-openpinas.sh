#!/bin/bash
# validate-openpinas.sh
# Run this after ph-news-refresher or ph-weekly-review updates
# This script validates JSON syntax and data integrity

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "=== Validating OpenPinas Data ==="
echo ""

# Validate JSON syntax and data integrity
python3 << 'EOF'
import json
import sys
import os
import glob

errors = []
warnings = []

# Check dynasty JSON
try:
    with open('philippine-political-dynasties-network-2025.json', 'r') as f:
        dyn_data = json.load(f)
    network = dyn_data['philippine_political_dynasties_network']
    dynasties = network['nodes']['dynasties']
    metadata = network['metadata']
    edges = network['edges']['relationships']

    # Check count
    actual_count = len(dynasties)
    metadata_count = metadata.get('total_dynasties', 0)
    if actual_count != metadata_count:
        errors.append(f"Dynasty count mismatch: {actual_count} dynasties in data vs {metadata_count} in metadata")

    # Check IDs are unique
    ids = [d['id'] for d in dynasties]
    if len(ids) != len(set(ids)):
        errors.append("Duplicate dynasty IDs found")

    # Check relationships
    dynasty_ids = set(ids)
    for edge in edges:
        if edge['source'] not in dynasty_ids and edge['source'] not in {'FLOOD_CONTROL_CORRUPTION'}:
            errors.append(f"Invalid relationship source: {edge['source']} in {edge.get('id', 'unknown')}")
        if edge['target'] not in dynasty_ids and edge['target'] not in {'FLOOD_CONTROL_CORRUPTION'}:
            errors.append(f"Invalid relationship target: {edge['target']} in {edge.get('id', 'unknown')}")

    # Check key members count
    total_members = sum(len(d.get('key_members', [])) for d in dynasties)
    metadata_members = metadata.get('total_members_tracked', 0)
    if total_members != metadata_members:
        warnings.append(f"Key members count: {total_members} actual vs {metadata_members} in metadata")

    print(f"✓ Dynasties: {actual_count}")
    print(f"✓ Relationships: {len(edges)}")
    print(f"✓ Key members: {total_members}")

except Exception as e:
    errors.append(f"Dynasty JSON error: {e}")

# Check 2025 timeline JSON
try:
    with open('philippines-2025-timeline.json', 'r') as f:
        timeline_data = json.load(f)

    events = timeline_data.get('timeline', [])
    metadata_events = timeline_data.get('metadata', {}).get('total_events', 0)

    if len(events) != metadata_events:
        warnings.append(f"2025 timeline events: {len(events)} actual vs {metadata_events} in metadata")

    print(f"✓ 2025 timeline events: {len(events)}")

    # Check mentioned_dynasties
    if 'dyn_data' in locals():
        dynasty_ids = {d['id'] for d in dyn_data['philippine_political_dynasties_network']['nodes']['dynasties']}
        for event in events:
            for dyn_id in event.get('mentioned_dynasties', []):
                if dyn_id not in dynasty_ids:
                    errors.append(f"2025 event '{event.get('title', 'unknown')}' ({event.get('date', 'unknown')}) references unknown dynasty: {dyn_id}")

except Exception as e:
    errors.append(f"2025 timeline JSON error: {e}")

# Check 2026 timeline JSON
try:
    with open('philippines-2026-timeline.json', 'r') as f:
        timeline_2026 = json.load(f)

    events_2026 = timeline_2026.get('timeline', [])
    metadata_2026 = timeline_2026.get('metadata', {}).get('total_events', 0)

    if len(events_2026) != metadata_2026:
        warnings.append(f"2026 timeline events: {len(events_2026)} actual vs {metadata_2026} in metadata")

    # Check date ordering
    dates = [e.get('date', '') for e in events_2026]
    if dates != sorted(dates):
        errors.append("2026 timeline events are not sorted by date")

    # Check mentioned_dynasties
    if 'dyn_data' in locals():
        dynasty_ids = {d['id'] for d in dyn_data['philippine_political_dynasties_network']['nodes']['dynasties']}
        for event in events_2026:
            for dyn_id in event.get('mentioned_dynasties', []):
                if dyn_id not in dynasty_ids:
                    errors.append(f"2026 event '{event.get('title', 'unknown')}' ({event.get('date', 'unknown')}) references unknown dynasty: {dyn_id}")

    # Check required fields
    required_fields = ['date', 'title', 'category', 'description']
    for event in events_2026:
        for field in required_fields:
            if not event.get(field):
                errors.append(f"2026 event missing '{field}': {event.get('title', 'unknown')}")

    print(f"✓ 2026 timeline events: {len(events_2026)}")

except Exception as e:
    errors.append(f"2026 timeline JSON error: {e}")

# Check corruption tracker JSON
try:
    corruption_path = 'corruption-tracker/data/pogo-corruption-cases-2025.json'
    if os.path.exists(corruption_path):
        with open(corruption_path, 'r') as f:
            corruption_data = json.load(f)

        cases = corruption_data.get('cases', [])
        metadata_cases = corruption_data.get('metadata', {}).get('total_cases', 0)

        if len(cases) != metadata_cases:
            warnings.append(f"Corruption cases: {len(cases)} actual vs {metadata_cases} in metadata")

        # Check case IDs are unique
        case_ids = [c.get('case_id', '') for c in cases]
        if len(case_ids) != len(set(case_ids)):
            errors.append("Duplicate corruption case IDs found")

        print(f"✓ Corruption cases: {len(cases)}")
    else:
        warnings.append("Corruption tracker JSON not found")

except Exception as e:
    errors.append(f"Corruption tracker JSON error: {e}")

# Check weekly reviews exist and index is in sync
try:
    review_files = sorted(glob.glob('weekly-reviews/weekly-review-2026-*.html'))
    print(f"✓ Weekly reviews: {len(review_files)}")

    if review_files:
        latest = os.path.basename(review_files[-1])
        print(f"  Latest: {latest}")

except Exception as e:
    warnings.append(f"Weekly reviews check error: {e}")

print("")

if warnings:
    print("⚠️  WARNINGS:")
    for warning in warnings:
        print(f"  - {warning}")
    print("")

if errors:
    print("✗ ERRORS FOUND:")
    for error in errors:
        print(f"  - {error}")
    print("")
    print("Please fix these errors before committing.")
    sys.exit(1)
else:
    print("✓ All validations passed!")
    if warnings:
        print("(Some metadata may need updating)")
    sys.exit(0)
EOF

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✓ Validation successful!"
else
    echo ""
    echo "✗ Validation failed. Please fix errors above."
    exit 1
fi
