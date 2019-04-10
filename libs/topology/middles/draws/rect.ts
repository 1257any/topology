import { Rect } from '../../models/rect';

export function rect(ctx: CanvasRenderingContext2D, node: Rect) {
  ctx.beginPath();
  ctx.strokeRect(node.x, node.y, node.width, node.height);
  ctx.stroke();
}
