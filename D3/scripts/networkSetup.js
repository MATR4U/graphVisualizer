import { TreeLayout } from './networkLayoutTree.js';
import { RadialLayout } from './networkLayoutRadial.js';
import { ForceLayout } from './networkLayoutForce.js';
import { ELEMENT_IDS, EVENTS } from './constants.js';

/**
 * Set up the network visualization based on the selected layout type.
 * @param {Object} root - The root node of the D3 hierarchy.
 * @param {Object} labelToColorMap - A map of labels to colors.
 * @param {Set} uniqueLabels - A set of unique labels.
 * @param {Object} labelBaseColors - A map of label base colors.
 * @param {string} layoutType - The type of layout to use ('tree', 'radial', 'force').
 */
export function setupNetwork(root, labelToColorMap, uniqueLabels, labelBaseColors, layoutType) {
  const { svg, g } = initializeSVGCanvas();

  let layout;
  switch (layoutType) {
    case 'tree':
      layout = new TreeLayout(g, root, labelToColorMap);
      break;
    case 'radial':
      layout = new RadialLayout(g, root, labelToColorMap);
      break;
    case 'force':
      layout = new ForceLayout(g, root, labelToColorMap);
      break;
    default:
      console.error("Unknown layout type:", layoutType);
      return;
  }
  layout.setupLayout();
}

/**
 * Initialize the SVG canvas.
 * @returns {Object} The SVG and group (g) elements.
 */
function initializeSVGCanvas() {
  const container = document.getElementById(ELEMENT_IDS.NETWORK_CONTAINER);
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Create the SVG element
  const svg = d3.select(container).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .call(d3.zoom().on(EVENTS.ZOOM, zoomed));

  // Create the group (g) element
  const g = svg.append("g");

  function zoomed(event) {
    g.attr("transform", event.transform); // Transform the contents of the group
  }

  return { svg, g };
}
