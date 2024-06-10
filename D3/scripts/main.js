import { loadGraphData } from './dataLoader.js';
import { setupNetwork } from './networkSetup.js';
import { initializeKeyboardShortcuts } from './keyboardInput.js';
import { getBaseColor, getColorShades } from './colorUtils.js';
import { ELEMENT_IDS, FILE_PATHS, EVENTS, COLORS } from './constants.js';

document.addEventListener(EVENTS.DOM_CONTENT_LOADED, () => {
  const layoutSelector = document.getElementById(ELEMENT_IDS.LAYOUT_SELECTOR);

  // Initialize Materialize form select
  M.FormSelect.init(layoutSelector);

  // Load and render graph on layout change
  layoutSelector.addEventListener(EVENTS.CHANGE, () => {
    loadAndRenderGraph(layoutSelector.value);
  });

  // Initial graph load
  loadAndRenderGraph(layoutSelector.value);

  // Initialize keyboard shortcuts
  initializeKeyboardShortcuts();

  // Reload graph on window resize
  window.addEventListener(EVENTS.RESIZE, () => {
    loadAndRenderGraph(layoutSelector.value);
  });
});

/**
 * Load and render the graph with the specified layout type
 * @param {string} layoutType - The type of layout to use for the graph
 */
function loadAndRenderGraph(layoutType) {
  loadGraphData(FILE_PATHS.GRAPH_DATA)
    .then(data => {
      const root = d3.hierarchy(data, d => d.children);
      const uniqueLabels = extractUniqueLabels(root);
      const labelBaseColors = assignBaseColors(uniqueLabels);
      const labelToColorMap = assignColorShades(uniqueLabels, labelBaseColors);

      // Clear previous SVG
      d3.select(`#${ELEMENT_IDS.NETWORK_CONTAINER}`).html('');

      // Set up the network graph
      setupNetwork(root, labelToColorMap, uniqueLabels, labelBaseColors, layoutType);
    })
    .catch(error => console.error("Error loading data:", error));
}

/**
 * Extract unique labels from the root hierarchy
 * @param {Object} root - The root hierarchy data
 * @returns {Set} uniqueLabels - The set of unique labels
 */
function extractUniqueLabels(root) {
  const uniqueLabels = new Set();
  root.each(d => uniqueLabels.add(d.data.name.split(" ")[0]));
  return uniqueLabels;
}

/**
 * Assign base colors to each unique label
 * @param {Set} uniqueLabels - The set of unique labels
 * @returns {Object} labelBaseColors - An object mapping labels to base colors
 */
function assignBaseColors(uniqueLabels) {
  const labelBaseColors = {};
  uniqueLabels.forEach(label => {
    labelBaseColors[label] = getBaseColor();
  });
  return labelBaseColors;
}

/**
 * Assign color shades to each unique label
 * @param {Set} uniqueLabels - The set of unique labels
 * @param {Object} labelBaseColors - An object mapping labels to base colors
 * @returns {Object} labelToColorMap - An object mapping labels to color shades
 */
function assignColorShades(uniqueLabels, labelBaseColors) {
  const labelToColorMap = {};
  uniqueLabels.forEach(label => {
    const shades = getColorShades(labelBaseColors[label], COLORS.BASE_COLOR_COUNT);
    labelToColorMap[`${label} SubGroup 0`] = shades[0];
    for (let i = 1; i < COLORS.BASE_COLOR_COUNT; i++) {
      labelToColorMap[`${label} SubGroup ${i}`] = shades[i];
    }
  });
  return labelToColorMap;
}
