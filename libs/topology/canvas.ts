import { Node } from './models/node';
import { Line } from './models/line';
import { drawNodeFns, drawLineFns } from './middles/index';
import { Store } from './store/store';
import { Options } from './options';

export class Canvas {
  name = '';
  canvas = document.createElement('canvas');
  private readonly nodes: Node[] = Store.get('nodes');
  private readonly lines: Line[] = Store.get('lines');
  rendering = false;
  constructor(public options: Options = {}, name = '') {
    this.name = name;
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  addNode(node: Node): boolean {
    if (!drawNodeFns[node.name]) {
      return false;
    }

    let found = false;
    for (const item of this.nodes) {
      if (item.id === node.id) {
        found = true;
        break;
      }
    }

    if (!found) {
      this.nodes.push(node);
      return true;
    }

    return false;
  }

  render(update = true) {
    if (this.rendering) {
      return;
    }

    this.rendering = true;
    // Clear the canvas.
    this.canvas.height = this.canvas.height;

    const ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = this.options.color;
    ctx.fillStyle = '#fff';

    this.renderLines();
    this.renderNodes();
    if (update) {
      this.emitRender();
    }
    this.rendering = false;
  }

  renderNodes() {
    if (!this.nodes.length) {
      return;
    }

    const ctx = this.canvas.getContext('2d');
    for (const item of this.nodes) {
      item.render(ctx);
    }
  }

  renderLines() {
    if (!this.lines.length) {
      return;
    }

    const ctx = this.canvas.getContext('2d');
    let i = 0;
    for (const item of this.lines) {
      if (!item.to) {
        this.lines.splice(i++, 1);
        continue;
      }
      item.render(ctx);
      ++i;
    }
  }

  emitRender() {
    let r = Store.get('render') || 0;
    Store.set('render', ++r);
  }
}
