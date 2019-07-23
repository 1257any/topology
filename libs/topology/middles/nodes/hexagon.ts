import { Node } from '../../models/node';

export function hexagon(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();

  ctx.moveTo((node.rect.x + node.rect.width / 5) << 0, node.rect.y);
  ctx.lineTo((node.rect.x + (node.rect.width * 4) / 5) << 0, node.rect.y);
  ctx.lineTo(node.rect.x + node.rect.width, (node.rect.y + node.rect.height / 2) << 0);
  ctx.lineTo((node.rect.x + (node.rect.width * 4) / 5) << 0, node.rect.y + node.rect.height);
  ctx.lineTo((node.rect.x + node.rect.width / 5) << 0, node.rect.y + node.rect.height);
  ctx.lineTo(node.rect.x, (node.rect.y + node.rect.height / 2) << 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
