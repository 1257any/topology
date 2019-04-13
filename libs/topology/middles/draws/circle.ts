import { Rect } from '../../models/rect';

export function circle(ctx: CanvasRenderingContext2D, node: Rect) {
  ctx.beginPath();
  ctx.ellipse(
    node.x + ((node.width / 2 + 0.5) << 0),
    node.y + ((node.height / 2 + 0.5) << 0),
    (node.width / 2 + 0.5) << 0,
    (node.height / 2 + 0.5) << 0,
    0,
    0,
    Math.PI * 2
  );
  ctx.stroke();
}
