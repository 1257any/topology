import { Node } from './models/node';
import { drawFns } from './middles/index';
import { Store } from './store/store';
import { Options } from './options';
import { iconfont } from './middles/draws/iconfont';
import { text } from './middles/draws/text';

export class Canvas {
  canvas = document.createElement('canvas');
  nodes: Node[] = [];
  options: Options;
  rendering = false;
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
    if (!drawFns[node.shapeName]) {
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

  clearNodes() {
    this.nodes = [];
  }

  render(update = true, isActive = false) {
    if (this.rendering) {
      return;
    }

    this.rendering = true;

    // Clear the canvas.
    this.canvas.height = this.canvas.height;

    if (this.nodes.length) {
      const ctx = this.canvas.getContext('2d');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${this.options.style.fontSize}px/${this.options.style.lineHeight} ${this.options.style.fontFamily}`;

      if (isActive) {
        ctx.strokeStyle = this.options.activeStyle.strokeStyle;
      } else {
        ctx.strokeStyle = this.options.style.strokeStyle;
      }
      ctx.lineWidth = this.options.style.lineWidth;
      for (const item of this.nodes) {
        // Draw shape.
        drawFns[item.shapeName](ctx, item);

        // Draw text.
        if (item.shapeName !== 'text' && item.text) {
          text(ctx, item);
        }

        // Draw image.
        if (item.image) {
          // There is the cache of image.
          if (item.img) {
            ctx.drawImage(item.img, item.iconRect.x, item.iconRect.y, item.iconRect.width, item.iconRect.height);
            continue;
          } else {
            // Load image and draw it.
            item.img = new Image();
            item.img.crossOrigin = 'anonymous';
            item.img.src = item.image;
            item.img.onload = () => {
              ctx.drawImage(item.img, item.iconRect.x, item.iconRect.y, item.iconRect.width, item.iconRect.height);
              this.emitRender();
            };
          }

          continue;
        }

        // Draw icon
        if (item.icon) {
          iconfont(ctx, item, item.iconRect);
        }
      }
    }

    if (update) {
      this.emitRender();
    }

    this.rendering = false;
  }

  emitRender() {
    let r = Store.get('render') || 0;
    Store.set('render', ++r);
  }
}
