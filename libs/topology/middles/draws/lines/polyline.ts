import { Point } from '../../../models/point';
import { Line } from '../../../models/line';
import { pointInLine } from './utils';

export function polyline(ctx: CanvasRenderingContext2D, l: Line) {
  ctx.beginPath();
  ctx.moveTo(l.from.x, l.from.y);
  ctx.lineTo(l.to.x, l.to.y);
  ctx.stroke();
}

export function polylineControlPoints(l: Line) {
  l.controlPoints = [];
}

export function polyline2(ctx: CanvasRenderingContext2D, l: Line) {
  ctx.beginPath();
  ctx.moveTo(l.from.x, l.from.y);
  ctx.lineTo(l.to.x, l.to.y);
  ctx.stroke();
}

export function polyline2ControlPoints(l: Line) {
  l.controlPoints = [];
}

export function polyline3(ctx: CanvasRenderingContext2D, l: Line) {
  ctx.beginPath();
  ctx.moveTo(l.from.x, l.from.y);
  ctx.lineTo(l.to.x, l.to.y);
  ctx.stroke();
}

export function polyline3ControlPoints(l: Line) {
  l.controlPoints = [];
}

export function polyline4(ctx: CanvasRenderingContext2D, l: Line) {
  ctx.beginPath();
  ctx.moveTo(l.from.x, l.from.y);
  ctx.lineTo(l.to.x, l.to.y);
  ctx.stroke();
}

export function polyline4ControlPoints(l: Line) {
  l.controlPoints = [];
}

export function pointInPolyline(point: Point, l: Line): boolean {
  if (!l.controlPoints || !l.controlPoints.length) {
    return pointInLine(point, l.from, l.to);
  }
  if (pointInLine(point, l.from, l.controlPoints[0])) {
    return true;
  }

  if (pointInLine(point, l.to, l.controlPoints[l.controlPoints.length - 1])) {
    return true;
  }

  for (let i = 0; i < l.controlPoints.length - 1; ++i) {
    if (pointInLine(point, l.controlPoints[i], l.controlPoints[i + 1])) {
      return true;
    }
  }

  return false;
}
