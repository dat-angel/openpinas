let entries = [];

async function loadTimelineData() {
  try {
    const response = await fetch("../philippines-2025-timeline.json");
    const data = await response.json();
    entries = data.timeline.map((event) => {
      // Map categories to filter values
      const categoryMap = {
        "Political": "politics",
        "Cultural": "culture",
        "Natural Disasters": "weather",
        "Economic": "politics",
        "International Relations": "politics",
        "Legal": "politics",
        "Religious": "culture"
      };
      return {
        date: event.date,
        title: event.title,
        theme: categoryMap[event.category] || event.category.toLowerCase(),
        category: event.category, // Keep original for display
        description: event.description,
        significance: event.significance,
        diaspora_impact: event.diaspora_impact,
        mentioned_dynasties: event.mentioned_dynasties || [],
        sources: event.sources || {}
      };
    });
    applyFilters();
  } catch (error) {
    console.error("Error loading timeline data:", error);
    timelineEl.innerHTML =
      '<div class="empty">Error loading timeline data. Please check philippines-2025-timeline.json.</div>';
  }
}

const timelineEl = document.querySelector(".timeline");
const searchInput = document.querySelector("#search");
const sortButton = document.querySelector("#sortOrder");
const checkboxes = Array.from(document.querySelectorAll(".filter input[type=checkbox]"));
const countEl = document.querySelector("#count");

let sortAscending = true;

const monthLabel = (dateStr) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const getFilters = () => {
  const active = new Set(
    checkboxes.filter((box) => box.checked).map((box) => box.value)
  );
  const query = searchInput.value.trim().toLowerCase();
  return { active, query };
};

const applyFilters = () => {
  if (entries.length === 0) return;
  
  const { active, query } = getFilters();
  let filtered = entries.filter((entry) => active.has(entry.theme));

  if (query) {
    filtered = filtered.filter((entry) => {
      return (
        entry.title.toLowerCase().includes(query) ||
        entry.date.includes(query)
      );
    });
  }

  filtered.sort((a, b) => {
    if (sortAscending) {
      return a.date.localeCompare(b.date);
    }
    return b.date.localeCompare(a.date);
  });

  renderTimeline(filtered);
};

const renderTimeline = (items) => {
  timelineEl.innerHTML = "";
  countEl.textContent = `${items.length} entries`;

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No entries match your filters.";
    timelineEl.appendChild(empty);
    return;
  }

  let currentMonth = "";
  items.forEach((entry) => {
    const label = monthLabel(entry.date);
    if (label !== currentMonth) {
      currentMonth = label;
      const monthEl = document.createElement("div");
      monthEl.className = "month-marker";
      monthEl.textContent = label;
      timelineEl.appendChild(monthEl);
    }

    const card = document.createElement("article");
    card.className = "card";
    card.style.borderLeftColor = `var(--${entry.theme})`;
    
    let sourcesHTML = "";
    if (entry.sources) {
      const allSources = [];
      if (entry.sources.international) {
        if (typeof entry.sources.international === "string") {
          allSources.push(`<a href="${entry.sources.international}" target="_blank" rel="noopener">International Source</a>`);
        } else if (Array.isArray(entry.sources.international)) {
          entry.sources.international.forEach((src, idx) => {
            if (src && src.startsWith("http")) {
              allSources.push(`<a href="${src}" target="_blank" rel="noopener">International ${idx + 1}</a>`);
            }
          });
        }
      }
      if (entry.sources.local && Array.isArray(entry.sources.local)) {
        entry.sources.local.forEach((src, idx) => {
          if (src && src.startsWith("http")) {
            allSources.push(`<a href="${src}" target="_blank" rel="noopener">Local ${idx + 1}</a>`);
          }
        });
      }
      sourcesHTML = allSources.join(" | ");
    }
    
    let dynastiesHTML = "";
    if (entry.mentioned_dynasties && entry.mentioned_dynasties.length > 0) {
      dynastiesHTML = `<div class="dynasties">
        <strong>Mentioned Dynasties:</strong> 
        ${entry.mentioned_dynasties.map(d => 
          `<a href="../dynasties-network-visualization.html#${d}" class="dynasty-link">${d.replace(/_/g, ' ')}</a>`
        ).join(', ')}
      </div>`;
    }
    
    let descriptionHTML = entry.description ? `<p class="description">${entry.description}</p>` : '';
    let significanceHTML = entry.significance ? `<p class="significance"><strong>Significance:</strong> ${entry.significance}</p>` : '';
    let diasporaHTML = entry.diaspora_impact ? `<p class="diaspora"><strong>Diaspora Impact:</strong> ${entry.diaspora_impact}</p>` : '';
    
    card.innerHTML = `
      <h3>${entry.title}</h3>
      <div class="meta">
        <span>${formatDate(entry.date)}</span>
        <span class="tag ${entry.theme}">${entry.category || entry.theme}</span>
        ${sourcesHTML ? `<span>${sourcesHTML}</span>` : ''}
      </div>
      ${descriptionHTML}
      ${significanceHTML}
      ${diasporaHTML}
      ${dynastiesHTML}
    `;
    timelineEl.appendChild(card);
  });
};

sortButton.addEventListener("click", () => {
  sortAscending = !sortAscending;
  sortButton.textContent = sortAscending ? "Sort: Oldest" : "Sort: Newest";
  applyFilters();
});

checkboxes.forEach((box) => box.addEventListener("change", applyFilters));
searchInput.addEventListener("input", applyFilters);

// Check for URL parameters (for linking from other pages)
function handleUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get("search");
  if (searchQuery) {
    searchInput.value = searchQuery;
  }
}

// Initialize on load
handleUrlParams();
loadTimelineData();
