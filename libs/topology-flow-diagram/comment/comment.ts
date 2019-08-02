import { Node } from '../../topology/models/node';

export function flowComment(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  const offsetX = (node.rect.width / 4) << 0;
  ctx.moveTo(node.rect.x + offsetX, node.rect.y);
  ctx.lineTo(node.rect.x, node.rect.y);
  ctx.lineTo(node.rect.x, node.rect.ey);
  ctx.lineTo(node.rect.x + offsetX, node.rect.ey);
  ctx.fill();
  ctx.stroke();
}
