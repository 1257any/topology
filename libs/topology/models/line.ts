import { s8 } from '../uuid/uuid';
import { Pen } from './pen';
import { Rect } from './rect';

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
  id?: string;
  anchorId?: number;
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

    // For debug
    // this.fromArrow = ArrowType.Circle;
    // this.toArrow = ArrowType.CircleSolid;
    // end.

    if (this.fromArrow) {
      this.arrow(ctx, this.to, this.from, this.fromArrow, true);
    }
    if (this.toArrow) {
      this.arrow(ctx, this.from, this.to, this.toArrow);
    }
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

  arrow(ctx: CanvasRenderingContext2D, from: Point, to: Point, type: ArrowType, reverse = false) {
    if (reverse) {
      if (type === ArrowType.LineUp) {
        type = ArrowType.LineDown;
      } else if (type === ArrowType.LineDown) {
        type = ArrowType.LineUp;
      }
    }

    let rect: Rect;
    ctx.save();
    ctx.beginPath();
    switch (type) {
      case ArrowType.TriangleSolid:
      case ArrowType.Triangle:
        rect = new Rect(to.x - 17, to.y - 5, 15, 10);
        ctx.translate(to.x, to.y);
        ctx.rotate(Math.atan2(to.y - from.y, to.x - from.x));
        ctx.translate(-to.x, -to.y);
        ctx.moveTo(rect.x, rect.y);
        ctx.lineTo(rect.x + rect.width, (rect.y + (rect.height / 2 + 0.5)) << 0);
        ctx.lineTo(rect.x, rect.y + rect.height);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.stroke();
        if (type === ArrowType.Triangle) {
          ctx.fillStyle = '#fff';
        }
        ctx.fill();
        break;
      case ArrowType.Line:
      case ArrowType.LineUp:
        rect = new Rect(to.x - 12, to.y - 6, 12, 12);
        ctx.translate(to.x, to.y);
        ctx.rotate(Math.atan2(to.y - from.y, to.x - from.x));
        ctx.translate(-to.x, -to.y);
        ctx.moveTo(rect.x, rect.y);
        ctx.lineTo(rect.x + rect.width, (rect.y + (rect.height / 2 + 0.5)) << 0);
        if (type === ArrowType.Line) {
          ctx.lineTo(rect.x, rect.y + rect.height);
        }
        ctx.stroke();
        break;
      case ArrowType.LineDown:
        rect = new Rect(to.x - 12, to.y - 6, 12, 12);
        ctx.translate(to.x, to.y);
        ctx.rotate(Math.atan2(to.y - from.y, to.x - from.x));
        ctx.translate(-to.x, -to.y);
        ctx.moveTo(rect.x + rect.width, (rect.y + (rect.height / 2 + 0.5)) << 0);
        ctx.lineTo(rect.x, rect.y + rect.height);
        ctx.stroke();
        break;
      case ArrowType.DiamondSolid:
      case ArrowType.Diamond:
        rect = new Rect(to.x - 16, to.y - 4, 14, 8);
        ctx.translate(to.x, to.y);
        ctx.rotate(Math.atan2(to.y - from.y, to.x - from.x));
        ctx.translate(-to.x, -to.y);
        ctx.moveTo((rect.x + rect.width / 2) << 0, rect.y);
        ctx.lineTo(rect.x + rect.width, (rect.y + rect.height / 2) << 0);
        ctx.lineTo((rect.x + rect.width / 2) << 0, rect.y + rect.height);
        ctx.lineTo(rect.x, (rect.y + rect.height / 2) << 0);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.stroke();
        if (type === ArrowType.Diamond) {
          ctx.fillStyle = '#fff';
        }
        ctx.fill();
        break;
      case ArrowType.CircleSolid:
      case ArrowType.Circle:
        rect = new Rect(to.x - 12, to.y - 5, 10, 10);
        ctx.translate(to.x, to.y);
        ctx.rotate(Math.atan2(to.y - from.y, to.x - from.x));
        ctx.translate(-to.x, -to.y);
        ctx.ellipse(
          rect.x + ((rect.width / 2) << 0),
          rect.y + ((rect.height / 2) << 0),
          (rect.width / 2) << 0,
          (rect.height / 2) << 0,
          0,
          0,
          Math.PI * 2
        );
        ctx.lineWidth = 2;
        ctx.stroke();
        if (type === ArrowType.Circle) {
          ctx.fillStyle = '#fff';
        }
        ctx.fill();
        break;
    }
    ctx.restore();
  }
}
