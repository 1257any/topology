import { Node } from '../../models/node';

export function cloud(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  ctx.moveTo((node.rect.x + node.rect.width / 5) << 0, (node.rect.y + (node.rect.height * 13) / 16) << 0);
  ctx.bezierCurveTo(
    (node.rect.x - node.rect.width / 15) << 0,
    (node.rect.y + (node.rect.height * 13) / 16) << 0,
    (node.rect.x - node.rect.width / 15) << 0,
    (node.rect.y + (node.rect.height * 7) / 16) << 0,
    (node.rect.x + node.rect.width / 5) << 0,
    (node.rect.y + (node.rect.height * 7) / 16) << 0
  );
  ctx.bezierCurveTo(
    (node.rect.x + node.rect.width / 5) << 0,
    node.rect.y,
    (node.rect.x + (node.rect.width * 4) / 5) << 0,
    node.rect.y,
    (node.rect.x + (node.rect.width * 4) / 5) << 0,
    (node.rect.y + (node.rect.height * 7) / 16) << 0
  );
  ctx.bezierCurveTo(
    (node.rect.x + (node.rect.width * 16) / 15) << 0,
    (node.rect.y + (node.rect.height * 7) / 16) << 0,
    (node.rect.x + (node.rect.width * 16) / 15) << 0,
    (node.rect.y + (node.rect.height * 13) / 16) << 0,
    (node.rect.x + (node.rect.width * 4) / 5) << 0,
    (node.rect.y + (node.rect.height * 13) / 16) << 0
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
