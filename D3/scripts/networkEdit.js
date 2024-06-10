import { highlightConnectedNodesAndEdges } from './eventHandlers.js';

export function appendNodeElements(node, root, labelToColorMap) {
  node.append("circle")
    .attr("r", 10)
    .style("fill", d => getNodeFillColor(d, labelToColorMap))
    .style("stroke", "steelblue")
    .style("stroke-width", "3px")
    .on("click", function (event, d) {
      d3.select(this).style("stroke", "#ff5722");
      highlightConnectedNodesAndEdges(root, d.data.name, labelToColorMap);
    });

  node.append("text")
    .attr("dy", 3)
    .attr("x", d => d.children ? -12 : 12)
    .style("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name)
    .style("fill", "#000000");
}

export function getNodeFillColor(d, labelToColorMap) {
  const baseLabel = d.data.name ? d.data.name.split(" ")[0] : 'Unknown';
  const subGroupLabel = `${baseLabel} SubGroup ${d.depth}`;
  return labelToColorMap[subGroupLabel] || '#cccccc';
}

export function dragStarted(simulation) {
  return function (event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };
}

export function dragged(simulation, width, height) {
  return function (event, d) {
    d.fx = Math.max(10, Math.min(width - 10, event.x));
    d.fy = Math.max(10, Math.min(height - 10, event.y));
  };
}

export function dragEnded(simulation) {
  return function (event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };
}

// Dummy functions to be implemented for cycling colors, shapes, etc.
export const cycleColor = (nodeId) => {
  console.log(`Cycle color for node ${nodeId}`);
};

export const cycleShape = (nodeId) => {
  console.log(`Cycle shape for node ${nodeId}`);
};

export const cycleLineThickness = (nodeId) => {
  console.log(`Cycle line thickness for node ${nodeId}`);
};

export const toggleLineStraightCurved = (nodeId) => {
  console.log(`Toggle line straight/curved for node ${nodeId}`);
};

export const toggleLineDashedSolid = (nodeId) => {
  console.log(`Toggle line dashed/solid for node ${nodeId}`);
};

// Add these missing exports
export const addNewChildBranch = (selectedNode) => {
  console.log(`Add new child branch to ${selectedNode}`);
};

export const addNewSiblingBranch = (selectedNode) => {
  console.log(`Add new sibling branch to ${selectedNode}`);
};

export const createNewLineOfText = (selectedNode) => {
  console.log(`Create new line of text for ${selectedNode}`);
};

export const undo = () => {
  console.log(`Undo last action`);
};

export const redo = () => {
  console.log(`Redo last action`);
};

export const rearrangeBranches = () => {
  console.log(`Rearrange branches`);
};
