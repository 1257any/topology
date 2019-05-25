import { s8 } from '../uuid/uuid';
import { Pen } from './pen';
import { Point } from './point';
import { drawLineFns, drawArrowFns } from '../middles';
import { getBezierPoint } from '../middles/draws/lines/curve';

export class Line extends Pen {
  from: Point;
  to: Point;
  controlPoints: Point[] = [];
  fromArrow: string;
  toArrow: string;
  constructor(public id: string = '', public name = 'curve') {
    super();

    if (!id) {
      this.id = s8();
    }
  }

  setFrom(from: Point, fromArrow: string = '') {
    from.x = (from.x + 0.5) << 0;
    from.y = (from.y + 0.5) << 0;
    this.from = from;
    this.fromArrow = fromArrow;
  }

  setTo(to: Point, toArrow: string = 'triangleSolid') {
    to.x = (to.x + 0.5) << 0;
    to.y = (to.y + 0.5) << 0;
    this.to = to;
    this.toArrow = toArrow;
  }

  calcControlPoints() {
    if (this.to && drawLineFns[this.name]) {
      drawLineFns[this.name].controlPointsFn(this);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (drawLineFns[this.name]) {
      drawLineFns[this.name].drawFn(ctx, this);
    }

    // For debug
    // this.fromArrow = 'triangle';
    // this.toArrow = 'triangle';
    // end.

    if (this.fromArrow && drawArrowFns[this.fromArrow]) {
      ctx.save();
      ctx.beginPath();
      if (this.activeStrokeStyle) {
        ctx.fillStyle = this.activeStrokeStyle;
      } else if (this.strokeStyle) {
        ctx.fillStyle = this.strokeStyle;
      } else {
        ctx.fillStyle = ctx.strokeStyle;
      }
      let f = this.to;
      if (this.controlPoints.length) {
        f = this.controlPoints[0];
      }
      drawArrowFns[this.fromArrow](ctx, f, this.from);
      ctx.restore();
    }
    if (this.toArrow && drawArrowFns[this.toArrow]) {
      ctx.save();
      ctx.beginPath();
      if (this.activeStrokeStyle) {
        ctx.fillStyle = this.activeStrokeStyle;
      } else if (this.strokeStyle) {
        ctx.fillStyle = this.strokeStyle;
      } else {
        ctx.fillStyle = ctx.strokeStyle;
      }
      let f = this.to;
      if (this.name === 'curve') {
        f = getBezierPoint(0.9, this.from, this.controlPoints[0], this.controlPoints[1], this.to);
      } else if (this.controlPoints.length) {
        f = this.controlPoints[this.controlPoints.length - 1];
      }
      drawArrowFns[this.toArrow](ctx, f, this.to);
      ctx.restore();
    }
  }

  pointIn(e: MouseEvent) {
    return drawLineFns[this.name].pointIn({ x: e.offsetX, y: e.offsetY }, this);
  }
}
