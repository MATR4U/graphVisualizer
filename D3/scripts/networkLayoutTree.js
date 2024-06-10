import { BaseLayout } from './networkLayoutBase.js';

export class TreeLayout extends BaseLayout {
  getLayout() {
    return d3.tree().size([window.innerHeight - 200, window.innerWidth - 200]);
  }
}