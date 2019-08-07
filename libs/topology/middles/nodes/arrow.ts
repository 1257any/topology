import { Node } from '../../models/node';

export function leftArrow(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();

  ctx.moveTo(node.rect.x, (node.rect.y + node.rect.height / 2) << 0);
  ctx.lineTo((node.rect.x + node.rect.height / 2) << 0, node.rect.y);
  ctx.lineTo((node.rect.x + node.rect.height / 2) << 0, (node.rect.y + node.rect.height / 3) << 0);
  ctx.lineTo((node.rect.x + node.rect.width) << 0, (node.rect.y + node.rect.height / 3) << 0);
  ctx.lineTo((node.rect.x + node.rect.width) << 0, (node.rect.y + (node.rect.height * 2) / 3) << 0);
  ctx.lineTo(
    (node.rect.x + (node.rect.width - node.rect.height / 2)) << 0,
    (node.rect.y + (node.rect.height * 2) / 3) << 0
  );
  ctx.lineTo((node.rect.x + node.rect.height / 2) << 0, (node.rect.y + (node.rect.height * 2) / 3) << 0);
  ctx.lineTo((node.rect.x + node.rect.height / 2) << 0, node.rect.y + node.rect.height);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export function rightArrow(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();

  ctx.moveTo(node.rect.x, (node.rect.y + node.rect.height / 3) << 0);
  ctx.lineTo((node.rect.x + (node.rect.width - node.rect.height / 2)) << 0, (node.rect.y + node.rect.height / 3) << 0);
  ctx.lineTo((node.rect.x + (node.rect.width - node.rect.height / 2)) << 0, node.rect.y);
  ctx.lineTo(node.rect.x + node.rect.width, (node.rect.y + node.rect.height / 2) << 0);
  ctx.lineTo((node.rect.x + (node.rect.width - node.rect.height / 2)) << 0, node.rect.y + node.rect.height);
  ctx.lineTo(
    (node.rect.x + (node.rect.width - node.rect.height / 2)) << 0,
    (node.rect.y + (node.rect.height * 2) / 3) << 0
  );
  ctx.lineTo(node.rect.x, (node.rect.y + (node.rect.height * 2) / 3) << 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export function twowayArrow(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();

  ctx.moveTo(node.rect.x, (node.rect.y + node.rect.height / 2) << 0);
  ctx.lineTo((node.rect.x + node.rect.height / 2) << 0, node.rect.y);
  ctx.lineTo((node.rect.x + node.rect.height / 2) << 0, (node.rect.y + node.rect.height / 3) << 0);
  ctx.lineTo((node.rect.x + (node.rect.width - node.rect.height / 2)) << 0, (node.rect.y + node.rect.height / 3) << 0);
  ctx.lineTo((node.rect.x + (node.rect.width - node.rect.height / 2)) << 0, node.rect.y);
  ctx.lineTo(node.rect.x + node.rect.width, (node.rect.y + node.rect.height / 2) << 0);
  ctx.lineTo((node.rect.x + (node.rect.width - node.rect.height / 2)) << 0, node.rect.y + node.rect.height);
  ctx.lineTo(
    (node.rect.x + (node.rect.width - node.rect.height / 2)) << 0,
    (node.rect.y + (node.rect.height * 2) / 3) << 0
  );
  ctx.lineTo((node.rect.x + node.rect.height / 2) << 0, (node.rect.y + (node.rect.height * 2) / 3) << 0);
  ctx.lineTo((node.rect.x + node.rect.height / 2) << 0, node.rect.y + node.rect.height);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
