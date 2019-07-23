import { Point } from '../../models/point';
import { Rect } from '../../models/rect';

export function diamondSolid(ctx: CanvasRenderingContext2D, from: Point, to: Point, fillStyle?: string) {
  const rect = new Rect(to.x - 16, to.y - 4, 14, 8);
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
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
  }
  ctx.fill();
}

export function diamond(ctx: CanvasRenderingContext2D, from: Point, to: Point) {
  diamondSolid(ctx, from, to, '#fff');
}
