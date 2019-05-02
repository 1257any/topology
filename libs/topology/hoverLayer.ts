import { Rect } from './models/rect';
import { Node } from './models/node';
import { Line, ArrowType, Point } from './models/line';
import { Canvas } from './canvas';

export class HoverLayer extends Canvas {
  line: Line;
  dragRect: Rect;
  constructor(parent: HTMLElement, options: any) {
    super(options);
    if (!this.options.hoverColor) {
      this.options.hoverColor = '#389e0d';
    }

    // 鼠标按下框选演示
    if (!this.options.dragColor) {
      this.options.dragColor = '#1890ff';
    }

    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    parent.appendChild(this.canvas);
  }

  setLine(anchor: Rect, fromArrow: ArrowType = ArrowType.None) {
    this.line = new Line({
      x: anchor.x + anchor.width / 2,
      y: anchor.y + anchor.height / 2
    });
    this.line.activeStrokeStyle = this.options.hoverColor;
    this.line.fromArrow = fromArrow;
    this.lines = [this.line];
  }

  lineTo(to: Point, toArrow: ArrowType = ArrowType.TriangleSolid) {
    this.line.to = to;
    this.line.toArrow = toArrow;
  }

  clearLines() {
    this.line = null;
    this.lines = [];
  }

  render() {
    // 清空背景
    this.canvas.height = this.canvas.height;

    this.renderLines();

    const ctx = this.canvas.getContext('2d');

    // anchors
    ctx.strokeStyle = this.options.hoverColor;
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

    // Select nodes by drag.
    if (this.dragRect) {
      ctx.strokeStyle = this.options.dragColor;
      ctx.fillStyle = this.options.dragColor + '30';
      ctx.lineWidth = 1;
      ctx.translate(0.5, 0.5);
      ctx.beginPath();
      ctx.strokeRect(this.dragRect.x, this.dragRect.y, this.dragRect.width, this.dragRect.height);
      ctx.fillRect(this.dragRect.x, this.dragRect.y, this.dragRect.width, this.dragRect.height);
    }
  }
}
