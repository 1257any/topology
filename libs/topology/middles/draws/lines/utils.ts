import { Point } from '../../../models/point';
import { pointInRect } from '../nodes/rect';

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
