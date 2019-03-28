import { Store } from '../store/store';

const drawFns = {};
export function init() {
  // drawFns;

  Store.set('drawFns', drawFns);
  return drawFns;
}

export function register(name: string, fn: (ctx: CanvasRenderingContext2D, data: Node) => void) {
  // Exist
  if (drawFns[name]) {
    return false;
  }

  drawFns[name] = fn;
  return true;
}
