export class Rect {
  ex: number;
  ey: number;
  constructor(public x: number, public y: number, public width: number, public height: number) {
    this.x = (this.x + 0.5) << 0;
    this.y = (this.y + 0.5) << 0;
    this.width = (this.width + 0.5) << 0;
    this.height = (this.height + 0.5) << 0;
    this.ex = this.x + this.width;
    this.ey = this.y + this.height;
  }

  hit(e: MouseEvent, padding = 0) {
    return (
      e.offsetX > this.x - padding &&
      e.offsetX < this.ex + padding &&
      e.offsetY > this.y - padding &&
      e.offsetY < this.ey + padding
    );
  }
}
