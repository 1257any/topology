import { Rect } from '../../models/rect';

export function line(ctx: CanvasRenderingContext2D, node: Rect) {
  ctx.beginPath();
  
  const y = (node.y + (node.height / 2 + 0.5)) << 0;
  ctx.moveTo(node.x, y);
  ctx.lineTo(node.x + node.width, y);
  ctx.stroke();
}
