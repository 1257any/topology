import { Rect } from '../../models/rect';
import { Node } from '../../models/node';

export function iconfont(ctx: CanvasRenderingContext2D, node: Node, rect: Rect) {
  ctx.save();
  ctx.beginPath();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${node.iconSize}px ${node.iconFamily}`;
  if (node.iconColor) {
    ctx.fillStyle = node.iconColor;
  }

  ctx.fillText(
    node.icon,

    (rect.x + node.iconSize / 2 + (rect.width - node.iconSize) / 2) << 0,

    (rect.y + (node.iconSize * 4) / 7 + (rect.height - node.iconSize) / 2) << 0
  );

  ctx.restore();

  ctx.beginPath();
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  ctx.stroke();
}
