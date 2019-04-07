import { Options } from './options';
import { Node } from './models/node';
import { drawFns } from './middles/index';
import { Canvas } from './canvas';
import { Store } from './store/store';
import { Observer } from './store/observer';
import { ActiveLayer } from './activeLayer';

export class Topology {
  parentElem: HTMLElement;
  canvas = document.createElement('canvas');
  offscreen: Canvas;
  activeLayer: ActiveLayer;
  nodes: Node[] = [];
  options: Options = {};
  subcribe: Observer;
  constructor(parent: string | HTMLElement, options?: Options) {
    this.options = options || {};

    if (typeof parent === 'string') {
      this.parentElem = document.getElementById(parent);
    } else {
      this.parentElem = parent;
    }

    this.offscreen = new Canvas(this.options.style);
    this.activeLayer = new ActiveLayer(this.options.activeStyle);

    this.parentElem.appendChild(this.canvas);
    this.resize();

    this.canvas.ondragover = event => event.preventDefault();
    this.canvas.ondrop = event => {
      this.ondrop(event);
    };

    this.subcribe = Store.subcribe('render', () => {
      this.render();
    });

    this.canvas.onmousemove = this.onMouseMove;
  }

  resize() {
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

    this.offscreen.resize(this.canvas.width, this.canvas.height);
    this.activeLayer.resize(this.canvas.width, this.canvas.height);
  }

  ondrop(event: DragEvent) {
    event.preventDefault();
    const node = JSON.parse(event.dataTransfer.getData('Text'));
    // tslint:disable-next-line:no-bitwise
    node.x = event.offsetX - ((node.width / 2 + 0.5) << 0);
    // tslint:disable-next-line:no-bitwise
    node.y = event.offsetY - ((node.height / 2 + 0.5) << 0);
    this.addNode(new Node(node));
  }

  addNode(node: Node): boolean {
    if (!drawFns[node.drawFnName]) {
      return false;
    }

    this.activeLayer.clearNodes();
    if (this.activeLayer.addNode(node)) {
      this.nodes.push(node);
      this.offscreen.setNodes(this.nodes);
      this.offscreen.render(false);
      this.activeLayer.render();
    }

    return true;
  }

  render(nodes?: Node[]) {
    if (nodes) {
      this.nodes = nodes;
      this.offscreen.nodes = nodes;
      this.activeLayer.nodes = [];
    }

    // 清空画布
    this.canvas.height = this.canvas.height;
    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.offscreen.canvas, 0, 0);
    ctx.drawImage(this.activeLayer.canvas, 0, 0);
  }

  onMouseMove = (e: MouseEvent) => {
    console.log(123, e);
  };

  destory() {
    this.subcribe.unsubcribe();
  }
}
