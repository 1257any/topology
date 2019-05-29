import { Node } from './models/node';
import { Line } from './models/line';
import { drawNodeFns, drawLineFns } from './middles/index';
import { Store } from './store/store';
import { Options } from './options';

export class Canvas {
  canvas = document.createElement('canvas');
  nodes: Node[] = [];
  lines: Line[] = [];
  rendering = false;
  rotate = 0;
  constructor(public options: Options = {}) {}

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  addNode(node: Node): boolean {
    if (!drawNodeFns[node.shapeName]) {
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
      node.activeStrokeStyle = this.options.activeColor;
      this.nodes.push(node);
      return true;
    }

    return false;
  }

  removeNode(node: Node) {
    for (let i = 0; i < this.nodes.length; ++i) {
      if (this.nodes[i].id === node.id) {
        this.nodes.splice(i, 1);
        break;
      }
    }
  }

  hasNode(node: Node) {
    let found = false;
    for (const item of this.nodes) {
      if (item.id === node.id) {
        found = true;
        break;
      }
    }

    return found;
  }

  render(update = true) {
    if (this.rendering) {
      return;
    }

    this.rendering = true;
    // Clear the canvas.
    this.canvas.height = this.canvas.height;
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

    const activeLine = Store.get('activeLine');
    const ctx = this.canvas.getContext('2d');
    for (const item of this.lines) {
      if (!item.to) {
        continue;
      }
      item.render(ctx);

      if (activeLine === item && item.controlPoints.length && drawLineFns[item.name]) {
        ctx.save();
        ctx.strokeStyle = this.options.hoverColor;
        ctx.fillStyle = this.options.hoverColor;
        drawLineFns[item.name].drawControlPointsFn(ctx, item);
        ctx.restore();
      }
    }
  }

  emitRender() {
    let r = Store.get('render') || 0;
    Store.set('render', ++r);
  }
}
