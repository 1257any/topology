import { Point } from './point';
import { Rect } from './rect';

export abstract class Pen {
  rect: Rect;
  lineWidth = 1;
  strokeStyle = '';
  activeStrokeStyle = '';
  fillStyle = '';
  activeFillStyle = '';
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
  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    if (this.rotate || this.offsetRotate) {
      ctx.translate(this.rect.centerX, this.rect.centerY);
      ctx.rotate(((this.rotate + this.offsetRotate) * Math.PI) / 180);
      ctx.translate(-this.rect.centerX, -this.rect.centerY);
    }

    if (this.lineWidth > 1) {
      ctx.lineWidth = this.lineWidth;
    }

    if (this.activeStrokeStyle) {
      ctx.strokeStyle = this.activeStrokeStyle;
    } else if (this.strokeStyle) {
      ctx.strokeStyle = this.strokeStyle;
    }

    if (this.activeFillStyle) {
      ctx.fillStyle = this.activeFillStyle;
    } else if (this.fillStyle) {
      ctx.fillStyle = this.fillStyle;
    }

    this.draw(ctx);

    ctx.restore();
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
}
