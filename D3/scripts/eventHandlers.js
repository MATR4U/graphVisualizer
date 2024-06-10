import { COLORS } from './constants.js';

/**
 * Highlight the selected node, its neighbors, and connected edges.
 * @param {Object} root - The root node of the D3 hierarchy.
 * @param {string} nodeId - The ID of the node to highlight.
 * @param {Object} labelToColorMap - A map of labels to colors.
 */
export const highlightConnectedNodesAndEdges = (root, nodeId, labelToColorMap) => {
  resetNodeAndEdgeColors(labelToColorMap);
  highlightSelectedNode(nodeId);
  highlightConnectedNodes(root, nodeId);
};

/**
 * Reset the colors of all nodes and edges.
 * @param {Object} labelToColorMap - A map of labels to colors.
 */
const resetNodeAndEdgeColors = (labelToColorMap) => {
  const nodes = d3.selectAll('.node').select('circle');
  const links = d3.selectAll('.link');

  nodes.style('fill', d => {
    const baseLabel = d.data.name.split(' ')[0];
    const subGroupLabel = `${baseLabel} SubGroup ${d.depth}`;
    return labelToColorMap[subGroupLabel];
  });

  links.style('stroke', COLORS.DEFAULT_LINK_COLOR);
};

/**
 * Highlight the selected node.
 * @param {string} nodeId - The ID of the node to highlight.
 */
const highlightSelectedNode = (nodeId) => {
  d3.selectAll('.node')
    .select('circle')
    .filter(d => d.data.name === nodeId)
    .style('fill', COLORS.HIGHLIGHT_COLOR);
};

/**
 * Highlight the nodes connected to the selected node.
 * @param {Object} root - The root node of the D3 hierarchy.
 * @param {string} nodeId - The ID of the node to highlight.
 */
const highlightConnectedNodes = (root, nodeId) => {
  const connectedNodes = getConnectedNodes(root, nodeId);
  connectedNodes.forEach(id => {
    d3.selectAll('.node')
      .select('circle')
      .filter(d => d.data.name === id)
      .style('fill', COLORS.CONNECTED_COLOR);
  });
};

/**
 * Get the nodes connected to the selected node.
 * @param {Object} root - The root node of the D3 hierarchy.
 * @param {string} nodeId - The ID of the node to find connections for.
 * @returns {string[]} An array of connected node IDs.
 */
const getConnectedNodes = (root, nodeId) => {
  const nodes = [];
  root.each(d => {
    if (d.data.name === nodeId) {
      d.ancestors().forEach(a => nodes.push(a.data.name));
      d.descendants().forEach(a => nodes.push(a.data.name));
    }
  });
  return nodes;
};