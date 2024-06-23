import { BaseLayout } from './networkLayoutBase.js';

export class RadialLayout extends BaseLayout {
  getLayout() {
    return d3.tree().size([360, window.innerHeight / 2])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
  }

  setupLayout() {
    const layout = this.getLayout();
    layout(this.root);

    this.setupGeneralLayout(
      d3.linkRadial().angle(d => d.x / 180 * Math.PI).radius(d => d.y),
      d => `rotate(${d.x - 90})translate(${d.y})`
    );
  }
}