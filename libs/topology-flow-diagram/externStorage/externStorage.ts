import { Node } from '../../topology/models/node';

export function flowExternStorage(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  const offsetX = (node.rect.width / 10) << 0;
  ctx.moveTo(node.rect.x + offsetX * 2, node.rect.y);
  ctx.bezierCurveTo(
    (node.rect.x - (offsetX * 2) / 3) << 0,
    node.rect.y,
    (node.rect.x - (offsetX * 2) / 3) << 0,
    node.rect.ey,
    node.rect.x + offsetX * 2,
    node.rect.ey
  );
  ctx.lineTo(node.rect.ex, node.rect.ey);
  ctx.bezierCurveTo(
    node.rect.ex - offsetX,
    node.rect.ey,
    node.rect.ex - offsetX,
    node.rect.y,
    node.rect.ex,
    node.rect.y
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
