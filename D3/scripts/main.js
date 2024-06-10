import { loadGraphData } from './dataLoader.js';
import { setupNetwork } from './networkSetup.js';
import { initializeKeyboardShortcuts } from './keyboardInput.js';
import { getBaseColor, getColorShades } from './colorUtils.js';
import { ELEMENT_IDS, FILE_PATHS, EVENTS, COLORS } from './constants.js';

document.addEventListener(EVENTS.DOM_CONTENT_LOADED, initializeApp);

function initializeApp() {
  const layoutSelector = document.getElementById(ELEMENT_IDS.LAYOUT_SELECTOR);

  initializeLayoutSelector(layoutSelector);
  loadAndRenderGraph(layoutSelector.value);
  initializeKeyboardShortcuts();
  initializeWindowResizeHandler(layoutSelector);
}

function initializeLayoutSelector(layoutSelector) {
  M.FormSelect.init(layoutSelector);
  layoutSelector.addEventListener(EVENTS.CHANGE, () => {
    loadAndRenderGraph(layoutSelector.value);
  });
}

function loadAndRenderGraph(layoutType) {
  loadGraphData(FILE_PATHS.GRAPH_DATA)
    .then(data => {
      const root = d3.hierarchy(data, d => d.children);
      const uniqueLabels = extractUniqueLabels(root);
      const labelBaseColors = assignBaseColors(uniqueLabels);
      const labelToColorMap = assignColorShades(uniqueLabels, labelBaseColors);

      clearPreviousGraph();
      setupNetwork(root, labelToColorMap, uniqueLabels, labelBaseColors, layoutType);
    })
    .catch(error => console.error("Error loading data:", error));
}

function clearPreviousGraph() {
  d3.select(`#${ELEMENT_IDS.NETWORK_CONTAINER}`).html('');
}

function extractUniqueLabels(root) {
  const uniqueLabels = new Set();
  root.each(d => uniqueLabels.add(d.data.name.split(" ")[0]));
  return uniqueLabels;
}

function assignBaseColors(uniqueLabels) {
  const labelBaseColors = {};
  uniqueLabels.forEach(label => {
    labelBaseColors[label] = getBaseColor();
  });
  return labelBaseColors;
}

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

function initializeWindowResizeHandler(layoutSelector) {
  window.addEventListener(EVENTS.RESIZE, () => {
    loadAndRenderGraph(layoutSelector.value);
  });
}