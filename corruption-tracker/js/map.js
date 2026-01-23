// Map visualization for corruption cases
let map = null;
let markers = [];
let casesData = null;

// Province coordinates (simplified - would need full dataset for all provinces)
const provinceCoordinates = {
  'Tarlac': [15.4833, 120.5833],
  'Bamban': [15.4833, 120.5833], // Same as Tarlac
  'Manila': [14.5995, 120.9842],
  'Metro Manila': [14.6042, 121.0000],
  'NCR': [14.6042, 121.0000],
  'Central Luzon': [15.4833, 120.5833],
  'CALABARZON': [14.2667, 121.4167],
  'Multiple': [12.8797, 121.7740] // Center of Philippines
};

function getCoordinates(location) {
  if (!location) return [12.8797, 121.7740]; // Default: center of Philippines
  
  // Try municipality first
  if (location.municipality && provinceCoordinates[location.municipality]) {
    return provinceCoordinates[location.municipality];
  }
  
  // Try province
  if (location.province && provinceCoordinates[location.province]) {
    return provinceCoordinates[location.province];
  }
  
  // Try region
  if (location.region) {
    const regionMap = {
      'NCR': 'Metro Manila',
      'Central Luzon': 'Central Luzon',
      'CALABARZON': 'CALABARZON'
    };
    const mapped = regionMap[location.region];
    if (mapped && provinceCoordinates[mapped]) {
      return provinceCoordinates[mapped];
    }
  }
  
  return [12.8797, 121.7740]; // Default
}

function getStatusColor(status) {
  const s = status.toLowerCase();
  if (s.includes('ongoing') || s.includes('investigation')) return '#f77f00';
  if (s.includes('convicted')) return '#0b6e4f';
  if (s.includes('dismissed') || s.includes('acquitted')) return '#b23a48';
  if (s.includes('filed') || s.includes('trial')) return '#124559';
  return '#666';
}

// Status icons for map markers (accessibility)
function getStatusIcon(status) {
  const s = status.toLowerCase();
  if (s.includes('ongoing') || s.includes('investigation')) return '⏳';
  if (s.includes('convicted')) return '✓';
  if (s.includes('dismissed') || s.includes('acquitted')) return '✕';
  if (s.includes('filed') || s.includes('trial')) return '📋';
  return '•';
}

async function loadData() {
  try {
    const response = await fetch('data/pogo-corruption-cases-2025.json');
    casesData = await response.json();
    initializeMap();
  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('map-container').innerHTML = 
      '<div style="padding: 40px; text-align: center; color: #c44900;">Error loading map data.</div>';
  }
}

function initializeMap() {
  // Initialize map centered on Philippines
  map = L.map('map-container').setView([12.8797, 121.7740], 6);
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);
  
  updateMap();
}

function updateMap() {
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
  
  const showOngoing = document.getElementById('showOngoing').checked;
  const showConvicted = document.getElementById('showConvicted').checked;
  const showPOGO = document.getElementById('showPOGO').checked;
  const showTrafficking = document.getElementById('showTrafficking').checked;
  
  casesData.cases.forEach(caseItem => {
    // Filter by status
    const status = caseItem.status.toLowerCase();
    const isOngoing = status.includes('ongoing') || status.includes('investigation');
    const isConvicted = status.includes('convicted');
    
    if (isOngoing && !showOngoing) return;
    if (isConvicted && !showConvicted) return;
    
    // Filter by category
    const isPOGO = caseItem.category === 'POGO-related';
    const hasTrafficking = caseItem.human_trafficking_victims > 0 || 
                          caseItem.subcategories?.includes('human_trafficking');
    
    if (isPOGO && !showPOGO) return;
    if (hasTrafficking && !showTrafficking) return;
    
    const coords = getCoordinates(caseItem.location);
    const color = getStatusColor(caseItem.status);
    
    // Create custom icon with status symbol for accessibility
    const statusIcon = getStatusIcon(caseItem.status);
    const icon = L.divIcon({
      className: 'case-marker',
      html: `<div style="
        width: 28px;
        height: 28px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      ">${statusIcon}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    
    // Create popup content
    let popupContent = `<strong>${escapeHtml(caseItem.title)}</strong><br>`;
    popupContent += `<span style="color: ${color}; font-weight: 600;">${formatStatus(caseItem.status)}</span><br>`;
    if (caseItem.location) {
      popupContent += `📍 ${escapeHtml(caseItem.location.municipality || caseItem.location.province || caseItem.location.region || '')}<br>`;
    }
    if (caseItem.human_trafficking_victims) {
      popupContent += `👥 ${caseItem.human_trafficking_victims.toLocaleString()} victims<br>`;
    }
    if (caseItem.amount_involved_php) {
      popupContent += `💰 ${formatAmount(caseItem.amount_involved_php)}<br>`;
    }
    popupContent += `<br><a href="cases/${getCaseUrl(caseItem.case_id)}" style="color: var(--accent);">View case →</a>`;
    
    const marker = L.marker(coords, { icon: icon }).addTo(map);
    marker.bindPopup(popupContent);
    markers.push(marker);
  });
  
  // Fit map to show all markers
  if (markers.length > 0) {
    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
}

function formatStatus(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatAmount(amount) {
  if (amount >= 1000000000) {
    return '₱' + (amount / 1000000000).toFixed(1) + 'B';
  } else if (amount >= 1000000) {
    return '₱' + (amount / 1000000).toFixed(1) + 'M';
  }
  return '₱' + amount.toLocaleString();
}

function getCaseUrl(caseId) {
  if (caseId === 'ALICE_GUO_2024') {
    return 'alice-guo.html';
  }
  return `case-${caseId.toLowerCase().replace(/_/g, '-')}.html`;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Event listeners
document.getElementById('showOngoing').addEventListener('change', updateMap);
document.getElementById('showConvicted').addEventListener('change', updateMap);
document.getElementById('showPOGO').addEventListener('change', updateMap);
document.getElementById('showTrafficking').addEventListener('change', updateMap);

// Load data on page load
loadData();

