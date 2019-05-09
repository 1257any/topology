import { Point } from '../../../models/point';
import { Rect } from '../../../models/rect';

export function circleSolid(ctx: CanvasRenderingContext2D, from: Point, to: Point, fillStyle?: string) {
  const rect = new Rect(to.x - 12, to.y - 5, 10, 10);
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
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
  }
  ctx.fill();
}

export function circle(ctx: CanvasRenderingContext2D, from: Point, to: Point) {
  circleSolid(ctx, from, to, '#fff');
}
