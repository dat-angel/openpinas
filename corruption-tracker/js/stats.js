// Load statistics for landing page
async function loadStats() {
  try {
    const response = await fetch('data/pogo-corruption-cases-2025.json');
    const data = await response.json();
    
    const stats = data.statistics || {};
    
    // Update stats display
    document.getElementById('totalCases').textContent = stats.total_cases || 0;
    document.getElementById('ongoingCases').textContent = 
      (stats.by_status?.ongoing_investigation || 0) + (stats.by_status?.ongoing || 0);
    
    // Format trafficking victims
    const victims = stats.human_trafficking_victims || 0;
    document.getElementById('traffickingVictims').textContent = 
      victims > 0 ? victims.toLocaleString() : '0';
    
    // Format amount
    const amount = stats.total_amount_php || 0;
    if (amount > 0) {
      if (amount >= 1000000000) {
        document.getElementById('totalAmount').textContent = 
          '₱' + (amount / 1000000000).toFixed(1) + 'B';
      } else if (amount >= 1000000) {
        document.getElementById('totalAmount').textContent = 
          '₱' + (amount / 1000000).toFixed(1) + 'M';
      } else {
        document.getElementById('totalAmount').textContent = 
          '₱' + amount.toLocaleString();
      }
    } else {
      document.getElementById('totalAmount').textContent = 'N/A';
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
}

// Load stats when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadStats);
} else {
  loadStats();
}

