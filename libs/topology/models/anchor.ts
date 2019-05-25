import { Rect } from './rect';
import { Direction } from './direction';

export class Anchor extends Rect {
  constructor(public direction: Direction, public dockRect: Rect, x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }
}
