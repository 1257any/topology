import { Rect } from './models/rect';
import { Point } from './models/point';
import { Line } from './models/line';
import { Canvas } from './canvas';
import { Store } from './store/store';

export class HoverLayer extends Canvas {
  line: Line;
  // The dock of to point of line.
  dockAnchor: Point;
  dragRect: Rect;
  lineControlPoint: Point;
  anchorRadius = 4;
  constructor(parent: HTMLElement, options: any) {
    super(options);
    if (!this.options.hoverColor) {
      this.options.hoverColor = '#389e0d';
    }

    // The backgournd color of selecting nodes by draging.
    if (!this.options.dragColor) {
      this.options.dragColor = '#1890ff';
    }

    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    parent.appendChild(this.canvas);
  }

  setLine(from: Point, fromArrow?: string) {
    this.line = new Line();
    this.line.setFrom(from, fromArrow);
    this.line.activeStrokeStyle = this.options.hoverColor;
    this.lines = [this.line];
    Store.get('lines').push(this.line);
  }

  lineTo(to: Point, toArrow: string = 'triangleSolid') {
    this.line.setTo(to, toArrow);
    this.line.calcControlPoints();
  }

  clearLines() {
    this.line = null;
    this.lines = [];
  }

  render() {
    // clear
    this.canvas.height = this.canvas.height;

    this.renderLines();

    const ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = this.options.hoverColor + '80';
    ctx.fillStyle = this.options.hoverColor + '80';
    ctx.translate(0, 0);
    if (this.dockAnchor) {
      ctx.beginPath();
      ctx.arc(this.dockAnchor.x, this.dockAnchor.y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
    }

    // anchors
    ctx.strokeStyle = this.options.hoverColor;
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2;
    for (const item of this.nodes) {
      for (const pt of item.rotatedAnchors) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, this.anchorRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
      }
    }

    if (this.lineControlPoint) {
      ctx.fillStyle = this.options.hoverColor;
      ctx.beginPath();
      ctx.arc(this.lineControlPoint.x, this.lineControlPoint.y, 5, 0, Math.PI * 2);
      ctx.fill();
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
