export class Rect {
  ex: number;
  ey: number;
  constructor(public x: number, public y: number, public width: number, public height: number) {
    // tslint:disable-next-line:no-bitwise
    this.x = (this.x + 0.5) << 0;
    // tslint:disable-next-line:no-bitwise
    this.y = (this.y + 0.5) << 0;
    // tslint:disable-next-line:no-bitwise
    this.width = (this.width + 0.5) << 0;
    // tslint:disable-next-line:no-bitwise
    this.height = (this.height + 0.5) << 0;

    this.ex = this.x + this.width;
    this.ey = this.y + this.height;
  }

  hit(e: MouseEvent) {
    return e.offsetX > this.x && e.offsetX < this.ex && e.offsetY > this.y && e.offsetY < this.ey;
  }
}
