import { applyNodeStyles, getNodeFillColor, applyLinkStyles, applyTextStyles } from './networkStyle.js';
import { dragStarted, dragged, dragEnded } from './networkEdit.js';
import { ELEMENT_IDS } from './constants.js';

export function setupGeneralForceLayout(container, root, labelToColorMap, ticked) {
  const mynetwork = document.getElementById(ELEMENT_IDS.NETWORK_CONTAINER);
  const width = mynetwork.clientWidth;
  const height = mynetwork.clientHeight;

  // Initialize node positions if not already set
  root.descendants().forEach(d => {
    if (isNaN(d.x) || isNaN(d.y)) {
      d.x = width / 2;
      d.y = height / 2;
    }
  });

  const simulation = d3.forceSimulation(root.descendants())
    .force("link", d3.forceLink(root.links()).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-50)) // Adjust charge strength to a moderate value
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(15)) // Adjust collision radius to a moderate value
    .on("tick", ticked);

  const link = container.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(root.links())
    .enter().append("line");

  applyLinkStyles(link);

  const node = container.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(root.descendants())
    .enter().append("circle")
    .attr("r", 10)
    .attr("fill", d => getNodeFillColor(d, labelToColorMap))
    .call(d3.drag()
      .on("start", dragStarted(simulation))
      .on("drag", dragged(simulation))
      .on("end", dragEnded(simulation)));

  node.append("title")
    .text(d => d.data.name);

  applyNodeStyles(node, root, labelToColorMap);

  const nodeText = container.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(root.descendants())
    .enter().append("text")
    .attr("x", d => d.x + 12)
    .attr("y", d => d.y + 3)
    .text(d => d.data.name);

  applyTextStyles(nodeText);

  // Define the clipping path
  container.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  // Apply the clipping path to the g element
  container.attr("clip-path", "url(#clip)");

  // Set up slider event listeners
  setupSliderListeners(simulation);

  return { link, node, nodeText, simulation };
}

function setupSliderListeners(simulation) {
  const chargeSlider = document.getElementById('chargeStrength');
  const linkSlider = document.getElementById('linkDistance');
  const collideSlider = document.getElementById('collisionRadius');

  const chargeValue = document.getElementById('chargeValue');
  const linkValue = document.getElementById('linkValue');
  const collideValue = document.getElementById('collideValue');

  chargeSlider.addEventListener('input', () => {
    const value = +chargeSlider.value;
    chargeValue.textContent = value;
    simulation.force('charge', d3.forceManyBody().strength(value)).alpha(1).restart();
  });

  linkSlider.addEventListener('input', () => {
    const value = +linkSlider.value;
    linkValue.textContent = value;
    simulation.force('link', d3.forceLink().distance(value)).alpha(1).restart();
  });

  collideSlider.addEventListener('input', () => {
    const value = +collideSlider.value;
    collideValue.textContent = value;
    simulation.force('collide', d3.forceCollide().radius(value)).alpha(1).restart();
  });
}

export function setupForceLayout(container, root, labelToColorMap) {
  const { link, node, nodeText, simulation } = setupGeneralForceLayout(container, root, labelToColorMap, ticked);

  function ticked() {
    link
      .attr("x1", d => {
        console.log(`Link source x: ${d.source.x}`);
        return d.source.x;
      })
      .attr("y1", d => {
        console.log(`Link source y: ${d.source.y}`);
        return d.source.y;
      })
      .attr("x2", d => {
        console.log(`Link target x: ${d.target.x}`);
        return d.target.x;
      })
      .attr("y2", d => {
        console.log(`Link target y: ${d.target.y}`);
        return d.target.y;
      });

    node
      .attr("cx", d => {
        console.log(`Node x: ${d.x}`);
        return d.x;
      })
      .attr("cy", d => {
        console.log(`Node y: ${d.y}`);
        return d.y;
      });

    nodeText
      .attr("x", d => {
        console.log(`Node text x: ${d.x}`);
        return d.x + 12;
      })
      .attr("y", d => {
        console.log(`Node text y: ${d.y}`);
        return d.y + 3;
      });
  }
}
