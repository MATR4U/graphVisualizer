import { NodeStyler, LinkStyler, TextStyler } from './networkStyles.js';

export class BaseLayout {
  constructor(container, root, labelToColorMap) {
    this.container = container;
    this.root = root;
    this.labelToColorMap = labelToColorMap;
    this.nodeStyler = new NodeStyler(root, labelToColorMap);
    this.linkStyler = new LinkStyler();
    this.textStyler = new TextStyler();
  }

  getLayout() {
    throw new Error("getLayout() must be implemented in the subclass");
  }

  setupLayout() {
    const layout = this.getLayout();
    layout(this.root);

    this.setupGeneralLayout(
      d3.linkHorizontal().x(d => d.y).y(d => d.x),
      d => `translate(${d.y},${d.x})`
    );
  }

  setupGeneralLayout(linkGenerator, transformNode) {
    const link = this.container.selectAll(".link")
      .data(this.root.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", linkGenerator);

    const node = this.container.selectAll(".node")
      .data(this.root.descendants())
      .enter().append("g")
      .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
      .attr("transform", transformNode);

    // Apply styles using the new style classes
    this.linkStyler.applyStyles(link);
    this.nodeStyler.applyStyles(node);

    // Apply text styles if needed
    const nodeText = node.append("text");
    this.textStyler.applyStyles(nodeText);
  }
}