import { Node } from '../../models/node';

export function iconfont(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${node.iconSize}px ${node.iconFamily}`;
  if (node.iconColor) {
    ctx.fillStyle = node.iconColor;
  }
  ctx.beginPath();
  ctx.fillText(
    node.icon,
    (node.iconRect.x + node.iconSize / 2 + (node.iconRect.width - node.iconSize) / 2) << 0,
    (node.iconRect.y + (node.iconSize * 4) / 7 + (node.iconRect.height - node.iconSize) / 2) << 0
  );
  ctx.restore();
}
