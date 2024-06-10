import { setupGeneralLayout } from './networkLayoutBase.js';

export function getRadialLayout() {
  return d3.tree().size([2 * Math.PI, Math.min(window.innerWidth, window.innerHeight) / 2 - 100])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);
}

export function setupRadialLayout(container, root, labelToColorMap) {
  const layout = getRadialLayout();
  layout(root);

  setupGeneralLayout(container, root, labelToColorMap,
    d3.linkRadial().angle(d => d.x).radius(d => d.y),
    d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y})`);
}
