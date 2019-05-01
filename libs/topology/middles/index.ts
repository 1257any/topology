import { Rect } from '../models/rect';
import { rect } from './draws/rect';
import { circle } from './draws/circle';
import { triangle } from './draws/triangle';
import { diamond } from './draws/diamond';
import { arrow } from './draws/arrow';
import { text } from './draws/text';
import { line } from './draws/line';
import { triangleAnchors } from './anchors/triangle';
import { arrowAnchors } from './anchors/arrow';
import { lineAnchors } from './anchors/line';
import { circleIconRect, circleTextRect } from './rects/circle';
import { triangleIconRect, triangleTextRect } from './rects/triangle';
import { diamondIconRect, diamondTextRect } from './rects/diamond';
import { arrowIconRect, arrowTextRect } from './rects/arrow';
import { lineIconRect, lineTextRect } from './rects/line';

export const drawFns: any = {};
export const iconRectFns: any = {};
export const textRectFns: any = {};
export const anchorsFns: any = {};

export function registerShape(
  name: string,
  drawFn: (ctx: CanvasRenderingContext2D, data: Rect) => void,
  anchorsFn?: (data: Rect) => void,
  force?: boolean
) {
  // Exist
  if (drawFns[name] && !force) {
    return false;
  }

  drawFns[name] = drawFn;
  anchorsFns[name] = anchorsFn;
  return true;
}

function init() {
  console.log('Init middles.');
  drawFns.rect = rect;
  drawFns.circle = circle;
  drawFns.triangle = triangle;
  drawFns.diamond = diamond;
  drawFns.arrow = arrow;
  drawFns.text = text;
  drawFns.line = line;
  drawFns.image = (ctx: CanvasRenderingContext2D, node: Rect) => {};

  anchorsFns.triangle = triangleAnchors;
  anchorsFns.arrow = arrowAnchors;
  anchorsFns.line = lineAnchors;
  anchorsFns.text = (node: Rect) => {};

  iconRectFns.circle = circleIconRect;
  textRectFns.circle = circleTextRect;
  iconRectFns.triangle = triangleIconRect;
  textRectFns.triangle = triangleTextRect;
  iconRectFns.diamond = diamondIconRect;
  textRectFns.diamond = diamondTextRect;
  iconRectFns.arrow = arrowIconRect;
  textRectFns.arrow = arrowTextRect;
  iconRectFns.line = lineIconRect;
  textRectFns.line = lineTextRect;
}
init();
