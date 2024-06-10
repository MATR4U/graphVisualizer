export const highlightConnectedNodesAndEdges = (root, nodeId, labelToColorMap) => {
  const nodes = d3.selectAll(".node").select("circle");
  const links = d3.selectAll(".link");

  // Reset node and edge colors
  nodes.style("fill", d => {
    const baseLabel = d.data.name.split(" ")[0];
    const subGroupLabel = `${baseLabel} SubGroup ${d.depth}`;
    return labelToColorMap[subGroupLabel];
  });

  links.style("stroke", "#c0c0c0");

  // Highlight the selected node, its neighbors, and connected edges
  nodes.filter(d => d.data.name === nodeId)
    .style("fill", "#ff5722");

  // Find connected nodes and edges
  const connectedNodes = getConnectedNodes(root, nodeId);
  connectedNodes.forEach(id => {
    nodes.filter(d => d.data.name === id)
      .style("fill", "#ffccbc");
  });
};

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
