import { highlightConnectedNodesAndEdges } from './eventHandlers.js';

export function applyNodeStyles(node, root, labelToColorMap) {
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

export function applyLinkStyles(link) {
  link.attr("stroke-width", 1.5)
      .attr("stroke", "#555");
}

export function applyTextStyles(nodeText) {
  nodeText.attr("dy", 3)
          .attr("x", 12)
          .attr("text-anchor", "start")
          .style("fill", "#000000")
          .text(d => d.data.name);
}
