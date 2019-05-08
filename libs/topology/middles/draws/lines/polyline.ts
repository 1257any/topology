import { Line } from '../../../models/line';

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
