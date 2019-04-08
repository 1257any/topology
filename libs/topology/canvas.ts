import { Node } from './models/node';
import { drawFns } from './middles/index';
import { Store } from './store/store';
import { Options } from './options';

export class Canvas {
  canvas = document.createElement('canvas');
  nodes: Node[] = [];
  options: Options;
  constructor(options) {
    this.options = options || {};
    this.options.style = options.style || {};
    if (!this.options.style.strokeStyle) {
      this.options.style.strokeStyle = '#555';
    }
    if (!this.options.style.lineWidth) {
      this.options.style.lineWidth = 1;
    }
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  setNodes(nodes: Node[]) {
    this.nodes = nodes;
  }

  addNode(node: Node): boolean {
    if (!drawFns[node.drawFnName]) {
      return false;
    }

    this.nodes.push(node);
    return true;
  }

  removeNode(node: Node) {
    for (let i = 0; i < this.nodes.length; ++i) {
      if (this.nodes[i].id === node.id) {
        this.nodes.splice(i, 1);
        break;
      }
    }
  }

  clearNodes() {
    this.nodes = [];
  }

  render(update = true) {
    if (!this.nodes.length) {
      return;
    }

    // Clear the canvas.
    this.canvas.height = this.canvas.height;

    const ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = this.options.style.strokeStyle;
    ctx.lineWidth = this.options.style.lineWidth;
    for (const item of this.nodes) {
      // Draw shape.
      drawFns[item.drawFnName](ctx, item);
      // Draw image.
      if (!item.image) {
        continue;
      }
      // There is the cache of image.
      if (item.img) {
        ctx.drawImage(item.img, item.iconRect.x, item.iconRect.y, item.iconRect.width, item.iconRect.height);
        continue;
      }

      // Load image and draw it.
      item.img = new Image();
      item.img.crossOrigin = 'anonymous';
      item.img.src = item.image;
      item.img.onload = () => {
        ctx.drawImage(item.img, item.iconRect.x, item.iconRect.y, item.iconRect.width, item.iconRect.height);
        this.emitRender();
      };
    }

    if (update) {
      this.emitRender();
    }
  }

  emitRender() {
    let r = Store.get('render') || 0;
    Store.set('render', ++r);
  }
}
