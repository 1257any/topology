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
    // tslint:disable-next-line:no-bitwise
    (rect.x + node.iconSize / 2 + (rect.width - node.iconSize) / 2) << 0,
    // tslint:disable-next-line:no-bitwise
    (rect.y + (node.iconSize * 4) / 7 + (rect.height - node.iconSize) / 2) << 0
  );

  ctx.restore();
}
