import { Node } from '../../topology/models/node';

export function flowQueue(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  ctx.ellipse(
    node.rect.x + ((node.rect.width / 2) << 0),
    node.rect.y + ((node.rect.height / 2) << 0),
    (node.rect.width / 2) << 0,
    (node.rect.height / 2) << 0,
    0,
    0,
    Math.PI * 2
  );

  ctx.moveTo((node.rect.x + node.rect.width / 2) << 0, node.rect.ey);
  ctx.lineTo(node.rect.ex, node.rect.ey);

  ctx.fill();
  ctx.stroke();
}
