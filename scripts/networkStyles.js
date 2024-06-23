import { highlightConnectedNodesAndEdges } from './eventHandlers.js';

export class NodeStyler {
  constructor(root, labelToColorMap) {
    this.root = root;
    this.labelToColorMap = labelToColorMap;
  }

  applyStyles(node) {
    node.append("circle")
      .attr("r", 10)
      .style("fill", d => this.getNodeFillColor(d))
      .style("stroke", "steelblue")
      .style("stroke-width", "3px")
      .on("click", (event, d) => {
        d3.select(event.target).style("stroke", "#ff5722");
        highlightConnectedNodesAndEdges(this.root, d.data.name, this.labelToColorMap);
      });

    node.append("text")
      .attr("dy", 3)
      .attr("x", d => d.children ? -12 : 12)
      .style("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .style("fill", "#000000");
  }

  getNodeFillColor(d) {
    const baseLabel = d.data.name ? d.data.name.split(" ")[0] : 'Unknown';
    const subGroupLabel = `${baseLabel} SubGroup ${d.depth}`;
    return this.labelToColorMap[subGroupLabel] || '#cccccc';
  }
}

export class LinkStyler {
  applyStyles(link) {
    link.attr("stroke-width", 1.5)
        .attr("stroke", "#555");
  }
}

export class TextStyler {
  applyStyles(nodeText) {
    nodeText.attr("dy", 3)
            .attr("x", 12)
            .attr("text-anchor", "start")
            .style("fill", "#000000")
            .text(d => d.data.name);
  }
}