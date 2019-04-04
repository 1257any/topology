import { Node } from '../models/node';

export function line(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  // tslint:disable-next-line:no-bitwise
  const y = (node.y + (node.height / 2 + 0.5)) << 0;
  ctx.moveTo(node.x, y);
  ctx.lineTo(node.x + node.width, y);
}
