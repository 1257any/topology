import { Node } from '../models/node';

export function diamond(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  // tslint:disable-next-line:no-bitwise
  ctx.moveTo((node.x + (node.width / 2 + 0.5)) << 0, node.y);
  // tslint:disable-next-line:no-bitwise
  ctx.lineTo(node.x + node.width, (node.y + (node.height / 2 + 0.5)) << 0);
  // tslint:disable-next-line:no-bitwise
  ctx.lineTo((node.x + (node.width / 2 + 0.5)) << 0, node.y + node.height);
  // tslint:disable-next-line:no-bitwise
  ctx.lineTo(node.x, (node.y + (node.height / 2 + 0.5)) << 0);
  ctx.closePath();
}
