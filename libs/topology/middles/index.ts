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
import { line, lineControlPoints } from './draws/lines/line';
import {
  polyline,
  polyline2,
  polyline3,
  polyline4,
  polylineControlPoints,
  polyline2ControlPoints,
  polyline3ControlPoints,
  polyline4ControlPoints
} from './draws/lines/polyline';
import { curve, curveControlPoints } from './draws/lines/curve';
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
    controlPointsFn: lineControlPoints
  };
  drawLineFns.polyline = {
    drawFn: polyline,
    controlPointsFn: polylineControlPoints
  };
  drawLineFns.polyline2 = {
    drawFn: polyline2,
    controlPointsFn: polyline2ControlPoints
  };
  drawLineFns.polyline3 = {
    drawFn: polyline3,
    controlPointsFn: polyline3ControlPoints
  };
  drawLineFns.polyline4 = {
    drawFn: polyline4,
    controlPointsFn: polyline4ControlPoints
  };
  drawLineFns.curve = {
    drawFn: curve,
    controlPointsFn: curveControlPoints
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
// name - the name of node.
// drawFn - how to draw.
// anchorsFn - how to get the anchors.
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
// name - the name of line.
// drawFn - how to draw.
// controlPointsFn - how to get the controlPoints.
// force - Overwirte the node if exists.
export function registerLine(
  name: string,
  drawFn: (ctx: CanvasRenderingContext2D, line: Line) => void,
  controlPointsFn?: (line: Line) => void,
  force?: boolean
) {
  // Exist
  if (drawLineFns[name] && !force) {
    return false;
  }

  drawLineFns[name] = {
    drawFn: drawFn,
    controlPointsFn: controlPointsFn
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
