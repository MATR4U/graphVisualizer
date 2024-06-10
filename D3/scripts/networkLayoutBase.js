import { applyNodeStyles, applyLinkStyles } from './networkStyle.js';

export function setupGeneralLayout(container, root, labelToColorMap, linkGenerator, transformNode) {
  const link = container.selectAll(".link")
    .data(root.links())
    .enter().append("path")
    .attr("class", "link")
    .attr("d", linkGenerator);

  applyLinkStyles(link);

  const node = container.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
    .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
    .attr("transform", transformNode);

  applyNodeStyles(node, root, labelToColorMap);
}
