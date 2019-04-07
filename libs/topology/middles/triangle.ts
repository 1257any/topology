import { Node } from '../models/node';

export function triangle(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  // tslint:disable-next-line:no-bitwise
  ctx.moveTo((node.x + (node.width / 2 + 0.5)) << 0, node.y);
  ctx.lineTo(node.x + node.width, node.y + node.height);
  ctx.lineTo(node.x, node.y + node.height);
  ctx.closePath();
  ctx.stroke();
}
