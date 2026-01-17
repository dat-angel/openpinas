// Case detail page functionality
let caseData = null;

async function loadCaseDetail() {
  try {
    // Determine the correct path based on current location
    const currentPath = window.location.pathname;
    let dataPath = '../data/pogo-corruption-cases-2025.json';
    
    // If we're in a cases/ subdirectory, go up one level to data/
    // If we're at root, use absolute path
    if (currentPath.includes('/cases/')) {
      dataPath = '../data/pogo-corruption-cases-2025.json';
    } else if (currentPath.includes('/corruption-tracker/')) {
      dataPath = 'data/pogo-corruption-cases-2025.json';
    } else {
      dataPath = 'corruption-tracker/data/pogo-corruption-cases-2025.json';
    }
    
    const response = await fetch(dataPath);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText} from ${dataPath}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.cases) {
      throw new Error('Invalid data structure: missing cases array');
    }
    
    // Get case ID from URL or default to Alice Guo
    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get('id') || (window.CASE_ID || 'ALICE_GUO_2024');
    
    console.log('Loading case:', caseId);
    console.log('Available cases:', data.cases.map(c => c.case_id));
    
    caseData = data.cases.find(c => c.case_id === caseId);
    
    if (!caseData) {
      console.error('Case not found:', caseId);
      const availableCases = data.cases.map(c => c.case_id).join(', ');
      document.querySelector('main').innerHTML = 
        `<div class="empty">
          <p><strong>Case not found:</strong> ${caseId}</p>
          <p style="margin-top: 12px; font-size: 14px;">Available cases: ${availableCases}</p>
        </div>`;
      return;
    }
    
    renderCaseDetail();
  } catch (error) {
    console.error('Error loading case detail:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      pathname: window.location.pathname,
      caseId: window.CASE_ID || new URLSearchParams(window.location.search).get('id')
    });
    
    const errorMessage = error.message || 'Unknown error';
    document.querySelector('main').innerHTML = 
      `<div class="empty">
        <p><strong>Error loading case data:</strong> ${errorMessage}</p>
        <p style="margin-top: 12px; font-size: 14px;">Please check the browser console for more details.</p>
      </div>`;
  }
}

function renderCaseDetail() {
  if (!caseData) return;
  
  // Header
  document.getElementById('caseTitle').textContent = `OpenPinas: ${caseData.title}`;
  document.getElementById('caseSubtitle').textContent = 
    `${caseData.category} • ${formatStatus(caseData.status)}`;
  
  // Update page title
  document.title = `OpenPinas: ${caseData.title} - Corruption Tracker`;
  
  // Case header with status badge
  const statusClass = getStatusClass(caseData.status);
  const statusLabel = formatStatus(caseData.status);
  const timelineSearchUrl = `../../interactive-timeline/?search=${encodeURIComponent(caseData.title)}`;

  document.getElementById('caseHeaderContent').innerHTML = `
    <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center; margin-bottom: 16px;">
      <span class="status-badge ${statusClass}">${statusLabel}</span>
      <span class="category-tag">${escapeHtml(caseData.category)}</span>
      ${caseData.priority === 'high' ? '<span style="background: var(--accent-2); color: white; padding: 4px 10px; border-radius: 999px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 600;">High Priority</span>' : ''}
    </div>
    <div class="meta">
      <span><strong>Filed:</strong> ${formatDate(caseData.filing_date)}</span>
      <span><strong>Court/Agency:</strong> ${escapeHtml(caseData.court_agency || 'N/A')}</span>
      ${caseData.location ? `<span><strong>Location:</strong> ${escapeHtml(caseData.location.municipality || '')}, ${escapeHtml(caseData.location.province || '')}</span>` : ''}
      ${caseData.last_updated ? `<span><strong>Last Updated:</strong> ${formatDate(caseData.last_updated)}</span>` : ''}
    </div>
    <div style="margin-top: 16px; font-size: 14px;">
      <a href="${timelineSearchUrl}" style="color: #0038A8; text-decoration: underline; text-underline-offset: 2px;">View related events in 2025 Timeline →</a>
    </div>
  `;
  
  // Key facts
  const facts = [];
  if (caseData.filing_date) {
    facts.push({ label: 'Filing Date', value: formatDate(caseData.filing_date) });
  }
  if (caseData.status) {
    facts.push({ label: 'Status', value: formatStatus(caseData.status) });
  }
  if (caseData.court_agency) {
    facts.push({ label: 'Court/Agency', value: caseData.court_agency });
  }
  if (caseData.location) {
    facts.push({ label: 'Location', value: `${caseData.location.municipality || ''}, ${caseData.location.province || ''}` });
  }
  if (caseData.amount_involved_php) {
    facts.push({ label: 'Amount Involved', value: formatAmount(caseData.amount_involved_php) });
  }
  if (caseData.human_trafficking_victims) {
    facts.push({ label: 'Trafficking Victims', value: caseData.human_trafficking_victims.toLocaleString() });
  }
  
  document.getElementById('keyFacts').innerHTML = facts.map(fact => `
    <div class="fact-box">
      <div class="label">${fact.label}</div>
      <div class="value">${fact.value}</div>
    </div>
  `).join('');
  
  // Timeline
  if (caseData.timeline && caseData.timeline.length > 0) {
    renderCaseTimeline(caseData.timeline, 'caseTimeline');
  }
  
  // Accused parties
  if (caseData.accused && caseData.accused.length > 0) {
    document.getElementById('accusedContent').innerHTML = caseData.accused.map(accused => `
      <div style="margin-bottom: 20px; padding: 16px; background: rgba(18, 69, 89, 0.05); border-radius: 8px; border-left: 3px solid var(--accent);">
        <h3 style="margin: 0 0 8px; color: var(--accent);">${escapeHtml(accused.name)}</h3>
        ${accused.aliases && accused.aliases.length > 0 ? `<p style="margin: 4px 0; color: var(--muted); font-size: 14px;"><strong>Aliases:</strong> ${accused.aliases.join(', ')}</p>` : ''}
        ${accused.position ? `<p style="margin: 4px 0;"><strong>Position:</strong> ${escapeHtml(accused.position)}</p>` : ''}
        ${accused.position_dates ? `<p style="margin: 4px 0; color: var(--muted); font-size: 14px;">${escapeHtml(accused.position_dates)}</p>` : ''}
        ${accused.nationality_claimed || accused.nationality_alleged ? `
          <p style="margin: 4px 0; color: var(--muted); font-size: 14px;">
            <strong>Nationality:</strong> Claimed: ${accused.nationality_claimed || 'N/A'}, 
            Alleged: ${accused.nationality_alleged || 'N/A'}
          </p>
        ` : ''}
        ${accused.current_status ? `<p style="margin: 4px 0;"><strong>Current Status:</strong> ${escapeHtml(accused.current_status)}</p>` : ''}
        ${accused.status ? `<p style="margin: 4px 0; color: var(--muted); font-size: 14px;"><strong>Case Status:</strong> ${escapeHtml(accused.status)}</p>` : ''}
      </div>
    `).join('');
  } else {
    document.getElementById('accusedSection').style.display = 'none';
  }
  
  // POGO connections
  if (caseData.pogo_connections && caseData.pogo_connections.length > 0) {
    document.getElementById('pogoContent').innerHTML = caseData.pogo_connections.map(conn => `
      <div style="margin-bottom: 20px; padding: 16px; background: rgba(18, 69, 89, 0.05); border-radius: 8px; border-left: 3px solid var(--accent);">
        <h3 style="margin: 0 0 8px; color: var(--accent);">${escapeHtml(conn.company)}</h3>
        <p style="margin: 4px 0;"><strong>Location:</strong> ${escapeHtml(conn.location || 'N/A')}</p>
        <p style="margin: 4px 0;"><strong>Connection Type:</strong> ${escapeHtml(conn.connection_type || 'N/A')}</p>
        <p style="margin: 4px 0;">${escapeHtml(conn.description || '')}</p>
        ${conn.status ? `<p style="margin: 4px 0;"><strong>Status:</strong> ${escapeHtml(conn.status)}</p>` : ''}
        ${conn.date_raided ? `<p style="margin: 4px 0;"><strong>Date Raided:</strong> ${formatDate(conn.date_raided)}</p>` : ''}
        ${conn.victims_rescued ? `<p style="margin: 4px 0; color: var(--accent-2);"><strong>Victims Rescued:</strong> ${conn.victims_rescued.toLocaleString()}</p>` : ''}
        ${conn.permit_issued_by ? `<p style="margin: 4px 0; color: var(--muted); font-size: 14px;"><strong>Permit Issued By:</strong> ${escapeHtml(conn.permit_issued_by)}</p>` : ''}
        ${conn.license_status ? `<p style="margin: 4px 0; color: var(--muted); font-size: 14px;"><strong>License Status:</strong> ${escapeHtml(conn.license_status)}</p>` : ''}
      </div>
    `).join('');
  } else {
    document.getElementById('pogoSection').style.display = 'none';
  }
  
  // Charges
  if (caseData.charges && caseData.charges.length > 0) {
    document.getElementById('chargesContent').innerHTML = `
      <ul>
        ${caseData.charges.map(charge => `<li>${escapeHtml(charge)}</li>`).join('')}
      </ul>
    `;
  } else {
    document.getElementById('chargesSection').style.display = 'none';
  }
  
  // Political connections
  if (caseData.political_connections && caseData.political_connections.length > 0) {
    document.getElementById('politicalContent').innerHTML = caseData.political_connections.map(conn => {
      // Create dynasty link if dynasty is mentioned
      const dynastyLink = conn.dynasty
        ? `<p style="margin: 4px 0; color: var(--muted); font-size: 14px;"><strong>Dynasty:</strong> <a href="../../dynasties-network-visualization.html#${encodeURIComponent(conn.dynasty.replace(/ /g, '_'))}" style="color: #0038A8; text-decoration: underline;">${escapeHtml(conn.dynasty)}</a></p>`
        : '';

      return `
        <div style="margin-bottom: 16px; padding: 12px; background: rgba(18, 69, 89, 0.05); border-radius: 8px;">
          <p style="margin: 4px 0;"><strong>Type:</strong> ${escapeHtml(conn.connection_type || 'N/A')}</p>
          <p style="margin: 4px 0;">${escapeHtml(conn.description || '')}</p>
          ${conn.details ? `<p style="margin: 4px 0; color: var(--muted); font-size: 14px;">${escapeHtml(conn.details)}</p>` : ''}
          ${dynastyLink}
        </div>
      `;
    }).join('');
  } else {
    document.getElementById('politicalSection').style.display = 'none';
  }
  
  // Significance
  if (caseData.significance || caseData.diaspora_impact) {
    let html = '';
    if (caseData.significance) {
      html += `<p><strong>Significance:</strong> ${escapeHtml(caseData.significance)}</p>`;
    }
    if (caseData.diaspora_impact) {
      html += `<p style="margin-top: 16px; padding: 12px; background: rgba(18, 69, 89, 0.05); border-left: 3px solid var(--accent);"><strong>Diaspora Impact:</strong> ${escapeHtml(caseData.diaspora_impact)}</p>`;
    }
    document.getElementById('significanceContent').innerHTML = html;
  } else {
    document.getElementById('significanceSection').style.display = 'none';
  }
  
  // Related cases
  if (caseData.related_cases && caseData.related_cases.length > 0) {
    // This would need to load all cases to find related ones
    // For now, show the related case IDs
    const relatedSection = document.createElement('div');
    relatedSection.className = 'section';
    relatedSection.id = 'relatedSection';
    relatedSection.innerHTML = `
      <h2>Related Cases</h2>
      <div style="display: grid; gap: 12px;">
        ${caseData.related_cases.map(caseId => {
          const relatedCase = allCases.find(c => c.case_id === caseId);
          if (relatedCase) {
            const url = getCaseUrl(relatedCase.case_id);
            return `
              <a href="${url}" style="display: block; padding: 12px; background: rgba(18, 69, 89, 0.05); border-radius: 8px; border-left: 3px solid var(--accent); text-decoration: none; color: inherit;">
                <strong style="color: var(--accent);">${escapeHtml(relatedCase.title)}</strong>
                <p style="margin: 4px 0 0; font-size: 13px; color: var(--muted);">${escapeHtml(relatedCase.category)} • ${formatStatus(relatedCase.status)}</p>
              </a>
            `;
          }
          return '';
        }).filter(h => h).join('')}
      </div>
    `;
    document.getElementById('significanceSection').insertAdjacentElement('afterend', relatedSection);
  }
  
  // Sources
  if (caseData.sources) {
    let sourcesHtml = '';
    if (caseData.sources.news && caseData.sources.news.length > 0) {
      sourcesHtml += '<h3 style="margin-top: 0;">News</h3><ul>';
      caseData.sources.news.forEach(source => {
        if (source && source.startsWith('http')) {
          sourcesHtml += `<li><a href="${source}" target="_blank" rel="noopener" class="source-link">${source}</a></li>`;
        } else if (source) {
          sourcesHtml += `<li>${escapeHtml(source)}</li>`;
        }
      });
      sourcesHtml += '</ul>';
    }
    if (caseData.sources.senate && caseData.sources.senate.length > 0) {
      sourcesHtml += '<h3>Senate</h3><ul>';
      caseData.sources.senate.forEach(source => {
        sourcesHtml += `<li>${escapeHtml(source)}</li>`;
      });
      sourcesHtml += '</ul>';
    }
    if (caseData.sources.nbi && caseData.sources.nbi.length > 0) {
      sourcesHtml += '<h3>NBI</h3><ul>';
      caseData.sources.nbi.forEach(source => {
        sourcesHtml += `<li>${escapeHtml(source)}</li>`;
      });
      sourcesHtml += '</ul>';
    }
    document.getElementById('sourcesContent').innerHTML = sourcesHtml || '<p>No sources available.</p>';
  } else {
    document.getElementById('sourcesSection').style.display = 'none';
  }
}

// Load all cases for related cases lookup
let allCases = [];
async function loadAllCases() {
  try {
    // Use same path detection as loadCaseDetail
    const currentPath = window.location.pathname;
    let dataPath = '../data/pogo-corruption-cases-2025.json';
    
    if (currentPath.includes('/cases/')) {
      dataPath = '../data/pogo-corruption-cases-2025.json';
    } else if (currentPath.includes('/corruption-tracker/')) {
      dataPath = 'data/pogo-corruption-cases-2025.json';
    } else {
      dataPath = 'corruption-tracker/data/pogo-corruption-cases-2025.json';
    }
    
    const response = await fetch(dataPath);
    if (!response.ok) {
      console.warn('Failed to load all cases for related cases lookup');
      return;
    }
    const data = await response.json();
    allCases = data.cases || [];
  } catch (error) {
    console.error('Error loading all cases:', error);
  }
}

function getCaseUrl(caseId) {
  if (caseId === 'ALICE_GUO_2024') {
    return 'alice-guo.html';
  }
  return `case-${caseId.toLowerCase().replace(/_/g, '-')}.html`;
}

function getStatusClass(status) {
  const s = status.toLowerCase();
  if (s.includes('ongoing') || s.includes('investigation')) return 'ongoing';
  if (s.includes('convicted')) return 'convicted';
  if (s.includes('dismissed') || s.includes('acquitted')) return 'dismissed';
  if (s.includes('filed') || s.includes('trial')) return 'filed';
  return 'ongoing';
}

function formatStatus(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatAmount(amount) {
  if (amount >= 1000000000) {
    return '₱' + (amount / 1000000000).toFixed(1) + ' Billion';
  } else if (amount >= 1000000) {
    return '₱' + (amount / 1000000).toFixed(1) + ' Million';
  } else if (amount >= 1000) {
    return '₱' + (amount / 1000).toFixed(1) + ' Thousand';
  }
  return '₱' + amount.toLocaleString();
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load case detail when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await loadAllCases();
    loadCaseDetail();
  });
} else {
  (async () => {
    await loadAllCases();
    loadCaseDetail();
  })();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  // Press 'k' to go back
  if (e.key === 'k' && !e.target.matches('input, textarea, select')) {
    const backLink = document.querySelector('footer a[href="../"]') || document.querySelector('footer a[href="index.html"]');
    if (backLink) {
      backLink.click();
    }
  }
  // Press '/' to focus search (if on list page)
  if (e.key === '/' && !e.target.matches('input, textarea, select')) {
    const searchInput = document.getElementById('search');
    if (searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  }
});

