import { Direction } from './direction';

export class Point {
  id?: number | string;
  direction?: Direction;
  anchorIndex?: number;
  constructor(public x: number, public y: number, direction?: Direction, achorIndex?: number, id?: number | string) {
    this.x = (this.x + 0.5) << 0;
    this.y = (this.y + 0.5) << 0;
    this.direction = direction;
    this.anchorIndex = achorIndex;
    this.id = id;
  }

  hit(e: MouseEvent, radius = 5) {
    return (
      e.offsetX > this.x - radius &&
      e.offsetX < this.x + radius &&
      e.offsetY > this.y - radius &&
      e.offsetY < this.y + radius
    );
  }

  rotate(angle: number) {
    let atan2 = Math.atan2(this.y, this.x);
    atan2 += angle;
    const r = Math.sqrt(this.x * this.x + this.y * this.y);
    return {
      x: Math.cos(atan2) * r,
      y: Math.sin(atan2) * r
    };
  }
}
