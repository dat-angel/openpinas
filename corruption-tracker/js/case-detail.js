// Case detail page functionality
let caseData = null;

async function loadCaseDetail() {
  try {
    const response = await fetch('../data/pogo-corruption-cases-2025.json');
    const data = await response.json();
    
    // Get case ID from URL or default to Alice Guo
    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get('id') || 'ALICE_GUO_2024';
    
    caseData = data.cases.find(c => c.case_id === caseId);
    
    if (!caseData) {
      document.querySelector('main').innerHTML = 
        '<div class="empty">Case not found.</div>';
      return;
    }
    
    renderCaseDetail();
  } catch (error) {
    console.error('Error loading case detail:', error);
    document.querySelector('main').innerHTML = 
      '<div class="empty">Error loading case data. Please check the console for details.</div>';
  }
}

function renderCaseDetail() {
  if (!caseData) return;
  
  // Header
  document.getElementById('caseTitle').textContent = caseData.title;
  document.getElementById('caseSubtitle').textContent = 
    `${caseData.category} • ${formatStatus(caseData.status)}`;
  
  // Case header with status badge
  const statusClass = getStatusClass(caseData.status);
  const statusLabel = formatStatus(caseData.status);
  
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
    document.getElementById('politicalContent').innerHTML = caseData.political_connections.map(conn => `
      <div style="margin-bottom: 16px; padding: 12px; background: rgba(18, 69, 89, 0.05); border-radius: 8px;">
        <p style="margin: 4px 0;"><strong>Type:</strong> ${escapeHtml(conn.connection_type || 'N/A')}</p>
        <p style="margin: 4px 0;">${escapeHtml(conn.description || '')}</p>
        ${conn.details ? `<p style="margin: 4px 0; color: var(--muted); font-size: 14px;">${escapeHtml(conn.details)}</p>` : ''}
        ${conn.dynasty ? `<p style="margin: 4px 0; color: var(--muted); font-size: 14px;"><strong>Dynasty:</strong> ${escapeHtml(conn.dynasty)}</p>` : ''}
      </div>
    `).join('');
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
  
  // Sources
  if (caseData.sources) {
    let sourcesHtml = '';
    if (caseData.sources.news && caseData.sources.news.length > 0) {
      sourcesHtml += '<h3 style="margin-top: 0;">News Sources</h3><ul>';
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
      sourcesHtml += '<h3>Senate Sources</h3><ul>';
      caseData.sources.senate.forEach(source => {
        sourcesHtml += `<li>${escapeHtml(source)}</li>`;
      });
      sourcesHtml += '</ul>';
    }
    if (caseData.sources.nbi && caseData.sources.nbi.length > 0) {
      sourcesHtml += '<h3>NBI Sources</h3><ul>';
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
  document.addEventListener('DOMContentLoaded', loadCaseDetail);
} else {
  loadCaseDetail();
}

