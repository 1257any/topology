import { Node } from 'topology-core/models/node';

export function flowDocument(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  const x = (node.rect.x + node.rect.width / 2) << 0;
  const y = (node.rect.y + (node.rect.height * 6) / 7) << 0;
  const offsetY = (node.rect.height / 6) << 0;
  ctx.moveTo(node.rect.x, node.rect.y);
  ctx.lineTo(node.rect.ex, node.rect.y);
  ctx.lineTo(node.rect.ex, y);
  ctx.bezierCurveTo(node.rect.ex - 20, y - offsetY, (x + node.rect.width / 5) << 0, y - offsetY, x, y);
  ctx.bezierCurveTo((x - node.rect.width / 5) << 0, y + offsetY, node.rect.x, y + offsetY, node.rect.x, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
