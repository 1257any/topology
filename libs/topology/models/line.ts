import { s8 } from '../uuid/uuid';
import { Pen } from './pen';

export enum LineType {
  // 直线
  Line,
  // 1个控制点的折线
  Polyline,
  // 2个控制点的折线
  Polyline2,
  // 3个控制点的折线
  Polyline3,
  // 4个控制点的折线
  Polyline4,
  // 贝塞尔曲线
  Curve
}

export enum ArrowType {
  None,
  TriangleSolid,
  Triangle,
  Line,
  DiamondSolid,
  Diamond,
  CircleSolid,
  Circle,
  LineUp,
  LineDown
}

export interface Point {
  x: number;
  y: number;
}

export class Line extends Pen {
  id: string;
  cps: Point[] = [];
  fromArrow: ArrowType;
  toArrow: ArrowType;
  lineFns = [this.line, this.polyline, this.polyline2, this.polyline3, this.polyline4, this.curve];
  constructor(public from: Point, public to: Point = null, public type: LineType = LineType.Polyline) {
    super();

    from.x = (from.x + 0.5) << 0;
    from.y = (from.y + 0.5) << 0;
    if (to) {
      to.x = (to.x + 0.5) << 0;
      to.y = (to.y + 0.5) << 0;
    }
    this.id = s8();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    this.lineFns[this.type].call(this, ctx);
    ctx.stroke();
  }

  line(ctx: CanvasRenderingContext2D) {
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
  }

  polyline(ctx: CanvasRenderingContext2D) {
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
  }

  polyline2(ctx: CanvasRenderingContext2D) {
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
  }

  polyline3(ctx: CanvasRenderingContext2D) {
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
  }

  polyline4(ctx: CanvasRenderingContext2D) {
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
  }

  curve(ctx: CanvasRenderingContext2D) {
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
  }
}
