import { Node } from './models/node';
import { Canvas } from './canvas';

export class HoverLayer extends Canvas {
  canvas = document.createElement('canvas');
  nodes: Node[] = [];
  constructor(parent: HTMLElement, options: any) {
    super(options);
    this.options.hoverStyle = options.hoverStyle || {};
    if (!this.options.hoverStyle || !this.options.hoverStyle.strokeStyle) {
      this.options.hoverStyle.strokeStyle = 'rgba(200,50,0)';
    }
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    parent.appendChild(this.canvas);
  }

  render() {
    // 清空背景
    this.canvas.height = this.canvas.height;

    const ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = this.options.hoverStyle.strokeStyle;
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2;
    for (const item of this.nodes) {
      for (const node of item.anchors) {
        ctx.beginPath();
        ctx.arc(
          node.x + ((node.width / 2 + 0.5) << 0),

          node.y + ((node.width / 2 + 0.5) << 0),

          (node.width / 2 + 0.5) << 0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.fill();
      }
    }
  }
}
