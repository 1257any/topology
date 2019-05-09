import { s8 } from '../uuid/uuid';
import { Pen } from './pen';
import { Point } from './point';
import { drawLineFns, drawArrowFns } from '../middles';

export class Line extends Pen {
  id: string;
  controlPoints: Point[] = [];
  fromArrow: string;
  toArrow: string;
  constructor(public from: Point, public to: Point = null, public name = 'polyline') {
    super();

    from.x = (from.x + 0.5) << 0;
    from.y = (from.y + 0.5) << 0;
    if (to) {
      to.x = (to.x + 0.5) << 0;
      to.y = (to.y + 0.5) << 0;
    }
    this.id = s8();

    this.calcControlPoints();
  }

  calcControlPoints() {
    if (drawLineFns[this.name]) {
      drawLineFns[this.name].controlPointsFn(this);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (drawLineFns[this.name]) {
      drawLineFns[this.name].drawFn(ctx, this);
    }

    // For debug
    // this.fromArrow.name = 'triangle';
    // this.toArrow.name = 'triangle';
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
      drawArrowFns[this.fromArrow](ctx, this.to, this.from);
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
      drawArrowFns[this.toArrow](ctx, this.from, this.to);
      ctx.restore();
    }
  }
}
