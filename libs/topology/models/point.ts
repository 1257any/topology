import { Direction } from './direction';

export interface Point {
  id?: number | string;
  direction?: Direction;
  anchorIndex?: number;
  x: number;
  y: number;
}

export function hitPoint(e: MouseEvent, point: Point, padding = 3) {
  return (
    e.offsetX > point.x - padding &&
    e.offsetX < point.x + padding &&
    e.offsetY > point.y - padding &&
    e.offsetY < point.y + padding
  );
}

// angle - 顺时针弧度
export function rotatePoint(point: Point, angle: number) {
  let atan2 = Math.atan2(point.y, point.x);
  atan2 += angle;
  const r = Math.sqrt(point.x * point.x + point.y * point.y);
  return {
    x: Math.cos(atan2) * r,
    y: Math.sin(atan2) * r
  };
}
