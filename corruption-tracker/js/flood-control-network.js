// Flood Control Corruption Network Visualization
// Follow the Money - Network showing connections between politicians, contractors, and DPWH officials

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
    
    // Find flood control case
    const floodControlCase = casesData.cases.find(c => c.case_id === 'FLOOD_CONTROL_2025');
    
    if (!floodControlCase) {
      document.getElementById('network-container').innerHTML = 
        '<div style="padding: 40px; text-align: center; color: #c44900;">Flood control case data not found.</div>';
      return;
    }
    
    // Try to load dynasty data from OpenPinas
    try {
      const dynastiesResponse = await fetch('../philippine-political-dynasties-network-2025.json');
      dynastiesData = await dynastiesResponse.json();
    } catch (e) {
      console.log('Dynasty data not available, continuing without it');
      dynastiesData = null;
    }
    
    buildNetwork(floodControlCase);
  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('network-container').innerHTML = 
      '<div style="padding: 40px; text-align: center; color: #c44900;">Error loading network data.</div>';
  }
}

function buildNetwork(floodControlCase) {
  allNodes = [];
  allEdges = [];
  const nodeMap = new Map();
  
  // Add case node
  const caseId = `case_${floodControlCase.case_id}`;
  nodeMap.set(caseId, {
    id: caseId,
    label: 'Flood Control Corruption',
    title: `Flood Control Projects Corruption Scandal\nAmount: ₱118.5 billion\nStatus: ${floodControlCase.status}`,
    color: {
      background: '#1a5a73',
      border: '#0d3547',
      highlight: { background: '#2a7a93', border: '#0d3547' }
    },
    size: 35,
    shape: 'box',
    font: { size: 17, face: 'Source Sans Pro', bold: true, color: '#FFFFFF', strokeWidth: 2, strokeColor: '#FFFFFF' },
    data: { type: 'case', case: floodControlCase }
  });
  
  // Add accused nodes
  if (floodControlCase.accused) {
    floodControlCase.accused.forEach(accused => {
      const accusedId = `accused_${accused.name.replace(/\s+/g, '_')}`;
      const isPolitician = accused.position && (accused.position.includes('Speaker') || accused.position.includes('Senate') || accused.position.includes('Congress'));
      const isDPWH = accused.position && accused.position.includes('DPWH');
      const isContractor = accused.position === 'Contractor';
      
      let nodeColor = '#c44900'; // Default politician/official
      if (isDPWH) nodeColor = '#8b008b';
      else if (isContractor) nodeColor = '#f77f00';
      
      nodeMap.set(accusedId, {
        id: accusedId,
        label: accused.name,
        title: `${accused.name}\nPosition: ${accused.position || 'N/A'}\nStatus: ${accused.current_status || accused.status || 'N/A'}\nDynasty: ${accused.dynasty_connection || 'None'}`,
        color: {
          background: nodeColor,
          border: nodeColor === '#c44900' ? '#8b3500' : nodeColor === '#8b008b' ? '#5a005a' : '#cc6600',
          highlight: { 
            background: nodeColor === '#c44900' ? '#d85a1a' : nodeColor === '#8b008b' ? '#aa00aa' : '#ff9900', 
            border: nodeColor === '#c44900' ? '#8b3500' : nodeColor === '#8b008b' ? '#5a005a' : '#cc6600'
          }
        },
        size: isPolitician || accused.name.includes('Romualdez') || accused.name.includes('Escudero') ? 25 : 20,
        shape: 'dot',
        font: { size: 13, face: 'Source Sans Pro', bold: true, color: '#FFFFFF', strokeWidth: 2, strokeColor: '#000000' },
        data: { type: 'accused', accused: accused }
      });
      
      // Edge from case to accused
      allEdges.push({
        id: `edge_${caseId}_${accusedId}`,
        from: caseId,
        to: accusedId,
        color: { color: '#1a5a73', highlight: '#2a7a93' },
        width: 3,
        title: 'Involved in case'
      });
      
      // Add dynasty connections
      if (accused.dynasty_connection && dynastiesData) {
        const dynastyId = `dynasty_${accused.dynasty_connection.replace(/\s+/g, '_')}`;
        
        if (!nodeMap.has(dynastyId)) {
          nodeMap.set(dynastyId, {
            id: dynastyId,
            label: accused.dynasty_connection,
            title: `${accused.dynasty_connection} Dynasty`,
            color: {
              background: '#0b6e4f',
              border: '#065a42',
              highlight: { background: '#0d8a63', border: '#065a42' }
            },
            size: 22,
            shape: 'diamond',
            font: { size: 12, face: 'Source Sans Pro', bold: true, color: '#FFFFFF', strokeWidth: 2, strokeColor: '#000000' },
            data: { type: 'dynasty', dynasty: accused.dynasty_connection }
          });
        }
        
        // Edge from accused to dynasty
        allEdges.push({
          id: `edge_${accusedId}_${dynastyId}`,
          from: accusedId,
          to: dynastyId,
          color: { color: '#0b6e4f', highlight: '#0d8a63', dash: true },
          width: 2,
          title: 'Dynasty connection'
        });
      }
    });
  }
  
  // Add money flow edges (contractors to politicians/officials)
  const contractors = floodControlCase.accused.filter(a => a.position === 'Contractor');
  const politicians = floodControlCase.accused.filter(a => 
    a.position && (a.position.includes('Speaker') || a.position.includes('Senate') || a.position.includes('Congress') || a.position.includes('DPWH'))
  );
  
  contractors.forEach(contractor => {
    const contractorId = `accused_${contractor.name.replace(/\s+/g, '_')}`;
    politicians.forEach(politician => {
      const politicianId = `accused_${politician.name.replace(/\s+/g, '_')}`;
      allEdges.push({
        id: `money_${contractorId}_${politicianId}`,
        from: contractorId,
        to: politicianId,
        color: { color: '#c44900', highlight: '#d85a1a', dash: true },
        width: 2,
        title: 'Money flow / Kickback (alleged)',
        arrows: { to: { enabled: true, scaleFactor: 1.2 } }
      });
    });
  });
  
  // Convert map to array
  allNodes = Array.from(nodeMap.values());
  
  // Create network
  const container = document.getElementById('network-container');
  const data = { nodes: allNodes, edges: allEdges };
  
  const options = {
    nodes: {
      borderWidth: 3,
      shadow: true,
      font: {
        size: 13,
        face: 'Source Sans Pro',
        bold: true,
        color: '#FFFFFF',
        strokeWidth: 2,
        strokeColor: '#FFFFFF'
      }
    },
    edges: {
      smooth: {
        type: 'continuous',
        roundness: 0.5
      },
      shadow: true,
      arrows: {
        to: {
          enabled: false
        }
      }
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
      tooltipDelay: 100,
      zoomView: true,
      dragView: true
    }
  };
  
  network = new vis.Network(container, data, options);
  
  // Event handlers
  network.on('click', function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = allNodes.find(n => n.id === nodeId);
      if (node) {
        showInfoPanel(node);
      }
    } else {
      closeInfoPanel();
    }
  });
  
  // Control buttons
  document.getElementById('resetView').onclick = function() {
    network.setOptions({ physics: { enabled: true } });
    setTimeout(() => {
      network.setOptions({ physics: { enabled: false } });
    }, 1000);
  };
  
  document.getElementById('fitNetwork').onclick = function() {
    network.fit({ animation: true });
  };
  
  document.getElementById('highlightMoney').onclick = function() {
    highlightEdges('money');
  };
  
  document.getElementById('highlightDynasties').onclick = function() {
    highlightNodes('dynasty');
  };
}

function showInfoPanel(node) {
  const panel = document.getElementById('infoPanel');
  const content = document.getElementById('infoContent');
  
  let html = '';
  
  if (node.data.type === 'case') {
    const caseData = node.data.case;
    html = `
      <h3>${caseData.title}</h3>
      <p><strong>Amount Involved:</strong> <span class="money-amount">₱${formatMoney(caseData.amount_involved_php)}</span></p>
      <p><strong>Status:</strong> ${caseData.status}</p>
      <p><strong>Category:</strong> ${caseData.category}</p>
      <p><strong>Location:</strong> ${caseData.location.municipality}, ${caseData.location.province}</p>
      <p><strong>Timeline:</strong> ${caseData.timeline.length} events</p>
      <p><strong>Accused:</strong> ${caseData.accused.length} individuals/entities</p>
    `;
  } else if (node.data.type === 'accused') {
    const accused = node.data.accused;
    html = `
      <h3>${accused.name}</h3>
      <p><strong>Position:</strong> ${accused.position || 'N/A'}</p>
      <p><strong>Status:</strong> ${accused.current_status || accused.status || 'N/A'}</p>
      ${accused.dynasty_connection ? `<p><strong>Dynasty:</strong> ${accused.dynasty_connection}</p>` : ''}
      ${accused.charges ? `<p><strong>Charges:</strong> ${accused.charges.join(', ')}</p>` : ''}
    `;
  } else if (node.data.type === 'dynasty') {
    html = `
      <h3>${node.data.dynasty} Dynasty</h3>
      <p>Political dynasty connection. See <a href="../../dynasties/" target="_blank">OpenPinas Dynasties</a> for more details.</p>
    `;
  }
  
  content.innerHTML = html;
  panel.classList.add('visible');
}

function closeInfoPanel() {
  document.getElementById('infoPanel').classList.remove('visible');
}

function highlightEdges(type) {
  // Reset all edges
  const edges = allEdges.map(e => ({
    ...e,
    color: e.color.color || '#ccc',
    width: 2
  }));
  
  // Highlight specific edges
  if (type === 'money') {
    edges.forEach(e => {
      if (e.id.startsWith('money_')) {
        e.color = '#c44900';
        e.width = 4;
      } else {
        e.color = '#e5e5e5';
        e.width = 1;
      }
    });
  }
  
  network.setData({ nodes: allNodes, edges: edges });
}

function highlightNodes(type) {
  const nodes = allNodes.map(n => ({ ...n }));
  
  if (type === 'dynasty') {
    nodes.forEach(n => {
      if (n.data.type === 'dynasty') {
        n.size = 30;
        n.font.size = 14;
      } else {
        n.size = n.size * 0.7;
        n.font.size = Math.max(10, n.font.size - 2);
      }
    });
  }
  
  network.setData({ nodes: nodes, edges: allEdges });
}

function formatMoney(amount) {
  if (!amount) return 'N/A';
  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(1) + 'B';
  } else if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'K';
  }
  return amount.toLocaleString();
}

// Load data on page load
loadData();
