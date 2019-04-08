import { Node } from '../../models/node';

export function rect(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  ctx.strokeRect(node.x, node.y, node.width, node.height);
  ctx.stroke();
}
