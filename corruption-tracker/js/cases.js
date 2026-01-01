// Case list functionality
let allCases = [];
let filteredCases = [];

async function loadCases() {
  try {
    const response = await fetch('../data/pogo-corruption-cases-2025.json');
    const data = await response.json();
    allCases = data.cases || [];
    filteredCases = [...allCases];
    renderCaseList();
    renderStatistics(data.statistics);
  } catch (error) {
    console.error('Error loading cases:', error);
    document.querySelector('.case-list').innerHTML = 
      '<div class="empty">Error loading case data. Please check the console for details.</div>';
  }
}

function getFilters() {
  const searchQuery = document.getElementById('search')?.value.trim().toLowerCase() || '';
  const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
  const statusFilter = document.getElementById('statusFilter')?.value || 'all';
  const yearFilter = document.getElementById('yearFilter')?.value || 'all';
  
  return { searchQuery, categoryFilter, statusFilter, yearFilter };
}

function applyFilters() {
  const { searchQuery, categoryFilter, statusFilter, yearFilter } = getFilters();
  
  filteredCases = allCases.filter(caseItem => {
    // Search filter
    if (searchQuery) {
      const searchable = [
        caseItem.title,
        caseItem.case_id,
        ...(caseItem.accused?.map(a => a.name) || []),
        ...(caseItem.charges || []),
        caseItem.location?.municipality || '',
        caseItem.location?.province || ''
      ].join(' ').toLowerCase();
      
      if (!searchable.includes(searchQuery)) {
        return false;
      }
    }
    
    // Category filter
    if (categoryFilter !== 'all' && caseItem.category !== categoryFilter) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      const normalizedStatus = caseItem.status.toLowerCase().replace(/_/g, '');
      const filterStatus = statusFilter.toLowerCase().replace(/_/g, '');
      if (!normalizedStatus.includes(filterStatus)) {
        return false;
      }
    }
    
    // Year filter
    if (yearFilter !== 'all') {
      const caseYear = new Date(caseItem.filing_date).getFullYear().toString();
      if (caseYear !== yearFilter) {
        return false;
      }
    }
    
    return true;
  });
  
  renderCaseList();
}

function renderCaseList() {
  const container = document.querySelector('.case-list');
  if (!container) return;
  
  if (filteredCases.length === 0) {
    container.innerHTML = '<div class="empty">No cases match your filters.</div>';
    return;
  }
  
  container.innerHTML = filteredCases.map(caseItem => {
    const statusClass = getStatusClass(caseItem.status);
    const statusLabel = formatStatus(caseItem.status);
    const filingDate = formatDate(caseItem.filing_date);
    const caseUrl = getCaseUrl(caseItem.case_id);
    
    return `
      <a href="${caseUrl}" class="case-card">
        <h3>${escapeHtml(caseItem.title)}</h3>
        <div class="case-meta">
          <span class="status-badge ${statusClass}">${statusLabel}</span>
          <span class="category-tag">${escapeHtml(caseItem.category)}</span>
          <span>Filed: ${filingDate}</span>
          ${caseItem.location ? `<span>📍 ${escapeHtml(caseItem.location.municipality || caseItem.location.province || '')}</span>` : ''}
        </div>
        ${caseItem.significance ? `<p style="margin-top: 12px; color: var(--muted); font-size: 14px;">${escapeHtml(caseItem.significance.substring(0, 150))}${caseItem.significance.length > 150 ? '...' : ''}</p>` : ''}
      </a>
    `;
  }).join('');
}

function renderStatistics(stats) {
  if (!stats) return;
  
  const statsSection = document.getElementById('statistics');
  if (!statsSection) return;
  
  const totalCases = stats.total_cases || 0;
  const byStatus = stats.by_status || {};
  const byCategory = stats.by_category || {};
  const victims = stats.human_trafficking_victims || 0;
  const totalAmount = stats.total_amount_php || 0;
  
  let html = `
      <div class="section">
      <h2>By the Numbers</h2>
      
      <div class="stats" style="margin: 24px 0;">
        <div class="stat">
          <p class="number">${totalCases}</p>
          <p class="label">Total Cases</p>
        </div>
        <div class="stat">
          <p class="number">${byStatus.ongoing_investigation || 0}</p>
          <p class="label">Ongoing</p>
        </div>
        <div class="stat">
          <p class="number">${byStatus.convicted || 0}</p>
          <p class="label">Convicted</p>
        </div>
        <div class="stat">
          <p class="number">${victims > 0 ? victims.toLocaleString() : '0'}</p>
          <p class="label">Trafficking Victims</p>
        </div>
      </div>
      
      <div style="margin-top: 32px;">
        <h3 style="color: var(--accent); margin-bottom: 16px;">By Status</h3>
        <div style="display: grid; gap: 12px;">
          ${Object.entries(byStatus).map(([status, count]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(18, 69, 89, 0.05); border-radius: 8px;">
              <span style="font-weight: 500;">${formatStatus(status)}</span>
              <span style="font-size: 18px; font-weight: 600; color: var(--accent);">${count}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="margin-top: 32px;">
        <h3 style="color: var(--accent); margin-bottom: 16px;">By Type</h3>
        <div style="display: grid; gap: 12px;">
          ${Object.entries(byCategory).map(([category, count]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(18, 69, 89, 0.05); border-radius: 8px;">
              <span style="font-weight: 500;">${escapeHtml(category)}</span>
              <span style="font-size: 18px; font-weight: 600; color: var(--accent);">${count}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      ${totalAmount > 0 ? `
        <div style="margin-top: 32px; padding: 20px; background: rgba(196, 73, 0, 0.1); border-left: 4px solid var(--accent-2); border-radius: 8px;">
          <h3 style="color: var(--accent-2); margin: 0 0 8px;">Money Involved</h3>
          <p style="font-size: 24px; font-weight: 700; margin: 0; color: var(--accent-2);">
            ${formatAmount(totalAmount)}
          </p>
        </div>
      ` : ''}
    </div>
  `;
  
  statsSection.innerHTML = html;
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

function getCaseUrl(caseId) {
  // Map case IDs to URLs
  if (caseId === 'ALICE_GUO_2024') {
    return 'alice-guo.html';
  }
  // For other cases, create a generic detail page
  return `case-${caseId.toLowerCase().replace(/_/g, '-')}.html`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize filters
function initializeFilters() {
  const searchInput = document.getElementById('search');
  const categoryFilter = document.getElementById('categoryFilter');
  const statusFilter = document.getElementById('statusFilter');
  const yearFilter = document.getElementById('yearFilter');
  
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }
  if (statusFilter) {
    statusFilter.addEventListener('change', applyFilters);
  }
  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilters);
  }
  
  // Populate year filter
  if (yearFilter && allCases.length > 0) {
    const years = [...new Set(allCases.map(c => new Date(c.filing_date).getFullYear()))].sort((a, b) => b - a);
    yearFilter.innerHTML = '<option value="all">All Years</option>' + 
      years.map(year => `<option value="${year}">${year}</option>`).join('');
  }
}

// Load cases when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadCases();
    initializeFilters();
  });
} else {
  loadCases();
  initializeFilters();
}

