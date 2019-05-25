import { Point } from '../../../models/point';
import { pointInRect } from '../nodes/rect';

export function pointInLine(point: Point, from: Point, to: Point): boolean {
  const points: Point[] = [
    {
      x: from.x - 5,
      y: from.y - 5
    },
    {
      x: to.x - 5,
      y: to.y - 5
    },
    {
      x: to.x + 5,
      y: to.y + 5
    },
    {
      x: from.x + 5,
      y: from.y + 5
    }
  ];

  return pointInRect(point, points);
}
