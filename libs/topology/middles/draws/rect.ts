import { Node } from '../../models/node';

export function rect(ctx: CanvasRenderingContext2D, node: Node) {
  const wr = node.width * node.borderRadius;
  const hr = node.height * node.borderRadius;
  let r = wr < hr ? wr : hr;
  if (node.width < 2 * r) {
    r = node.width / 2;
  }
  if (node.height < 2 * r) {
    r = node.height / 2;
  }
  ctx.beginPath();
  ctx.moveTo(node.x + r, node.y);
  ctx.arcTo(node.x + node.width, node.y, node.x + node.width, node.y + node.height, r);
  ctx.arcTo(node.x + node.width, node.y + node.height, node.x, node.y + node.height, r);
  ctx.arcTo(node.x, node.y + node.height, node.x, node.y, r);
  ctx.arcTo(node.x, node.y, node.x + node.width, node.y, r);
  ctx.closePath();
  ctx.stroke();
}
