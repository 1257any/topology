import { Options } from './options';
import { Node } from './models/node';
import { drawFns, anchorsFns } from './middles/index';
import { Canvas } from './canvas';
import { Store } from './store/store';
import { Observer } from './store/observer';
import { HoverLayer } from './hoverLayer';
import { ActiveLayer } from './activeLayer';
import { defaultAnchors } from './middles/anchors/default';
import { Rect } from './models/rect';

export class Topology {
  parentElem: HTMLElement;
  canvas = document.createElement('canvas');
  offscreen: Canvas;
  hoverLayer: ActiveLayer;
  activeLayer: ActiveLayer;
  nodes: Node[] = [];
  options: Options;
  subcribe: Observer;

  hoverNode: Node;
  mouseDown = false;
  selectedRect = new Rect(0, 0, 0, 0);
  constructor(parent: string | HTMLElement, options?: Options) {
    this.options = options || {};

    if (!this.options.style) {
      this.options.style = {};
    }

    if (!this.options.style.fontFamily) {
      this.options.style.fontFamily = '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial';
    }

    if (!this.options.style.fontSize) {
      // px
      this.options.style.fontSize = 12;
    }
    if (!this.options.style.lineHeight) {
      // number
      this.options.style.lineHeight = 1.5;
    }

    if (typeof parent === 'string') {
      this.parentElem = document.getElementById(parent);
    } else {
      this.parentElem = parent;
    }

    this.offscreen = new Canvas(this.options);

    this.parentElem.appendChild(this.canvas);
    this.activeLayer = new ActiveLayer(this.parentElem, this.options);
    this.hoverLayer = new HoverLayer(this.parentElem, this.options);

    this.resize();

    this.hoverLayer.canvas.ondragover = event => event.preventDefault();
    this.hoverLayer.canvas.ondrop = event => {
      this.ondrop(event);
    };

    this.subcribe = Store.subcribe('render', () => {
      this.render();
    });

    this.hoverLayer.canvas.onmousemove = this.onMouseMove;
    this.hoverLayer.canvas.onmousedown = this.onmousedown;
    this.hoverLayer.canvas.onmouseup = this.onmouseup;
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
    this.hoverLayer.resize(this.canvas.width, this.canvas.height);
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
    if (!drawFns[node.shapeName]) {
      return false;
    }

    // Calc anchors.
    if (anchorsFns[node.shapeName]) {
      anchorsFns[node.shapeName](node);
    } else {
      defaultAnchors(node);
    }

    this.offscreen.nodes.push.apply(this.offscreen.nodes, this.activeLayer.nodes);
    this.offscreen.render();

    this.activeLayer.clearNodes();
    if (this.activeLayer.addNode(node)) {
      this.nodes.push(node);
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
  }

  onMouseMove = (e: MouseEvent) => {
    if (!this.hoverNode || !this.hoverNode.hit(e)) {
      this.hoverNode = this.getHoverNode(e, this.nodes);
      const nodes: Node[] = [];
      if (this.hoverNode) {
        nodes.push(this.hoverNode);
        this.hoverLayer.canvas.style.cursor = 'move';
      } else {
        this.hoverLayer.canvas.style.cursor = 'default';
      }
      this.hoverLayer.setNodes(nodes);
      this.hoverLayer.render();
    }
  };

  onmousedown = (e: MouseEvent) => {
    this.mouseDown = true;
    if (!this.hoverNode) {
      return;
    }

    if (e.ctrlKey) {
      this.activeLayer.addNode(this.hoverNode);
    } else {
      this.activeLayer.setNodes([this.hoverNode]);
    }

    // Set offscreen.
    this.offscreen.nodes = [];
    for (const item of this.nodes) {
      let found = false;
      for (const n of this.activeLayer.nodes) {
        if (item.id === n.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.offscreen.nodes.push(item);
      }
    }

    this.offscreen.render();
    this.activeLayer.render();
  };

  onmouseup = (e: MouseEvent) => {
    this.mouseDown = false;
  };

  getHoverNode(e: MouseEvent, nodes: Node[]) {
    let node: Node;
    for (let i = nodes.length - 1; i >= 0; --i) {
      if (nodes[i].hit(e)) {
        node = nodes[i];
        if (!nodes[i].children || !nodes[i].children.length) {
          break;
        }

        const child = this.getHoverNode(e, nodes[i].children);
        if (child) {
          node = child;
        }
      }
    }

    return node;
  }

  destory() {
    this.subcribe.unsubcribe();
  }
}
