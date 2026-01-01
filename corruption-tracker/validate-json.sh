#!/bin/bash
# Quick JSON validation script

echo "Validating pogo-corruption-cases-2025.json..."
python3 -m json.tool data/pogo-corruption-cases-2025.json > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ JSON is valid!"
    
    # Count cases
    case_count=$(python3 -c "import json; data = json.load(open('data/pogo-corruption-cases-2025.json')); print(len(data['cases']))")
    echo "📊 Total cases: $case_count"
    
    # Show statistics
    python3 -c "
import json
data = json.load(open('data/pogo-corruption-cases-2025.json'))
stats = data.get('statistics', {})
print(f\"📈 Statistics:\")
print(f\"  Total cases: {stats.get('total_cases', 0)}\")
print(f\"  Trafficking victims: {stats.get('human_trafficking_victims', 0):,}\")
print(f\"  Total amount: ₱{stats.get('total_amount_php', 0):,}\")
"
else
    echo "❌ JSON is invalid! Check for syntax errors."
    exit 1
fi

