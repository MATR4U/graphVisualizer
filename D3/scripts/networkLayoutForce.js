import { BaseLayout } from './networkLayoutBase.js';

export class ForceLayout extends BaseLayout {
  /**
   * Sets up the force layout.
   */
  setupLayout() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const simulation = d3.forceSimulation(this.root.descendants())
      .force("link", d3.forceLink(this.root.links()).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(15))
      .on("tick", this.ticked.bind(this));

    this.simulation = simulation;
  }

  /**
   * The tick function to update positions of links and nodes.
   */
  ticked() {
    this.container.selectAll(".link")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    this.container.selectAll(".node")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }
}
