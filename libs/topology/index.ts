import { Options } from './options';
import { Node } from './node';

export class Topology {
  parentElem: HTMLElement;
  canvas: HTMLCanvasElement;
  canvasCache: HTMLCanvasElement;
  // canvasActive: HTMLCanvasElement;
  options: Options = {};
  nodes: Node[] = [];
  activeNode: Node;
  drawFns: (ctx: CanvasRenderingContext2D, data: Node) => void;
  constructor(parent: string | HTMLElement, options?: Options) {
    this.options = options || {};

    if (typeof parent === 'string') {
      this.parentElem = document.getElementById(parent);
    } else {
      this.parentElem = parent;
    }

    this.canvas = document.createElement('canvas');
    this.canvasCache = document.createElement('canvas');
    this.parentElem.appendChild(this.canvas);
    this.setSize();
  }

  setSize() {
    if (this.options.width && this.options.width !== 'auto') {
      this.canvas.width = +this.options.width;
    } else {
      this.canvas.width = this.parentElem.clientWidth;
    }
    if (this.options.height && this.options.height !== 'auto') {
      this.canvas.height = +this.options.height;
    } else {
      this.canvas.height = this.parentElem.clientHeight;
    }

    this.canvasCache.width = this.canvas.width;
    this.canvasCache.height = this.canvas.height;
  }

  render(nodes?: Node[]) {
    if (nodes) {
      this.nodes = nodes;
    }

    const ctx = this.canvasCache.getContext('2d');
    for (const item of this.nodes) {
    }

    this.canvas.getContext('2d').drawImage(this.canvasCache, 0, 0, this.canvas.width, this.canvas.height);
  }
}
