import { Point } from '../../../models/point';

export function pointInLine(point: Point, from: Point, to: Point): boolean {
  let isIn = false;
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

  let last = points[3];
  for (const item of points) {
    if ((item.y < point.y && last.y >= point.y) || (item.y >= point.y && last.y < point.y)) {
      if (item.x + ((point.y - item.y) * (last.x - item.x)) / (last.y - item.y) > point.x) {
        isIn = !isIn;
      }
    }

    last = item;
  }

  return isIn;
}
