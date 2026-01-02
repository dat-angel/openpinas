// Case list functionality
let allCases = [];
let filteredCases = [];

async function loadCases() {
  try {
    const response = await fetch('../data/pogo-corruption-cases-2025.json');
    const data = await response.json();
    allCases = data.cases || [];
    filteredCases = [...allCases];
    
    // Load filters from URL parameters
    loadFiltersFromURL();
    
    renderCaseList();
    renderStatistics(data.statistics);
  } catch (error) {
    console.error('Error loading cases:', error);
    document.querySelector('.case-list').innerHTML = 
      '<div class="empty">Error loading case data. Please check the console for details.</div>';
  }
}

function loadFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  const search = params.get('search');
  const category = params.get('category');
  const status = params.get('status');
  const year = params.get('year');
  const dynasty = params.get('dynasty');
  
  if (search) {
    const searchInput = document.getElementById('search');
    if (searchInput) searchInput.value = search;
  }
  if (category) {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) categoryFilter.value = category;
  }
  if (status) {
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) statusFilter.value = status;
  }
  if (year) {
    const yearFilter = document.getElementById('yearFilter');
    if (yearFilter) yearFilter.value = year;
  }
  if (dynasty) {
    const dynastyFilter = document.getElementById('dynastyFilter');
    if (dynastyFilter) dynastyFilter.value = dynasty;
  }
}

function updateURL() {
  const { searchQuery, categoryFilter, statusFilter, yearFilter, dynastyFilter } = getFilters();
  const params = new URLSearchParams();
  
  if (searchQuery) params.set('search', searchQuery);
  if (categoryFilter !== 'all') params.set('category', categoryFilter);
  if (statusFilter !== 'all') params.set('status', statusFilter);
  if (yearFilter !== 'all') params.set('year', yearFilter);
  if (dynastyFilter !== 'all') params.set('dynasty', dynastyFilter);
  
  const newURL = params.toString() 
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  
  window.history.replaceState({}, '', newURL);
}

function getFilters() {
  const searchQuery = document.getElementById('search')?.value.trim().toLowerCase() || '';
  const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
  const statusFilter = document.getElementById('statusFilter')?.value || 'all';
  const yearFilter = document.getElementById('yearFilter')?.value || 'all';
  const dynastyFilter = document.getElementById('dynastyFilter')?.value || 'all';
  
  return { searchQuery, categoryFilter, statusFilter, yearFilter, dynastyFilter };
}

function applyFilters() {
  const { searchQuery, categoryFilter, statusFilter, yearFilter, dynastyFilter } = getFilters();
  
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
    
    // Dynasty filter
    if (dynastyFilter !== 'all') {
      const caseDynasties = [
        ...(caseItem.dynasty_connections || []),
        ...(caseItem.accused?.map(a => a.dynasty_connection).filter(Boolean) || [])
      ];
      if (!caseDynasties.includes(dynastyFilter)) {
        return false;
      }
    }
    
    return true;
  });
  
  renderCaseList();
  updateURL(); // Update URL with current filters
}

function renderCaseList() {
  const container = document.querySelector('.case-list');
  if (!container) return;
  
  // Show result count
  const resultCount = document.getElementById('resultCount');
  if (resultCount) {
    resultCount.textContent = `${filteredCases.length} ${filteredCases.length === 1 ? 'case' : 'cases'}`;
  }
  
  if (filteredCases.length === 0) {
    container.innerHTML = '<div class="empty">No cases match your filters. Try adjusting your search or filters.</div>';
    return;
  }
  
  container.innerHTML = filteredCases.map(caseItem => {
    const statusClass = getStatusClass(caseItem.status);
    const statusLabel = formatStatus(caseItem.status);
    const filingDate = formatDate(caseItem.filing_date);
    const caseUrl = getCaseUrl(caseItem.case_id);
    
    // Quick insights
    const insights = [];
    if (caseItem.human_trafficking_victims) {
      insights.push(`<span class="insight-badge">${caseItem.human_trafficking_victims.toLocaleString()} victims</span>`);
    }
    if (caseItem.amount_involved_php) {
      insights.push(`<span class="insight-badge">${formatAmount(caseItem.amount_involved_php)}</span>`);
    }
    if (caseItem.accused && caseItem.accused.length > 0) {
      insights.push(`<span class="insight-badge">${caseItem.accused.length} accused</span>`);
    }
    if (caseItem.pogo_connections && caseItem.pogo_connections.length > 0) {
      insights.push(`<span class="insight-badge">${caseItem.pogo_connections.length} POGO ops</span>`);
    }
    
    return `
      <a href="${caseUrl}" class="case-card">
        <div class="case-card-header">
          <h3>${escapeHtml(caseItem.title)}</h3>
          ${caseItem.priority === 'high' ? '<span class="priority-badge">High Priority</span>' : ''}
        </div>
        <div class="case-meta">
          <span class="status-badge ${statusClass}">${statusLabel}</span>
          <span class="category-tag">${escapeHtml(caseItem.category)}</span>
          <span>${filingDate}</span>
          ${caseItem.location ? `<span>📍 ${escapeHtml(caseItem.location.municipality || caseItem.location.province || '')}</span>` : ''}
        </div>
        ${insights.length > 0 ? `<div class="case-insights">${insights.join('')}</div>` : ''}
        ${caseItem.significance ? `<p class="case-summary">${escapeHtml(caseItem.significance.substring(0, 120))}${caseItem.significance.length > 120 ? '...' : ''}</p>` : ''}
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
function updateFilterCounts() {
  // Update filter dropdowns with counts
  const categoryFilter = document.getElementById('categoryFilter');
  const statusFilter = document.getElementById('statusFilter');
  
  if (categoryFilter && allCases.length > 0) {
    const categories = {};
    allCases.forEach(c => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });
    
    Array.from(categoryFilter.options).forEach(option => {
      if (option.value !== 'all' && categories[option.value]) {
        const count = categories[option.value];
        option.text = `${option.text.split(' (')[0]} (${count})`;
      }
    });
  }
  
  if (statusFilter && allCases.length > 0) {
    const statuses = {};
    allCases.forEach(c => {
      const normalized = c.status.toLowerCase().replace(/_/g, '');
      if (normalized.includes('ongoing') || normalized.includes('investigation')) {
        statuses['ongoing'] = (statuses['ongoing'] || 0) + 1;
      } else if (normalized.includes('convicted')) {
        statuses['convicted'] = (statuses['convicted'] || 0) + 1;
      } else if (normalized.includes('dismissed') || normalized.includes('acquitted')) {
        statuses['dismissed'] = (statuses['dismissed'] || 0) + 1;
      } else if (normalized.includes('filed') || normalized.includes('trial')) {
        statuses['trial'] = (statuses['trial'] || 0) + 1;
      }
    });
    
    Array.from(statusFilter.options).forEach(option => {
      if (option.value !== 'all' && statuses[option.value]) {
        const count = statuses[option.value];
        option.text = `${option.text.split(' (')[0]} (${count})`;
      }
    });
  }
}

function initializeFilters() {
  const searchInput = document.getElementById('search');
  const categoryFilter = document.getElementById('categoryFilter');
  const statusFilter = document.getElementById('statusFilter');
  const yearFilter = document.getElementById('yearFilter');
  
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
    // Clear search on Escape
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        applyFilters();
        searchInput.blur();
      }
    });
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
  
  const dynastyFilter = document.getElementById('dynastyFilter');
  if (dynastyFilter) {
    dynastyFilter.addEventListener('change', applyFilters);
  }
  
  // Populate year filter
  if (yearFilter && allCases.length > 0) {
    const years = [...new Set(allCases.map(c => new Date(c.filing_date).getFullYear()))].sort((a, b) => b - a);
    yearFilter.innerHTML = '<option value="all">All Years</option>' + 
      years.map(year => {
        const count = allCases.filter(c => new Date(c.filing_date).getFullYear() === year).length;
        return `<option value="${year}">${year} (${count})</option>`;
      }).join('');
  }
  
  // Populate dynasty filter
  const dynastyFilter = document.getElementById('dynastyFilter');
  if (dynastyFilter && allCases.length > 0) {
    const dynasties = new Set();
    allCases.forEach(c => {
      if (c.dynasty_connections) {
        c.dynasty_connections.forEach(d => dynasties.add(d));
      }
      if (c.accused) {
        c.accused.forEach(a => {
          if (a.dynasty_connection) {
            dynasties.add(a.dynasty_connection);
          }
        });
      }
    });
    const sortedDynasties = Array.from(dynasties).sort();
    dynastyFilter.innerHTML = '<option value="all">All Dynasties</option>' +
      sortedDynasties.map(dynasty => {
        const displayName = dynasty.replace(/_FAMILY|_/g, ' ').trim();
        const count = allCases.filter(c => {
          const caseDynasties = [
            ...(c.dynasty_connections || []),
            ...(c.accused?.map(a => a.dynasty_connection).filter(Boolean) || [])
          ];
          return caseDynasties.includes(dynasty);
        }).length;
        return `<option value="${dynasty}">${displayName} (${count})</option>`;
      }).join('');
  }
  
  // Update filter counts
  updateFilterCounts();
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

