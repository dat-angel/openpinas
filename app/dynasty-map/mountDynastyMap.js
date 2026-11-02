/**
 * Dynasty network + Leaflet map — ported from dynasties-network-visualization.html
 * Mounts inside `root`; expects JSON at /dynasty-map/*.json (sync script).
 */
export function mountDynastyMap(root, { Network, DataSet, L }, opts = {}) {
  const { onSelectDynasty } = opts;
  const $ = (id) => root.querySelector("#" + id);
  const JSON_BASE = "/dynasty-map";
  const ac = new AbortController();
  const { signal } = ac;

  function absReviewUrl(href) {
    if (!href) return href;
    if (href.startsWith("http://") || href.startsWith("https://")) return href;
    if (href.startsWith("/")) return href;
    return "/" + href.replace(/^\.\//, "");
  }

    let network = null;
    let nodes = null;
    let edges = null;
    let allNodes = [];
    let allEdges = [];
    let dynastiesData = null;
    let timelineData = null;
    let weeklyReviewsData = {};
    let phMap = null;
    let provinceMarkers = [];

    // Color mapping for dynasty classifications (Filipino flag colors)
    // Philippine flag: Blue (#0038A8), Red (#CE1126), Yellow/Gold (#FCD116), White
    const classificationColors = {
      'imperial_dynasty': '#0038A8',        // Highest power - Deep Philippine blue (high contrast)
      'dominant_dynasty': '#CE1126',         // Very high power - Bright Philippine red (high contrast)
      'major_dynasty': '#0066CC',           // High power - Bright blue (better contrast)
      'established_dynasty': '#DC143C',      // Moderate-high power - Crimson red (better contrast)
      'rising_dynasty': '#FFD700',           // Growing power - Bright gold (high contrast)
      'minor_dynasty': '#228B22',            // Lower power - Forest green (high contrast)
      'new_dynasty': '#FF6B35'               // Just starting - Orange-red (high contrast)
    };

    // Load dynasties data
    async function loadDynastiesData() {
      try {
        const response = await fetch(`${JSON_BASE}/philippine-political-dynasties-network-2025.json`);
        if (!response || !response.ok) {
          throw new Error(`Failed to load JSON file. Status: ${response?.status || "unknown"}`);
        }

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          throw new Error(`JSON parse error: ${parseError.message}. First 200 chars: ${text.substring(0, 200)}`);
        }
        
        if (!data || !data.philippine_political_dynasties_network) {
          throw new Error('Invalid JSON structure: missing philippine_political_dynasties_network. Keys found: ' + Object.keys(data || {}).join(', '));
        }
        
        dynastiesData = data.philippine_political_dynasties_network;
        
        // Update last updated timestamp
        const lastUpdated = dynastiesData.metadata.last_updated || 'Unknown';
        const lastUpdatedEl = $('lastUpdated');
        if (lastUpdatedEl) {
          lastUpdatedEl.textContent = `Last updated: ${lastUpdated}`;
        }
        
        // Load timeline data for recent news
        try {
          const timelineResponse = await fetch(`${JSON_BASE}/philippines-2026-timeline.json`);
          if (timelineResponse.ok) {
            timelineData = await timelineResponse.json();
          }
        } catch (e) {
          console.log('Timeline data not available, continuing without it');
        }
        
        buildNetwork();
        updateStats();
        applyHashFromLocation();
        window.addEventListener("hashchange", applyHashFromLocation, { signal });
      } catch (error) {
        console.error('Error loading dynasties data:', error);
        const errorMsg = error.message || 'Unknown error';
        $('network-container').innerHTML = 
          `<div style="padding: 40px; text-align: center; color: #c44900;">
            <h3 style="color: #c44900; margin-bottom: 16px;">Error loading network data</h3>
            <p style="color: #666; margin-bottom: 8px;">${errorMsg}</p>
            <p style="color: #666; font-size: 12px; margin-top: 16px;">
              <strong>Note:</strong> If opening this file directly in a browser, you may need to:<br>
              1. Use a local web server (e.g., <code>python -m http.server</code> or <code>npx serve</code>)<br>
              2. Or ensure the JSON file is in the same directory as this HTML file
            </p>
            <p style="color: #666; font-size: 12px; margin-top: 8px;">
              Check the browser console (F12) for more details.
            </p>
          </div>`;
      }
    }

    function buildNetwork() {
      allNodes = [];
      allEdges = [];

      // Create nodes from dynasties
      dynastiesData.nodes.dynasties.forEach(dynasty => {
        const classification = dynasty.classification || 'major_dynasty';
        const color = classificationColors[classification] || '#666';
        const size = Math.min(30 + (dynasty.current_positions_held || 0) * 2, 80);
        
        // Determine crisis status with high contrast borders
        let borderColor = '#000000';
        let borderWidth = 3;
        if (dynasty.crisis_level === 'critical') {
          borderColor = '#FF0000';  // Bright red for critical
          borderWidth = 5;
        } else if (dynasty.crisis_level === 'high') {
          borderColor = '#FF8C00';  // Dark orange for high crisis
          borderWidth = 4;
        }

        allNodes.push({
          id: dynasty.id,
          label: dynasty.name.replace('_', ' ').replace('FAMILY', '').trim(),
          title: `${dynasty.name}\nPositions: ${dynasty.current_positions_held || 0}\nPower: ${dynasty.power_level}\nStatus: ${dynasty['2025_status'] || 'stable'}`,
          color: {
            background: color,
            border: borderColor,
            highlight: { background: color, border: borderColor }
          },
          size: size,
          borderWidth: borderWidth,
          font: { size: 14, face: 'Arial' },
          shape: 'dot',
          data: dynasty
        });
      });

      // Create edges from relationships
      dynastiesData.edges.relationships.forEach(rel => {
        let edgeStyle = {};
        let color = '#0b6e4f';
        let width = 2;
        let dashes = false;

        // Use high contrast colors for relationships
        if (rel.type === 'alliance') {
          color = '#0038A8';  // Deep Philippine blue (high contrast)
          width = 4;
        } else if (rel.type === 'rivalry') {
          color = '#CE1126';  // Bright Philippine red (high contrast)
          width = 3;
          dashes = true;
        } else if (rel.type === 'corruption_network') {
          color = '#FFD700';  // Bright gold (high contrast warning)
          width = 5;
        } else if (rel.type === 'marriage') {
          color = '#0066CC';  // Bright blue (high contrast)
          width = 4;
        }

        allEdges.push({
          id: rel.id,
          from: rel.source,
          to: rel.target,
          label: rel.type.replace('_', ' '),
          color: { color: color, highlight: color },
          width: width,
          dashes: dashes,
          title: rel.description || rel.type,
          data: rel
        });
      });

      // Initial render
      updateNetwork();
    }

    function updateNetwork() {
      if (network) {
        network.destroy();
        network = null;
      }
      // Apply filters
      let filteredNodes = [...allNodes];
      let filteredEdges = [...allEdges];

      // Filter by power level
      const powerFilter = $('filterPower').value;
      if (powerFilter !== 'all') {
        filteredNodes = filteredNodes.filter(node => 
          node.data.power_level === powerFilter
        );
        // Update edges to only include filtered nodes
        const nodeIds = new Set(filteredNodes.map(n => n.id));
        filteredEdges = filteredEdges.filter(edge => 
          nodeIds.has(edge.from) && nodeIds.has(edge.to)
        );
      }

      // Filter by crisis status
      const crisisFilter = $('filterCrisis').value;
      if (crisisFilter === 'crisis') {
        filteredNodes = filteredNodes.filter(node => 
          node.data.crisis_level === 'critical' || node.data.crisis_level === 'high'
        );
        const nodeIds = new Set(filteredNodes.map(n => n.id));
        filteredEdges = filteredEdges.filter(edge => 
          nodeIds.has(edge.from) && nodeIds.has(edge.to)
        );
      } else if (crisisFilter === 'stable') {
        filteredNodes = filteredNodes.filter(node => 
          !node.data.crisis_level || (node.data.crisis_level !== 'critical' && node.data.crisis_level !== 'high')
        );
        const nodeIds = new Set(filteredNodes.map(n => n.id));
        filteredEdges = filteredEdges.filter(edge => 
          nodeIds.has(edge.from) && nodeIds.has(edge.to)
        );
      }

      // Filter by geographic region (Luzon, Visayas, Mindanao)
      const regionFilter = $('filterRegion')?.value || 'all';
      if (regionFilter !== 'all') {
        // Define regions
        const luzonRegions = ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan', 'Tarlac', 'Pampanga', 'Bulacan', 'Rizal', 'Cavite', 'Laguna', 'Batangas', 'Quezon', 'Manila', 'Metro Manila', 'Bicol'];
        const visayasRegions = ['Leyte', 'Cebu', 'Bohol', 'Negros', 'Iloilo', 'Aklan', 'Capiz', 'Antique', 'Samar', 'Biliran', 'Southern Leyte'];
        const mindanaoRegions = ['Davao', 'Davao City', 'Davao del Sur', 'Davao Oriental', 'Davao del Norte', 'Maguindanao', 'Sultan Kudarat', 'Sarangani', 'General Santos', 'Cotabato', 'Zamboanga', 'Basilan', 'Sulu', 'Tawi-Tawi', 'Agusan', 'Surigao', 'Misamis', 'Lanao', 'Bukidnon'];
        
        const regionMap = {
          'luzon': luzonRegions,
          'visayas': visayasRegions,
          'mindanao': mindanaoRegions
        };
        
        const targetRegions = regionMap[regionFilter] || [];
        filteredNodes = filteredNodes.filter(node => {
          if (!node.data.primary_regions || node.data.primary_regions.length === 0) return false;
          return node.data.primary_regions.some(region => 
            targetRegions.some(target => region.includes(target) || target.includes(region))
          );
        });
        const nodeIds = new Set(filteredNodes.map(n => n.id));
        filteredEdges = filteredEdges.filter(edge => 
          nodeIds.has(edge.from) && nodeIds.has(edge.to)
        );
      }

      // Filter edges by type
      const showAlliances = $('showAlliances').checked;
      const showRivalries = $('showRivalries').checked;
      const showCorruption = $('showCorruption').checked;

      filteredEdges = filteredEdges.filter(edge => {
        if (edge.data.type === 'alliance' && !showAlliances) return false;
        if (edge.data.type === 'rivalry' && !showRivalries) return false;
        if (edge.data.type === 'corruption_network' && !showCorruption) return false;
        return true;
      });

      nodes = new DataSet(filteredNodes);
      edges = new DataSet(filteredEdges);

      const data = { nodes: nodes, edges: edges };
      const options = {
        nodes: {
          shape: 'dot',
          font: { size: 14, face: 'Arial' },
          borderWidth: 2,
          shadow: true
        },
        edges: {
          arrows: { to: { enabled: true, scaleFactor: 1 } },
          smooth: { type: 'continuous', roundness: 0.5 },
          font: { size: 10, align: 'middle' },
          shadow: true
        },
        physics: {
          enabled: true,
          stabilization: { iterations: 200 },
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.1,
            springLength: 200,
            springConstant: 0.04,
            damping: 0.09
          }
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView: true,
          dragView: true
        }
      };

      const container = $('network-container');
      network = new Network(container, data, options);

      // Add click event to show info panel
      network.on('click', function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = nodes.get(nodeId);
          showInfoPanel(node.data);
        } else {
          closeInfoPanel();
        }
      });

      // Add hover event for edges
      network.on('hoverEdge', function(params) {
        if (params.edge) {
          const edge = edges.get(params.edge);
          // Could show edge info in a tooltip
        }
      });
    }

    function showDynastyById(dynastyId) {
      if (!dynastiesData) return;
      const dynasty = dynastiesData.nodes.dynasties.find(d => d.id === dynastyId);
      if (dynasty) {
        showInfoPanel(dynasty);
        // Highlight the node in the network
        if (network) {
          network.selectNodes([dynastyId]);
          network.focus(dynastyId, { animation: true });
        }
      }
    }

    function applyHashFromLocation() {
      const m = /^#dynasty-(.+)$/.exec(window.location.hash || "");
      if (m && dynastiesData) {
        showDynastyById(decodeURIComponent(m[1]));
      }
    }

    function showInfoPanel(dynasty) {
      if (typeof onSelectDynasty === "function") {
        onSelectDynasty(dynasty);
      }
    }

    function closeInfoPanel() {}

    function closeGlossaryPanel() {
      $('glossaryPanel').classList.remove('visible');
    }

    function showGlossaryPanel() {
      const panel = $('glossaryPanel');
      panel.classList.add('visible');
    }

    function updateStats() {
      $('dynastyCount').textContent = 
        `Dynasties: ${dynastiesData.nodes.dynasties.length}`;
      $('relationshipCount').textContent = 
        `Relationships: ${dynastiesData.edges.relationships.length}`;
    }

    window.__OPENPINAS_DYNASTY_MAP__ = { showDynastyById };

    let isMapView = false;

    // Event listeners
    $('showAlliances').addEventListener('change', updateNetwork, { signal });
    $('showRivalries').addEventListener('change', updateNetwork, { signal });
    $('showCorruption').addEventListener('change', updateNetwork, { signal });
    $('filterPower').addEventListener('change', updateNetwork, { signal });
    $('filterCrisis').addEventListener('change', updateNetwork, { signal });
    const filterRegion = $('filterRegion');
    if (filterRegion) {
      filterRegion.addEventListener('change', updateNetwork, { signal });
    }
    $('resetView').addEventListener('click', () => {
      if (network) {
        network.fit();
      }
      if (phMap) {
        phMap.setView([12.8797, 121.7740], 6);
      }
    }, { signal });
    
    $('showGlossary').addEventListener('click', () => {
      const panel = $('glossaryPanel');
      if (panel.classList.contains('visible')) {
        closeGlossaryPanel();
      } else {
        showGlossaryPanel();
        closeInfoPanel();
      }
    }, { signal });
    
    // Toggle between network and map view
    $('toggleView').addEventListener('click', () => {
      isMapView = !isMapView;
      const networkContainer = $('network-container');
      const mapContainer = $('map-container');
      const toggleBtn = $('toggleView');

      if (isMapView) {
        networkContainer.style.display = 'none';
        mapContainer.style.display = 'block';
        toggleBtn.textContent = 'Show Network View';
        if (!phMap) {
          initializeMap();
        }
      } else {
        networkContainer.style.display = 'block';
        mapContainer.style.display = 'none';
        toggleBtn.textContent = 'Show Map View';
      }
    }, { signal });

    // Province coordinates mapping
    const provinceCoordinates = {
      'Ilocos Norte': [18.1667, 120.5833],
      'Ilocos Sur': [17.3333, 120.5833],
      'La Union': [16.5000, 120.3333],
      'Leyte': [11.1667, 124.8333],
      'Davao City': [7.0736, 125.6128],
      'Davao del Sur': [6.7667, 125.3500],
      'Davao Oriental': [7.1833, 126.3167],
      'Davao Provinces (Davao City, Sur, Oriental)': [7.0736, 125.6128],
      'Cavite': [14.4792, 120.8970],
      'Masbate': [12.1667, 123.5833],
      'Isabela': [16.7500, 121.7500],
      'Rizal': [14.6500, 121.2000],
      'Batangas': [13.7500, 121.0500],
      'Quezon': [14.0000, 121.5000],
      'Maguindanao': [7.1333, 124.2667],
      'Sultan Kudarat': [6.5667, 124.2833],
      'Sarangani': [5.8333, 125.1667],
      'General Santos City & Sarangani': [6.1167, 125.1667],
      'General Santos': [6.1167, 125.1667],
      'Basilan': [6.5833, 122.0333],
      'Manila': [14.5995, 120.9842],
      'Metro Manila': [14.6042, 121.0000],
      'Manila & Metro Manila': [14.6042, 121.0000],
      'Cebu': [10.3157, 123.8854],
      'Bohol': [9.8333, 124.1667],
      'Negros': [10.6667, 123.0000],
      'Iloilo': [10.7202, 122.5621],
      'Pampanga': [15.0667, 120.6667],
      'Bulacan': [14.8000, 121.0667],
      'Laguna': [14.2667, 121.4167],
      'Tarlac': [15.4833, 120.5833],
      'Pangasinan': [16.0000, 120.3333],
      'Las Piñas': [14.4500, 120.9833],
      'Makati': [14.5500, 121.0333],
      'Sulu': [5.9833, 121.0167]
    };
    
    // Helper function to find province coordinates
    function findProvinceCoordinates(provinceName) {
      // Try exact match first
      if (provinceCoordinates[provinceName]) {
        return provinceCoordinates[provinceName];
      }
      
      // Try partial match
      for (const [key, coords] of Object.entries(provinceCoordinates)) {
        if (provinceName.includes(key) || key.includes(provinceName)) {
          return coords;
        }
      }
      
      // Try splitting by common separators
      const parts = provinceName.split(/[(),]/).map(p => p.trim());
      for (const part of parts) {
        if (provinceCoordinates[part]) {
          return provinceCoordinates[part];
        }
      }
      
      // Default to center of Philippines
      return [12.8797, 121.7740];
    }

    function initializeMap() {
      // Initialize map centered on Philippines
      phMap = L.map($('map-container')).setView([12.8797, 121.7740], 6);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(phMap);
      
      // Create a mapping of dynasty IDs to colors
      const dynastyColorMap = {};
      dynastiesData.nodes.dynasties.forEach(dynasty => {
        const classification = dynasty.classification || 'major_dynasty';
        dynastyColorMap[dynasty.id] = classificationColors[classification] || '#666';
      });
      
      // Add markers for each province
      dynastiesData.geographic_nodes.provinces.forEach(province => {
        const coords = findProvinceCoordinates(province.name);
        
        // Determine controlling dynasty and color
        let controllingDynasty = null;
        let color = '#CCCCCC'; // Default gray
        let controlInfo = '';
        
        if (province.controlling_dynasty) {
          controllingDynasty = province.controlling_dynasty;
          color = dynastyColorMap[controllingDynasty] || '#CCCCCC';
          const dynasty = dynastiesData.nodes.dynasties.find(d => d.id === controllingDynasty);
          controlInfo = dynasty ? dynasty.name.replace('_', ' ').replace('FAMILY', '').trim() : controllingDynasty;
        } else if (province.controlling_dynasties && province.controlling_dynasties.length > 0) {
          controllingDynasty = province.controlling_dynasties[0];
          color = dynastyColorMap[controllingDynasty] || '#CCCCCC';
          const dynasty = dynastiesData.nodes.dynasties.find(d => d.id === controllingDynasty);
          controlInfo = dynasty ? dynasty.name.replace('_', ' ').replace('FAMILY', '').trim() : controllingDynasty;
          if (province.controlling_dynasties.length > 1) {
            controlInfo += ` (+${province.controlling_dynasties.length - 1} more)`;
          }
        } else if (province.competing_dynasties && province.competing_dynasties.length > 0) {
          controllingDynasty = province.competing_dynasties[0];
          color = '#FCD116'; // Gold for contested
          controlInfo = 'Contested: ' + province.competing_dynasties.map(id => {
            const d = dynastiesData.nodes.dynasties.find(dyn => dyn.id === id);
            return d ? d.name.replace('_', ' ').replace('FAMILY', '').trim() : id;
          }).join(', ');
        }
        
        // Create custom icon with high contrast
        const borderColor = color === '#0038A8' ? '#001F5C' : 
                           color === '#CE1126' ? '#8B0000' :
                           color === '#0066CC' ? '#003D7A' :
                           color === '#DC143C' ? '#8B0000' :
                           color === '#FFD700' ? '#B8860B' :
                           color === '#228B22' ? '#006400' :
                           color === '#FF6B35' ? '#CC5500' : '#000000';
        
        const icon = L.divIcon({
          className: 'province-marker',
          html: `<div style="
            width: ${province.control_strength === 'absolute' ? '22' : '18'}px;
            height: ${province.control_strength === 'absolute' ? '22' : '18'}px;
            background: ${color};
            border: 3px solid ${borderColor};
            border-radius: 50%;
            box-shadow: 0 3px 6px rgba(0,0,0,0.5), 0 0 0 2px white;
          "></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });
        
        // Create marker
        const marker = L.marker(coords, { icon: icon }).addTo(phMap);
        
        // Create popup content
        let popupContent = `<strong>${province.name}</strong><br>`;
        if (controlInfo) {
          popupContent += `Controlled by: ${controlInfo}<br>`;
        }
        if (province.control_duration_years) {
          popupContent += `Control duration: ${province.control_duration_years} years<br>`;
        }
        if (province.positions_held) {
          popupContent += `Positions held: ${province.positions_held}<br>`;
        }
        if (province.control_strength) {
          popupContent += `Control strength: ${province.control_strength}<br>`;
        }
        if (province.control_status) {
          popupContent += `Status: ${province.control_status}<br>`;
        }
        
        marker.bindPopup(popupContent);
        
        // Add click handler to show dynasty info
        marker.on('click', function() {
          if (controllingDynasty) {
            const dynasty = dynastiesData.nodes.dynasties.find(d => d.id === controllingDynasty);
            if (dynasty) {
              showInfoPanel(dynasty);
            }
          }
        });
        
        provinceMarkers.push(marker);
      });
      
      // Add legend for map
      const mapLegend = L.control({ position: 'bottomright' });
      mapLegend.onAdd = function() {
        const div = L.DomUtil.create('div', 'map-legend');
        div.innerHTML = `
          <h4 style="margin: 0 0 8px 0; font-size: 14px;">Province Control</h4>
          <div style="font-size: 12px;">
            <div style="margin: 4px 0;">
              <span style="display: inline-block; width: 15px; height: 15px; background: #0038A8; border-radius: 50%; border: 1px solid white; margin-right: 6px;"></span>
              Imperial Dynasty
            </div>
            <div style="margin: 4px 0;">
              <span style="display: inline-block; width: 15px; height: 15px; background: #CE1126; border-radius: 50%; border: 1px solid white; margin-right: 6px;"></span>
              Dominant Dynasty
            </div>
            <div style="margin: 4px 0;">
              <span style="display: inline-block; width: 15px; height: 15px; background: #FCD116; border-radius: 50%; border: 1px solid white; margin-right: 6px;"></span>
              Contested
            </div>
            <div style="margin: 4px 0; font-size: 10px; color: #666; margin-top: 8px;">
              Click markers for details
            </div>
          </div>
        `;
        return div;
      };
      mapLegend.addTo(phMap);
    }

  // Load data on page load
  loadDynastiesData();

  return {
    destroy() {
      ac.abort();
      try {
        if (network) {
          network.destroy();
          network = null;
        }
      } catch (_) {}
      try {
        if (phMap) {
          phMap.remove();
          phMap = null;
        }
      } catch (_) {}
      provinceMarkers = [];
      if (window.__OPENPINAS_DYNASTY_MAP__) {
        delete window.__OPENPINAS_DYNASTY_MAP__;
      }
    },
    closeInfoPanel,
    closeGlossaryPanel,
  };
}
