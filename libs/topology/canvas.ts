import { Node } from './models/node';
import { drawFns } from './middles/index';
import { Store } from './store/store';

export class Canvas {
  canvas = document.createElement('canvas');
  nodes: Node[] = [];
  options: any;
  constructor(options) {
    this.options = options || {};
    if (!this.options.strokeStyle) {
      this.options.strokeStyle = '#333';
    }
    if (!this.options.lineWidth) {
      this.options.lineWidth = 1;
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
    for (const item of this.nodes) {
      // Draw sharp.
      drawFns[item.drawFnName](ctx, item);
      console.log('render');
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
