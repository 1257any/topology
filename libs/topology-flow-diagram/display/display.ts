import { Node } from 'topology-core/models/node';

export function flowDisplay(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  const offsetX = (node.rect.width / 8) << 0;
  ctx.moveTo(node.rect.x + offsetX, node.rect.y);
  ctx.lineTo(node.rect.ex - offsetX, node.rect.y);
  ctx.bezierCurveTo(
    (node.rect.ex + offsetX / 3) << 0,
    node.rect.y,
    (node.rect.ex + offsetX / 3) << 0,
    node.rect.ey,
    node.rect.ex - offsetX,
    node.rect.ey
  );
  ctx.lineTo(node.rect.x + offsetX, node.rect.ey);
  ctx.lineTo(node.rect.x, (node.rect.y + node.rect.height / 2) << 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
