import { Rect } from '../../models/rect';

export function circle(ctx: CanvasRenderingContext2D, node: Rect) {
  ctx.beginPath();
  ctx.arc(
    // tslint:disable-next-line:no-bitwise
    node.x + ((node.width / 2 + 0.5) << 0),
    // tslint:disable-next-line:no-bitwise
    node.y + ((node.width / 2 + 0.5) << 0),
    // tslint:disable-next-line:no-bitwise
    (node.width / 2 + 0.5) << 0,
    0,
    Math.PI * 2
  );
  ctx.stroke();
}
