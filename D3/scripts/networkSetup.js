import { setupTreeLayout } from './networkLayoutTree.js';
import { setupRadialLayout } from './networkLayoutRadial.js';
import { setupForceLayout } from './networkLayoutForce.js';
import { ELEMENT_IDS, EVENTS } from './constants.js';

export function setupNetwork(root, labelToColorMap, uniqueLabels, labelBaseColors, layoutType) {
  const { svg, g } = initializeSVGCanvas();

  switch (layoutType) {
    case 'tree':
      setupTreeLayout(g, root, labelToColorMap);
      break;
    case 'radial':
      setupRadialLayout(g, root, labelToColorMap);
      break;
    case 'force':
      setupForceLayout(g, root, labelToColorMap);
      break;
    default:
      console.error("Unknown layout type:", layoutType);
  }
}

function initializeSVGCanvas() {
  const mynetwork = document.getElementById(ELEMENT_IDS.NETWORK_CONTAINER);
  const width = mynetwork.clientWidth;
  const height = mynetwork.clientHeight;

  // Create the SVG element
  const svg = d3.select(`#${ELEMENT_IDS.NETWORK_CONTAINER}`).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

  // Create the group (g) element and apply zoom behavior
  const g = svg.append("g");

  svg.call(d3.zoom().on(EVENTS.ZOOM, function (event) {
    g.attr("transform", event.transform); // Transform the contents of the group
  }));

  return { svg, g };
}
