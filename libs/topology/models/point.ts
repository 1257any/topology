import { Direction } from './direction';

export class Point {
  // The id is nodeId while the point is from or to of a line.
  id: number | string;
  direction: Direction;
  // The index of docker anchor on node.
  anchorIndex: number;
  constructor(public x: number, public y: number, direction?: Direction, anchorIndex?: number, id?: number | string) {
    this.x = this.x << 0;
    this.y = this.y << 0;
    this.direction = direction;
    this.anchorIndex = anchorIndex;
    this.id = id;
  }

  clone(): Point {
    return new Point(this.x, this.y, this.direction, this.anchorIndex, this.id);
  }

  hit(e: MouseEvent, radius = 5) {
    return (
      e.offsetX > this.x - radius &&
      e.offsetX < this.x + radius &&
      e.offsetY > this.y - radius &&
      e.offsetY < this.y + radius
    );
  }

  rotate(angle: number, center: { x: number; y: number }): Point {
    if (!angle || angle === 360) {
      return this;
    }

    angle *= Math.PI / 180;
    const x = (this.x - center.x) * Math.cos(angle) - (this.y - center.y) * Math.sin(angle) + center.x;
    const y = (this.x - center.x) * Math.sin(angle) + (this.y - center.y) * Math.cos(angle) + center.y;
    this.x = x;
    this.y = y;
    return this;
  }
}
