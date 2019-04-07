import { Node, occupyRect } from './models/node';
import { Canvas } from './canvas';

export class HoverLayer extends Canvas {
  canvas = document.createElement('canvas');
  nodes: Node[] = [];
  constructor(parent: HTMLElement, options: any) {
    super(options);
    this.options.hoverStyle = options.hoverStyle || {};
    if (!this.options.hoverStyle || !this.options.hoverStyle.fillStyle) {
      this.options.hoverStyle.fillStyle = 'rgba(200,50,0,0.07)';
    }
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    parent.appendChild(this.canvas);
  }

  render() {
    // 清空背景
    this.canvas.height = this.canvas.height;

    const rect = occupyRect(this.nodes);
    if (!rect) {
      return;
    }

    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = this.options.hoverStyle.fillStyle;
    ctx.beginPath();
    ctx.fillRect(rect.x - 2, rect.y - 2, rect.width + 4, rect.height + 4);
  }
}
