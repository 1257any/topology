import { Rect } from './models/rect';
import { Point } from './models/point';
import { Line } from './models/line';
import { Node } from './models/node';
import { Store } from './store/store';
import { drawLineFns } from './middles';

export class HoverLayer {
  canvas = document.createElement('canvas');

  anchorRadius = 4;

  line: Line;
  node: Node;
  hoverLineCP: Point;
  // The dock of to point of line.
  dockAnchor: Point;

  dragRect: Rect;
  constructor(parent: HTMLElement, public options: any) {
    if (!this.options.hoverColor) {
      this.options.hoverColor = '#d4380d';
    }

    // The backgournd color of selecting nodes by draging.
    if (!this.options.dragColor) {
      this.options.dragColor = '#d4380d';
    }

    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    parent.appendChild(this.canvas);
  }

  setLine(from: Point, fromArrow?: string) {
    this.line = new Line();
    this.line.setFrom(from, fromArrow);
    Store.get('lines').push(this.line);
  }

  lineTo(to: Point, toArrow: string = 'triangleSolid') {
    this.line.setTo(to, toArrow);
    this.line.calcControlPoints();
  }

  render() {
    // clear
    this.canvas.height = this.canvas.height;

    const ctx = this.canvas.getContext('2d');
    ctx.translate(0, 0);
    ctx.strokeStyle = this.options.hoverColor;
    ctx.fillStyle = '#fff';
    // anchors
    if (this.node) {
      for (const pt of this.node.rotatedAnchors) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, this.anchorRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    const activeLine = Store.get('activeLine');
    if (activeLine) {
      drawLineFns[activeLine.name].drawControlPointsFn(ctx, activeLine);
    }

    ctx.fillStyle = this.options.hoverColor;
    if (this.dockAnchor) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(this.dockAnchor.x, this.dockAnchor.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    if (this.hoverLineCP) {
      ctx.beginPath();
      ctx.arc(this.hoverLineCP.x, this.hoverLineCP.y, 5, 0, Math.PI * 2);
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

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
