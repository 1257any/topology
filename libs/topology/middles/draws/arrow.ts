import { Rect } from '../../models/rect';

export function arrow(ctx: CanvasRenderingContext2D, node: Rect) {
  ctx.beginPath();
  
  ctx.moveTo(node.x, (node.y + (node.height / 3 + 0.5)) << 0);
  
  ctx.lineTo((node.x + (node.width - node.height / 2 + 0.5)) << 0, (node.y + (node.height / 3 + 0.5)) << 0);
  
  ctx.lineTo((node.x + (node.width - node.height / 2 + 0.5)) << 0, node.y);
  
  ctx.lineTo(node.x + node.width, (node.y + (node.height / 2 + 0.5)) << 0);
  
  ctx.lineTo((node.x + (node.width - node.height / 2 + 0.5)) << 0, node.y + node.height);
  
  ctx.lineTo((node.x + (node.width - node.height / 2 + 0.5)) << 0, (node.y + ((node.height * 2) / 3 + 0.5)) << 0);
  
  ctx.lineTo(node.x, (node.y + ((node.height * 2) / 3 + 0.5)) << 0);
  ctx.closePath();
  ctx.stroke();
}
