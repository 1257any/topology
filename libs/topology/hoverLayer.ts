import { Rect } from './models/rect';
import { Node } from './models/node';
import { Canvas } from './canvas';

export class HoverLayer extends Canvas {
  canvas = document.createElement('canvas');
  nodes: Node[] = [];
  dragRect: Rect;
  constructor(parent: HTMLElement, options: any) {
    super(options);
    this.options.hoverStyle = options.hoverStyle || {};
    if (!this.options.hoverStyle || !this.options.hoverStyle.strokeStyle) {
      this.options.hoverStyle.strokeStyle = '#389e0d';
    }

    // 鼠标按下框选演示
    this.options.dragStyle = options.dragStyle || {};
    if (!this.options.dragStyle || !this.options.dragStyle.strokeStyle) {
      this.options.dragStyle.strokeStyle = '#1890ff';
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
    ctx.translate(0, 0);
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

    if (this.dragRect) {
      ctx.strokeStyle = this.options.dragStyle.strokeStyle;
      ctx.fillStyle = this.options.dragStyle.strokeStyle + '30';
      ctx.lineWidth = 1;
      ctx.translate(0.5, 0.5);
      ctx.beginPath();
      ctx.strokeRect(this.dragRect.x, this.dragRect.y, this.dragRect.width, this.dragRect.height);
      ctx.fillRect(this.dragRect.x, this.dragRect.y, this.dragRect.width, this.dragRect.height);
    }
  }
}
