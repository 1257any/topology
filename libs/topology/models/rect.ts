export class Rect {
  ex: number;
  ey: number;
  centerX: number;
  centerY: number;
  constructor(public x: number, public y: number, public width: number, public height: number) {
    this.x = (this.x + 0.5) << 0;
    this.y = (this.y + 0.5) << 0;
    this.width = (this.width + 0.5) << 0;
    this.height = (this.height + 0.5) << 0;
    this.ex = this.x + this.width;
    this.ey = this.y + this.height;
    this.calceCenter();
  }

  hit(e: MouseEvent, padding = 0) {
    return (
      e.offsetX > this.x - padding &&
      e.offsetX < this.ex + padding &&
      e.offsetY > this.y - padding &&
      e.offsetY < this.ey + padding
    );
  }

  hitRect(rect: Rect) {
    return (
      (rect.x > this.x && rect.x < this.ex && rect.y > this.y && rect.y < this.ey) ||
      (rect.ex > this.x && rect.ex < this.ex && rect.y > this.y && rect.y < this.ey) ||
      (rect.ex > this.x && rect.ex < this.ex && rect.ey > this.y && rect.ey < this.ey) ||
      (rect.x > this.x && rect.x < this.ex && rect.ey > this.y && rect.ey < this.ey)
    );
  }

  calceCenter() {
    this.centerX = (this.x + this.width / 2 + 0.5) << 0;
    this.centerY = (this.y + this.height / 2 + 0.5) << 0;
  }
}
