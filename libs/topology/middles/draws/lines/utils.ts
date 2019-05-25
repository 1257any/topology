import { Point } from '../../../models/point';
import { pointInRect } from '../nodes/rect';

export function pointInLine(point: Point, from: Point, to: Point): boolean {
  const points: Point[] = [
    new Point(from.x - 5, from.y - 5),
    new Point(to.x - 5, to.y - 5),
    new Point(to.x + 5, to.y + 5),
    new Point(from.x + 5, from.y + 5)
  ];

  return pointInRect(point, points);
}
