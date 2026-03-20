/**
 * Resolve data URLs when OpenPinas is served under any path prefix
 * (e.g. https://user.github.io/openpinas/corruption-tracker/...).
 * Relative paths like ../data/... break when the pathname or trailing slash
 * handling differs by host.
 */
(function () {
  var MARKER = "/corruption-tracker";

  function trackerBasePath() {
    var pathname = window.location.pathname;
    var i = pathname.indexOf(MARKER);
    if (i === -1) return null;
    return pathname.slice(0, i + MARKER.length);
  }

  window.getOpenpinasCorruptionDataPath = function getOpenpinasCorruptionDataPath() {
    var base = trackerBasePath();
    if (base) return base + "/data/pogo-corruption-cases-2025.json";
    return "corruption-tracker/data/pogo-corruption-cases-2025.json";
  };

  /** Repo-root JSON (sibling of /corruption-tracker/) for dynasty network overlay */
  window.getOpenpinasPhilippineDynastiesJsonPath = function getOpenpinasPhilippineDynastiesJsonPath() {
    var pathname = window.location.pathname;
    var i = pathname.indexOf(MARKER);
    var root = i >= 0 ? pathname.slice(0, i) : "";
    return root + "/philippine-political-dynasties-network-2025.json";
  };
})();
