import { Point } from '../models/point';
import { Node } from '../models/node';

export function pointInRect(point: { x: number; y: number }, vertices: Point[]): boolean {
  if (vertices.length < 3) {
    return false;
  }
  let isIn = false;

  let last = vertices[vertices.length - 1];
  for (const item of vertices) {
    if ((item.y < point.y && last.y >= point.y) || (item.y >= point.y && last.y < point.y)) {
      if (item.x + ((point.y - item.y) * (last.x - item.x)) / (last.y - item.y) > point.x) {
        isIn = !isIn;
      }
    }

    last = item;
  }

  return isIn;
}

export function pointInLine(point: Point, from: Point, to: Point): boolean {
  const points: Point[] = [
    new Point(from.x - 8, from.y - 8),
    new Point(to.x - 8, to.y - 8),
    new Point(to.x + 8, to.y + 8),
    new Point(from.x + 8, from.y + 8)
  ];

  return pointInRect(point, points);
}

export function lineLen(from: Point, to: Point): number {
  const len = Math.sqrt(Math.pow(Math.abs(from.x - to.x), 2) + Math.pow(Math.abs(from.y - to.y), 2));
  return len | 0;
}

export function curveLen(from: Point, cp1: Point, cp2: Point, to: Point): number {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M${from.x} ${from.y} C${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${to.x} ${to.y}`);
  return path.getTotalLength() | 0;
}

export function iconfont(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${node.iconSize}px ${node.iconFamily}`;
  if (!node.iconColor) {
    node.iconColor = '#2f54eb';
  }
  ctx.fillStyle = node.iconColor;
  ctx.beginPath();
  ctx.fillText(
    node.icon,
    (node.iconRect.x + node.iconSize / 2 + (node.iconRect.width - node.iconSize) / 2) << 0,
    (node.iconRect.y + (node.iconSize * 4) / 7 + (node.iconRect.height - node.iconSize) / 2) << 0
  );
  ctx.restore();
}
