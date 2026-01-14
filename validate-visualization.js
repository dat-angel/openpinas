// Validation script for startup ecosystem visualization
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Startup Ecosystem Visualization...\n');

// Read JSON data
const jsonPath = path.join(__dirname, 'philippine-startup-ecosystem-2025.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Read HTML
const htmlPath = path.join(__dirname, 'startup-ecosystem-visualization.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

let errors = [];
let warnings = [];
let success = [];

// 1. Check JSON structure
console.log('1. Validating JSON structure...');
const requiredSections = [
  'metadata',
  'startups',
  'unicorns',
  'investors_vcs',
  'international_vcs',
  'family_offices_venture_offices',
  'government_support',
  'co_working_spaces_incubators',
  'angel_investors',
  'funding_trends',
  'exits',
  'ecosystem_hubs',
  'regulatory_environment',
  'education_pipeline'
];

requiredSections.forEach(section => {
  if (jsonData[section]) {
    success.push(`✓ ${section} exists`);
  } else {
    warnings.push(`⚠ ${section} missing`);
  }
});

// 2. Check startups have required fields
console.log('\n2. Validating startup data...');
jsonData.startups.forEach(startup => {
  const required = ['startup_id', 'name', 'founded', 'status', 'industry'];
  required.forEach(field => {
    if (!startup[field]) {
      warnings.push(`⚠ Startup ${startup.name || startup.startup_id}: missing ${field}`);
    }
  });
  
  // Check funding structure
  if (startup.funding) {
    if (startup.funding.funding_rounds && startup.funding.funding_rounds.length > 0) {
      startup.funding.funding_rounds.forEach((round, idx) => {
        if (!round.round || !round.date || !round.amount_usd) {
          warnings.push(`⚠ ${startup.name}: funding_rounds[${idx}] missing required fields`);
        }
      });
    }
  }
  
  // Check metrics
  if (startup.metrics && startup.metrics.users) {
    success.push(`✓ ${startup.name}: has user metrics`);
  }
});

// 3. Check unicorns
console.log('\n3. Validating unicorns...');
if (jsonData.unicorns && jsonData.unicorns.length > 0) {
  jsonData.unicorns.forEach(unicorn => {
    if (!unicorn.valuation_usd || unicorn.valuation_usd < 1000000000) {
      warnings.push(`⚠ ${unicorn.name}: valuation may not meet unicorn threshold ($1B)`);
    }
    if (unicorn.unicorn_status && unicorn.valuation_usd) {
      success.push(`✓ ${unicorn.name}: valid unicorn ($${(unicorn.valuation_usd / 1000000000).toFixed(1)}B)`);
    }
  });
}

// 4. Check international VCs
console.log('\n4. Validating international VCs...');
if (jsonData.international_vcs && jsonData.international_vcs.length > 0) {
  jsonData.international_vcs.forEach(vc => {
    if (!vc.location) {
      warnings.push(`⚠ ${vc.name}: missing location`);
    }
    if (vc.philippine_connections && vc.philippine_connections.length > 0) {
      success.push(`✓ ${vc.name}: has ${vc.philippine_connections.length} PH connection(s)`);
    }
  });
}

// 5. Check exits
console.log('\n5. Validating exits...');
if (jsonData.exits && jsonData.exits.length > 0) {
  const validExits = jsonData.exits.filter(e => e.startup_id);
  if (validExits.length > 0) {
    success.push(`✓ Found ${validExits.length} exit event(s)`);
  }
}

// 6. Check HTML references
console.log('\n6. Validating HTML code references...');
const htmlChecks = [
  { pattern: 'international_vcs', name: 'International VCs' },
  { pattern: 'funding_rounds', name: 'Funding rounds' },
  { pattern: 'regulatory_environment', name: 'Regulatory environment' },
  { pattern: 'education_pipeline', name: 'Education pipeline' },
  { pattern: 'unicorn', name: 'Unicorn handling' },
  { pattern: 'exit', name: 'Exit events' },
  { pattern: 'updateEcosystemInsights', name: 'Ecosystem insights function' },
  { pattern: 'yearFilter', name: 'Timeline filter' }
];

htmlChecks.forEach(check => {
  if (htmlContent.includes(check.pattern)) {
    success.push(`✓ HTML references ${check.name}`);
  } else {
    errors.push(`✗ HTML missing reference to ${check.name}`);
  }
});

// 7. Check node type handling
console.log('\n7. Validating node type handling...');
const nodeTypes = ['startup', 'unicorn', 'founder', 'vc', 'international_vc', 'family_office', 'investor'];
nodeTypes.forEach(type => {
  if (htmlContent.includes(`nodeData.type === '${type}'`) || htmlContent.includes(`node.data.type === '${type}'`)) {
    success.push(`✓ Node type '${type}' handled`);
  } else {
    warnings.push(`⚠ Node type '${type}' may not be fully handled`);
  }
});

// 8. Check filter functionality
console.log('\n8. Validating filters...');
const filters = ['unicorns', 'by-year', 'investors', 'founders', 'power-players'];
filters.forEach(filter => {
  if (htmlContent.includes(`value="${filter}"`)) {
    success.push(`✓ Filter '${filter}' available`);
  } else {
    warnings.push(`⚠ Filter '${filter}' may be missing`);
  }
});

// 9. Check data consistency
console.log('\n9. Validating data consistency...');
// Check that startups referenced in VCs exist
if (jsonData.international_vcs) {
  jsonData.international_vcs.forEach(vc => {
    if (vc.portfolio_startups) {
      vc.portfolio_startups.forEach(startupId => {
        const exists = jsonData.startups.find(s => s.startup_id === startupId) || 
                      jsonData.unicorns.find(u => u.startup_id === startupId);
        if (!exists) {
          warnings.push(`⚠ VC ${vc.name} references non-existent startup: ${startupId}`);
        }
      });
    }
  });
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(60));

if (success.length > 0) {
  console.log(`\n✅ SUCCESS (${success.length}):`);
  success.forEach(msg => console.log(`  ${msg}`));
}

if (warnings.length > 0) {
  console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
  warnings.forEach(msg => console.log(`  ${msg}`));
}

if (errors.length > 0) {
  console.log(`\n❌ ERRORS (${errors.length}):`);
  errors.forEach(msg => console.log(`  ${msg}`));
  process.exit(1);
} else {
  console.log('\n✅ Validation complete! No critical errors found.');
  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} warning(s) to review.`);
  }
}
