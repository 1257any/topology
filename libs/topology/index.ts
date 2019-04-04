import { Options } from './options';
import { Node, calcIconRect, calcTextRect } from './models/node';
import { drawFns } from './middles/index';
import { s8 } from './uuid/uuid';

export class Topology {
  parentElem: HTMLElement;
  canvas = document.createElement('canvas');
  offscreens = {
    bk: document.createElement('canvas'),
    active: document.createElement('canvas'),
    bkImgs: document.createElement('canvas'),
    activeImgs: document.createElement('canvas')
  };
  options: Options = {};
  nodes: Node[] = [];
  bkNodes: Node[] = [];
  activeNodes: Node[] = [];
  constructor(parent: string | HTMLElement, options?: Options) {
    this.options = options || {};

    if (typeof parent === 'string') {
      this.parentElem = document.getElementById(parent);
    } else {
      this.parentElem = parent;
    }

    this.initCanvas();
  }

  initCanvas() {
    this.parentElem.appendChild(this.canvas);
    this.setSize();

    this.canvas.ondragover = event => event.preventDefault();
    this.canvas.ondrop = event => {
      this.ondrop(event);
    };
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

    // tslint:disable-next-line:forin
    for (const key in this.offscreens) {
      this.offscreens[key].width = this.canvas.width;
      this.offscreens[key].height = this.canvas.height;
    }
  }

  ondrop(event: DragEvent) {
    event.preventDefault();
    const node = JSON.parse(event.dataTransfer.getData('Text'));
    // tslint:disable-next-line:no-bitwise
    node.x = event.offsetX - ((node.width / 2 + 0.5) << 0);
    // tslint:disable-next-line:no-bitwise
    node.y = event.offsetY - ((node.height / 2 + 0.5) << 0);

    this.addNode(node);
  }

  addNode(node: Node): boolean {
    if (!drawFns[node.drawFnName]) {
      return false;
    }

    this.deactivate();

    node.id = s8();
    node.anchor = node.anchor || [];
    node.style = node.style || {};
    node.styleHover = node.styleHover || {};

    if (!node.iconRect) {
      calcIconRect(node);
    }

    if (!node.textRect) {
      calcTextRect(node);
    }

    this.activeNodes.push(node);
    this.nodes.push(node);
    this.renderNodes(this.offscreens.active, this.activeNodes);
    this.renderImages(this.offscreens.activeImgs, this.activeNodes);

    return true;
  }

  deactivate() {
    if (!this.activeNodes.length) {
      return;
    }

    this.bkNodes.push.apply(this.bkNodes, this.activeNodes);
    this.activeNodes = [];
  }

  render(nodes?: Node[]) {
    if (nodes) {
      this.nodes = nodes;
    }

    // 清空画布
    this.canvas.height = this.canvas.height;
    this.renderNodes(this.offscreens.active, this.activeNodes);
    this.renderNodes(this.offscreens.bk, this.bkNodes);
    this.renderImages(this.offscreens.active, this.activeNodes);
    this.renderImages(this.offscreens.bkImgs, this.bkNodes);
  }

  private renderNodes(offscreen: HTMLCanvasElement, nodes: Node[]) {
    // 清空背景
    offscreen.height = this.canvas.height;

    const ctx = offscreen.getContext('2d');
    for (const item of nodes) {
      drawFns[item.drawFnName](ctx, item);
    }
    ctx.stroke();

    this.canvas.getContext('2d').drawImage(offscreen, 0, 0);
  }

  private renderImages(offscreen: HTMLCanvasElement, nodes: Node[]) {
    // 清空画布
    offscreen.height = this.canvas.height;

    const ctx = offscreen.getContext('2d');
    let cnt = 0;
    let hasImg = false;
    for (const item of nodes) {
      if (!item.image) {
        ++cnt;
        continue;
      } else if (item.img) {
        ++cnt;
        hasImg = true;
        continue;
      }

      item.img = new Image();
      item.img.crossOrigin = 'anonymous';
      item.img.src = item.image;
      item.img.onload = () => {
        ctx.drawImage(item.img, item.iconRect.x, item.iconRect.y, item.iconRect.width, item.iconRect.height);
        hasImg = true;
        if (++cnt >= nodes.length) {
          this.canvas.getContext('2d').drawImage(offscreen, 0, 0);
        }
      };
    }

    if (hasImg && cnt >= nodes.length) {
      this.canvas.getContext('2d').drawImage(offscreen, 0, 0);
    }
  }
}
