
import { BaseLayout } from './networkLayoutBase.js';

export class ForceLayout extends BaseLayout {
  /**
   * Sets up the force layout.
   */
  setupLayout() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    console.log("Setting up force layout with width:", width, "and height:", height);

    const nodes = this.root.descendants();
    const links = this.root.links();

    console.log("Nodes:", nodes);
    console.log("Links:", links);

    // Append links to the SVG container
    this.container.selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link");

    // Append nodes to the SVG container
    const nodeElements = this.container.selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 5) // Set a default radius for nodes
      .call(d3.drag()
        .on("start", this.dragStarted.bind(this))
        .on("drag", this.dragged.bind(this))
        .on("end", this.dragEnded.bind(this)));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100)) // Adjusted link distance
      .force("charge", d3.forceManyBody().strength(-30)) // Adjusted charge strength
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(10)) // Adjusted collision radius
      .on("tick", this.ticked.bind(this));

    this.simulation = simulation;

    // Apply general layout setup from BaseLayout
    this.setupGeneralLayout(
      d3.linkHorizontal().x(d => d.y).y(d => d.x),
      d => `translate(${d.y},${d.x})`
    );
  }

  dragStarted(event, d) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  dragEnded(event, d) {
    if (!event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }


  ticked() {
      console.log("Ticking...");

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

