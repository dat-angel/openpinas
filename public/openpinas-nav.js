(function () {
  var nav = document.createElement("nav");
  nav.className = "op-nav";
  nav.setAttribute("aria-label", "Site navigation");
  nav.innerHTML =
    '<a href="/" class="op-nav-brand">OpenPinas</a>' +
    '<div class="op-nav-links">' +
    '<a href="/weekly-reviews/index.html" class="op-nav-hide-mobile">Reviews</a>' +
    '<a href="/dynasties-network-visualization.html" class="op-nav-hide-mobile">Map</a>' +
    '<a href="/interactive-timeline/index.html" class="op-nav-hide-mobile">Timeline</a>' +
    '<a href="https://github.com/dat-angel/openpinas" target="_blank" rel="noopener noreferrer">GitHub</a>' +
    "</div>";
  document.body.insertBefore(nav, document.body.firstChild);
})();
