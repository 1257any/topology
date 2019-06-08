import { s8 } from '../uuid/uuid';
import { Rect } from './rect';
import { pointInRect } from '../middles/draws/nodes/rect';

export abstract class Pen {
  id = '';
  name = '';
  rect: Rect = new Rect(0, 0, 0, 0);
  dash = 0;
  lineWidth = 1;
  strokeStyle = '';
  fillStyle = '';
  globalAlpha = 1;
  rotate = 0;
  offsetRotate = 0;
  font = {
    color: '',
    fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'center' as CanvasTextAlign,
    textBaseline: 'middle' as CanvasTextBaseline
  };
  // For users.
  data: any;
  constructor(json?: any) {
    if (json) {
      this.id = json.id || s8();
      this.name = json.name || '';
      if (json.rect) {
        this.rect = new Rect(json.rect.x, json.rect.y, json.rect.width, json.rect.height);
      }
      this.dash = json.dash || 0;
      this.lineWidth = json.lineWidth || 1;
      this.strokeStyle = json.strokeStyle || '';
      this.fillStyle = json.fillStyle || '';
      this.globalAlpha = json.globalAlpha || 1;
      this.rotate = json.rotate || 0;
      this.offsetRotate = json.offsetRotate || 0;
      if (json.font) {
        this.font = json.font;
      }

      this.data = json.data || '';
    } else {
      this.id = s8();
    }
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    if (this.rotate || this.offsetRotate) {
      ctx.translate(this.rect.center.x, this.rect.center.y);
      ctx.rotate(((this.rotate + this.offsetRotate) * Math.PI) / 180);
      ctx.translate(-this.rect.center.x, -this.rect.center.y);
    }

    if (this.lineWidth > 1) {
      ctx.lineWidth = this.lineWidth;
    }

    if (this.strokeStyle) {
      ctx.strokeStyle = this.strokeStyle;
    } else {
      ctx.strokeStyle = '#333';
    }

    if (this.fillStyle) {
      ctx.fillStyle = this.fillStyle;
    }

    if (this.globalAlpha < 1) {
      ctx.globalAlpha = this.globalAlpha;
    }

    switch (this.dash) {
      case 1:
        ctx.setLineDash([5, 5]);
        break;
      case 2:
        ctx.setLineDash([10, 10]);
        break;
      case 3:
        ctx.setLineDash([10, 10, 2, 10]);
        break;
    }

    this.draw(ctx);

    ctx.restore();
  }

  hit(e: { offsetX: number; offsetY: number }, padding = 0) {
    if (!this.rotate) {
      return this.rect.hit(e, padding);
    }

    const pts = this.rect.toPoints();
    for (const pt of pts) {
      pt.rotate(this.rotate, this.rect.center);
    }
    return pointInRect({ x: e.offsetX, y: e.offsetY }, pts);
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
}
