// Network visualization for corruption cases
let network = null;
let allNodes = [];
let allEdges = [];
let casesData = null;
let dynastiesData = null;

async function loadData() {
  try {
    // Load cases data
    const casesResponse = await fetch('data/pogo-corruption-cases-2025.json');
    casesData = await casesResponse.json();
    
    // Try to load dynasty data from OpenPinas
    try {
      const dynastiesResponse = await fetch('../philippine-political-dynasties-network-2025.json');
      dynastiesData = await dynastiesResponse.json();
    } catch (e) {
      console.log('Dynasty data not available, continuing without it');
      dynastiesData = null;
    }
    
    buildNetwork();
  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('network-container').innerHTML = 
      '<div style="padding: 40px; text-align: center; color: #c44900;">Error loading network data.</div>';
  }
}

function buildNetwork() {
  allNodes = [];
  allEdges = [];
  const nodeMap = new Map();
  
  // Add case nodes
  casesData.cases.forEach(caseItem => {
    const nodeId = `case_${caseItem.case_id}`;
    nodeMap.set(nodeId, {
      id: nodeId,
      label: caseItem.title.length > 30 ? caseItem.title.substring(0, 30) + '...' : caseItem.title,
      title: `${caseItem.title}\nStatus: ${caseItem.status}\nCategory: ${caseItem.category}`,
      color: {
        background: '#124559',
        border: '#0d3547',
        highlight: { background: '#1a5a73', border: '#0d3547' }
      },
      size: 25,
      shape: 'box',
      font: { size: 14, face: 'Source Sans Pro' },
      data: { type: 'case', case: caseItem }
    });
    
    // Add accused nodes and edges
    if (caseItem.accused) {
      caseItem.accused.forEach(accused => {
        const accusedId = `accused_${accused.name.replace(/\s+/g, '_')}`;
        
        if (!nodeMap.has(accusedId)) {
          nodeMap.set(accusedId, {
            id: accusedId,
            label: accused.name,
            title: `${accused.name}\nPosition: ${accused.position || 'N/A'}\nStatus: ${accused.status || 'N/A'}`,
            color: {
              background: '#c44900',
              border: '#8b3500',
              highlight: { background: '#d85a1a', border: '#8b3500' }
            },
            size: 20,
            shape: 'dot',
            font: { size: 12, face: 'Source Sans Pro' },
            data: { type: 'accused', accused: accused }
          });
        }
        
        // Edge from case to accused
        allEdges.push({
          id: `edge_${nodeId}_${accusedId}`,
          from: nodeId,
          to: accusedId,
          color: { color: '#124559', highlight: '#1a5a73' },
          width: 2,
          title: 'Accused in case'
        });
      });
    }
    
    // Add POGO operation nodes and edges
    if (caseItem.pogo_connections) {
      caseItem.pogo_connections.forEach(pogo => {
        const pogoId = `pogo_${pogo.company.replace(/\s+/g, '_')}`;
        
        if (!nodeMap.has(pogoId)) {
          nodeMap.set(pogoId, {
            id: pogoId,
            label: pogo.company.length > 25 ? pogo.company.substring(0, 25) + '...' : pogo.company,
            title: `${pogo.company}\nLocation: ${pogo.location || 'N/A'}\nStatus: ${pogo.status || 'N/A'}`,
            color: {
              background: '#f77f00',
              border: '#cc6600',
              highlight: { background: '#ff9933', border: '#cc6600' }
            },
            size: 18,
            shape: 'triangle',
            font: { size: 11, face: 'Source Sans Pro' },
            data: { type: 'pogo', pogo: pogo }
          });
        }
        
        // Edge from case to POGO
        allEdges.push({
          id: `edge_${nodeId}_${pogoId}`,
          from: nodeId,
          to: pogoId,
          color: { color: '#f77f00', highlight: '#ff9933' },
          width: 2,
          title: 'POGO connection'
        });
      });
    }
    
    // Add dynasty connections if available
    if (caseItem.dynasty_connections && caseItem.dynasty_connections.length > 0 && dynastiesData) {
      caseItem.dynasty_connections.forEach(dynastyId => {
        const dynastyNodeId = `dynasty_${dynastyId}`;
        const dynasty = dynastiesData.philippine_political_dynasties_network?.nodes?.dynasties?.find(
          d => d.id === dynastyId
        );
        
        if (dynasty && !nodeMap.has(dynastyNodeId)) {
          nodeMap.set(dynastyNodeId, {
            id: dynastyNodeId,
            label: dynasty.name.replace(/_/g, ' ').replace('FAMILY', '').trim(),
            title: `${dynasty.name}\nPower Level: ${dynasty.power_level || 'N/A'}`,
            color: {
              background: '#0b6e4f',
              border: '#055a45',
              highlight: { background: '#0d8a5f', border: '#055a45' }
            },
            size: 22,
            shape: 'diamond',
            font: { size: 12, face: 'Source Sans Pro' },
            data: { type: 'dynasty', dynasty: dynasty }
          });
        }
        
        if (dynasty) {
          allEdges.push({
            id: `edge_${nodeId}_${dynastyNodeId}`,
            from: nodeId,
            to: dynastyNodeId,
            color: { color: '#0b6e4f', highlight: '#0d8a5f' },
            width: 2,
            dashes: true,
            title: 'Dynasty connection'
          });
        }
      });
    }
  });
  
  // Convert map to array
  allNodes = Array.from(nodeMap.values());
  
  updateNetwork();
}

function updateNetwork() {
  const showCases = document.getElementById('showCases').checked;
  const showAccused = document.getElementById('showAccused').checked;
  const showDynasties = document.getElementById('showDynasties').checked;
  const showPOGO = document.getElementById('showPOGO').checked;
  
  // Filter nodes
  const filteredNodes = allNodes.filter(node => {
    const type = node.data.type;
    if (type === 'case' && !showCases) return false;
    if (type === 'accused' && !showAccused) return false;
    if (type === 'dynasty' && !showDynasties) return false;
    if (type === 'pogo' && !showPOGO) return false;
    return true;
  });
  
  // Filter edges to only include visible nodes
  const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = allEdges.filter(edge => 
    visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to)
  );
  
  const nodes = new vis.DataSet(filteredNodes);
  const edges = new vis.DataSet(filteredEdges);
  
  const data = { nodes: nodes, edges: edges };
  const options = {
    nodes: {
      font: { size: 12, face: 'Source Sans Pro' },
      borderWidth: 2,
      shadow: true
    },
    edges: {
      arrows: { to: { enabled: true, scaleFactor: 0.8 } },
      smooth: { type: 'continuous', roundness: 0.5 },
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
  
  const container = document.getElementById('network-container');
  network = new vis.Network(container, data, options);
  
  // Click event to show info
  network.on('click', function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = nodes.get(nodeId);
      showInfoPanel(node.data);
    } else {
      closeInfoPanel();
    }
  });
}

function showInfoPanel(data) {
  const panel = document.getElementById('infoPanel');
  const content = document.getElementById('infoContent');
  
  let html = '';
  
  if (data.type === 'case') {
    const caseItem = data.case;
    html = `<h3>${escapeHtml(caseItem.title)}</h3>`;
    html += `<p><strong>Status:</strong> ${formatStatus(caseItem.status)}</p>`;
    html += `<p><strong>Category:</strong> ${escapeHtml(caseItem.category)}</p>`;
    if (caseItem.location) {
      html += `<p><strong>Location:</strong> ${escapeHtml(caseItem.location.municipality || '')}, ${escapeHtml(caseItem.location.province || '')}</p>`;
    }
    html += `<p style="margin-top: 16px;"><a href="cases/${getCaseUrl(caseItem.case_id)}" style="color: var(--accent);">View full case →</a></p>`;
  } else if (data.type === 'accused') {
    const accused = data.accused;
    html = `<h3>${escapeHtml(accused.name)}</h3>`;
    if (accused.position) html += `<p><strong>Position:</strong> ${escapeHtml(accused.position)}</p>`;
    if (accused.status) html += `<p><strong>Status:</strong> ${escapeHtml(accused.status)}</p>`;
  } else if (data.type === 'pogo') {
    const pogo = data.pogo;
    html = `<h3>${escapeHtml(pogo.company)}</h3>`;
    if (pogo.location) html += `<p><strong>Location:</strong> ${escapeHtml(pogo.location)}</p>`;
    if (pogo.status) html += `<p><strong>Status:</strong> ${escapeHtml(pogo.status)}</p>`;
  } else if (data.type === 'dynasty') {
    const dynasty = data.dynasty;
    html = `<h3>${escapeHtml(dynasty.name.replace(/_/g, ' '))}</h3>`;
    if (dynasty.power_level) html += `<p><strong>Power Level:</strong> ${escapeHtml(dynasty.power_level)}</p>`;
    html += `<p style="margin-top: 16px;"><a href="../dynasties-network-visualization.html#${dynasty.id}" style="color: var(--accent);">View in OpenPinas →</a></p>`;
  }
  
  content.innerHTML = html;
  panel.classList.add('visible');
}

function closeInfoPanel() {
  document.getElementById('infoPanel').classList.remove('visible');
}

function formatStatus(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
document.getElementById('showCases').addEventListener('change', updateNetwork);
document.getElementById('showAccused').addEventListener('change', updateNetwork);
document.getElementById('showDynasties').addEventListener('change', updateNetwork);
document.getElementById('showPOGO').addEventListener('change', updateNetwork);
document.getElementById('resetView').addEventListener('click', () => {
  if (network) {
    network.fit();
  }
});
document.getElementById('fitNetwork').addEventListener('click', () => {
  if (network) {
    network.fit();
  }
});

// Load data on page load
loadData();

