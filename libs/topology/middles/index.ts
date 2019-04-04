import { Node } from '../models/node';
import { roundRect } from './roundRect';
import { rect } from './rect';
import { circle } from './circle';
import { triangle } from './triangle';
import { diamond } from './diamond';
import { arrow } from './arrow';
import { text } from './text';
import { line } from './line';

export const drawFns: any = {};

export function registerDraw(name: string, fn: (ctx: CanvasRenderingContext2D, data: Node) => void, force?: boolean) {
  // Exist
  if (drawFns[name] && !force) {
    return false;
  }

  drawFns[name] = fn;
  return true;
}

function init() {
  console.log('initDraws');
  drawFns.roundRect = roundRect;
  drawFns.rect = rect;
  drawFns.circle = circle;
  drawFns.triangle = triangle;
  drawFns.diamond = diamond;
  drawFns.arrow = arrow;
  drawFns.text = text;
  drawFns.line = line;
  drawFns.image = (ctx: CanvasRenderingContext2D, node: Node) => {};
}
init();
