import { Rect } from '../models/rect';
import { Point } from '../models/point';
import { Line } from '../models/line';
import { rect } from './draws/nodes/rect';
import { circle } from './draws/nodes/circle';
import { triangle } from './draws/nodes/triangle';
import { diamond } from './draws/nodes/diamond';
import { arrow } from './draws/nodes/arrow';
import { text } from './draws/nodes/text';
import { line as nodeLine } from './draws/nodes/line';
import { triangleAnchors } from './anchors/triangle';
import { arrowAnchors } from './anchors/arrow';
import { lineAnchors } from './anchors/line';
import { circleIconRect, circleTextRect } from './rects/circle';
import { triangleIconRect, triangleTextRect } from './rects/triangle';
import { diamondIconRect, diamondTextRect } from './rects/diamond';
import { arrowIconRect, arrowTextRect } from './rects/arrow';
import { lineIconRect, lineTextRect } from './rects/line';
import { line, lineControlPoints, calcLineControlPoints } from './draws/lines/line';
import {
  polyline,
  polylineControlPoints,
  pointInPolyline,
  calcPolylineControlPoints,
  dockPolylineControlPoint
} from './draws/lines/polyline';
import { curve, curveControlPoints, pointInCurve, calcCurveControlPoints } from './draws/lines/curve';
import { triangleSolid, triangle as arrowTriangle } from './draws/arrows/triangle';
import { diamondSolid, diamond as arrowDiamond } from './draws/arrows/diamond';
import { circleSolid, circle as arrowCircle } from './draws/arrows/circle';
import { lineUp, lineDown, line as arrowLine } from './draws/arrows/line';

// Functions of drawing a node.
export const drawNodeFns: any = {};
// Calc the occupy rect of icon.
export const iconRectFns: any = {};
// Calc the occupy rect of text.
export const textRectFns: any = {};
// Calc the anchors of node.
export const anchorsFns: any = {};

// Functions of drawing a line.
export const drawLineFns: any = {};

// Functions of drawing a arrow.
export const drawArrowFns: any = {};

function init() {
  console.log('Init middles.');

  // ********Default nodes.*******
  // Rectangle
  drawNodeFns.rect = rect;

  // Ciricle
  drawNodeFns.circle = circle;
  iconRectFns.circle = circleIconRect;
  textRectFns.circle = circleTextRect;

  // Triangle
  drawNodeFns.triangle = triangle;
  anchorsFns.triangle = triangleAnchors;
  iconRectFns.triangle = triangleIconRect;
  textRectFns.triangle = triangleTextRect;

  // Diamond
  drawNodeFns.diamond = diamond;
  iconRectFns.diamond = diamondIconRect;
  textRectFns.diamond = diamondTextRect;

  // Arrow
  drawNodeFns.arrow = arrow;
  anchorsFns.arrow = arrowAnchors;
  iconRectFns.arrow = arrowIconRect;
  textRectFns.arrow = arrowTextRect;

  // Text
  drawNodeFns.text = text;
  anchorsFns.text = (node: Rect) => {};

  // Line
  drawNodeFns.line = nodeLine;
  anchorsFns.line = lineAnchors;
  iconRectFns.line = lineIconRect;
  textRectFns.line = lineTextRect;

  // Image
  drawNodeFns.image = (ctx: CanvasRenderingContext2D, node: Rect) => {};
  // ********end********

  // ********Default lines.*******
  drawLineFns.line = {
    drawFn: line,
    drawControlPointsFn: lineControlPoints,
    controlPointsFn: calcLineControlPoints,
    pointIn: pointInPolyline
  };
  drawLineFns.polyline = {
    drawFn: polyline,
    drawControlPointsFn: polylineControlPoints,
    controlPointsFn: calcPolylineControlPoints,
    dockControlPointFn: dockPolylineControlPoint,
    pointIn: pointInPolyline
  };
  drawLineFns.curve = {
    drawFn: curve,
    drawControlPointsFn: curveControlPoints,
    controlPointsFn: calcCurveControlPoints,
    pointIn: pointInCurve
  };
  // ********end********

  // ********Default nodes.*******
  drawArrowFns.triangleSolid = triangleSolid;
  drawArrowFns.triangle = arrowTriangle;

  drawArrowFns.diamondSolid = diamondSolid;
  drawArrowFns.diamond = arrowDiamond;

  drawArrowFns.circleSolid = circleSolid;
  drawArrowFns.circle = arrowCircle;

  drawArrowFns.line = arrowLine;
  drawArrowFns.lineUp = lineUp;
  drawArrowFns.lineDown = lineDown;
  // ********end********
}
init();

// registerNode: Register a custom node.
// name - The name of node.
// drawFn - How to draw.
// anchorsFn - How to get the anchors.
// force - Overwirte the node if exists.
export function registerNode(
  name: string,
  drawFn: (ctx: CanvasRenderingContext2D, data: Rect) => void,
  anchorsFn?: (data: Rect) => void,
  force?: boolean
) {
  // Exist
  if (drawNodeFns[name] && !force) {
    return false;
  }

  drawNodeFns[name] = drawFn;
  anchorsFns[name] = anchorsFn;
  return true;
}

// registerLine: Register a custom line.
// name - The name of line.
// drawFn - How to draw.
// drawControlPointsFn - Draw the control points.
// controlPointsFn - How to get the controlPoints.
// dockControlPointFn - Dock a point to horizontal/vertial or related position.
// force - Overwirte the node if exists.
export function registerLine(
  name: string,
  drawFn: (ctx: CanvasRenderingContext2D, line: Line) => void,
  drawControlPointsFn?: (ctx: CanvasRenderingContext2D, line: Line) => void,
  controlPointsFn?: (line: Line) => void,
  dockControlPointFn?: (point: Point, line: Line) => void,
  pointInFn?: (point: Point, line: Line) => boolean,
  force?: boolean
) {
  // Exist
  if (drawLineFns[name] && !force) {
    return false;
  }

  drawLineFns[name] = {
    drawFn: drawFn,
    drawControlPointsFn: drawControlPointsFn,
    controlPointsFn: controlPointsFn,
    dockControlPointFn: dockControlPointFn,
    pointIn: pointInFn
  };
  return true;
}

// registerArrow: Register a custom arrow.
// name - the name of arrow.
// drawFn - how to draw.
// force - Overwirte the node if exists.
export function registerArrow(
  name: string,
  drawFn: (ctx: CanvasRenderingContext2D, from: Point, to: Point) => void,
  force?: boolean
) {
  // Exist
  if (drawArrowFns[name] && !force) {
    return false;
  }

  drawArrowFns[name] = drawFn;
  return true;
}
