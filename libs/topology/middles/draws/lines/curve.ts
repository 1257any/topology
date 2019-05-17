import { Point } from '../../../models/point';
import { Line } from '../../../models/line';

export function curve(ctx: CanvasRenderingContext2D, l: Line) {
  ctx.beginPath();
  ctx.moveTo(l.from.x, l.from.y);
  ctx.lineTo(l.to.x, l.to.y);
  ctx.stroke();
}

export function curveControlPoints(l: Line) {
  l.controlPoints = [];
}

export function pointInCurve(point: Point, l: Line) {
  return false;
}
