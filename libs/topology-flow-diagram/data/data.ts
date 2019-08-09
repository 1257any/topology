import { Node } from 'topology-core/models/node';

export function flowData(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  const offsetX = (node.rect.width / 7) << 0;
  ctx.moveTo(node.rect.x + offsetX, node.rect.y);
  ctx.lineTo(node.rect.ex, node.rect.y);
  ctx.lineTo(node.rect.x + node.rect.width - offsetX, node.rect.ey);
  ctx.lineTo(node.rect.x, node.rect.ey);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
