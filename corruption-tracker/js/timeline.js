// Timeline component for case detail pages
function renderCaseTimeline(timeline, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !timeline || timeline.length === 0) {
    if (container) {
      container.innerHTML = '<div class="empty">No timeline events available.</div>';
    }
    return;
  }

  // Sort timeline by date (newest first)
  const sortedTimeline = [...timeline].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  let html = '<div class="timeline">';
  
  sortedTimeline.forEach((event, index) => {
    const date = formatDate(event.date);
    const monthLabel = getMonthLabel(event.date);
    // When sorted newest first, check previous item (which is newer)
    const prevMonth = index > 0 ? getMonthLabel(sortedTimeline[index - 1].date) : null;
    
    // Add month marker if needed
    if (monthLabel !== prevMonth) {
      html += `<div class="month-marker">${monthLabel}</div>`;
    }
    
    html += `
      <article class="card timeline-event">
        <h3>${escapeHtml(event.event)}</h3>
        <div class="meta">
          <span>${date}</span>
        </div>
        <p class="description">${escapeHtml(event.description)}</p>
        ${event.sources && event.sources.length > 0 ? `
          <div class="sources">
            <strong>Sources:</strong>
            ${event.sources.map((source, idx) => {
              if (source && source.startsWith('http')) {
                return `<a href="${source}" target="_blank" rel="noopener" class="source-link">Source ${idx + 1}</a>`;
              }
              return '';
            }).filter(s => s).join(' | ')}
          </div>
        ` : ''}
      </article>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function getMonthLabel(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

