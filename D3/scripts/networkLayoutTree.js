import { setupGeneralLayout } from './networkLayoutBase.js';

export function getTreeLayout() {
  return d3.tree().size([window.innerHeight - 200, window.innerWidth - 200]);
}

export function setupTreeLayout(container, root, labelToColorMap) {
  const layout = getTreeLayout();
  layout(root);

  setupGeneralLayout(container, root, labelToColorMap,
    d3.linkHorizontal().x(d => d.y).y(d => d.x),
    d => `translate(${d.y},${d.x})`);
}
