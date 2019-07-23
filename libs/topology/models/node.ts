import { Pen } from './pen';
import { Rect } from './rect';
import { Point } from './point';
import { anchorsFns, iconRectFns, textRectFns, drawNodeFns } from '../middles';
import { defaultAnchors } from '../middles/default.anchor';
import { defaultIconRect, defaultTextRect } from '../middles/default.rect';
import { text } from '../middles/nodes/text';
import { iconfont } from '../middles/utils';
import { Store } from '../store/store';

export class Node extends Pen {
  // 0 -1 之间的小数
  borderRadius: number;

  // icon
  icon: string;
  iconFamily: string;
  iconSize: number;
  iconColor: string;
  iconRect: Rect;

  image: string;
  private img: HTMLImageElement;

  text: string;
  textMaxLine: number;
  iconTextRect: Rect;
  fullTextRect: Rect;

  anchors: Point[] = [];
  rotatedAnchors: Point[] = [];
  children: Node[];

  constructor(json: any) {
    super(json);

    this.borderRadius = +json.borderRadius || 0;
    if (this.borderRadius > 1) {
      this.borderRadius = 1;
    }

    this.icon = json.icon;
    this.iconFamily = json.iconFamily;
    this.iconSize = +json.iconSize;
    this.iconColor = json.iconColor;

    this.image = json.image;
    this.text = json.text;
    this.textMaxLine = +json.textMaxLine || 1;

    if (json.children) {
      this.children = [];
      for (const item of json.children) {
        item.children.push(new Node(item));
      }
    }
    this.init();
  }

  init() {
    // Calc rect of icon.
    if (iconRectFns[this.name]) {
      iconRectFns[this.name](this);
    } else {
      defaultIconRect(this);
    }

    // Calc rect of text.
    if (textRectFns[this.name]) {
      textRectFns[this.name](this);
    } else {
      defaultTextRect(this);
    }

    // Calc anchors.
    this.anchors = [];
    if (anchorsFns[this.name]) {
      anchorsFns[this.name](this);
    } else {
      defaultAnchors(this);
    }

    this.calcRotateAnchors();
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!drawNodeFns[this.name]) {
      return;
    }

    // Draw shape.
    drawNodeFns[this.name](ctx, this);

    // Draw text.
    if (this.name !== 'text' && this.text) {
      ctx.save();
      ctx.shadowColor = '';
      ctx.shadowBlur = 0;
      text(ctx, this);
      ctx.restore();
    }

    // Draw image.
    if (this.image) {
      // There is the cache of image.
      if (this.img) {
        ctx.save();
        ctx.shadowColor = '';
        ctx.shadowBlur = 0;
        ctx.drawImage(this.img, this.iconRect.x, this.iconRect.y, this.iconRect.width, this.iconRect.height);
        ctx.restore();
        return;
      } else {
        // Load image and draw it.
        this.img = new Image();
        this.img.crossOrigin = 'anonymous';
        this.img.src = this.image;
        this.img.onload = () => {
          ctx.save();
          ctx.shadowColor = '';
          ctx.shadowBlur = 0;
          ctx.drawImage(this.img, this.iconRect.x, this.iconRect.y, this.iconRect.width, this.iconRect.height);
          ctx.restore();
          this.emitRender();
        };
      }

      return;
    }

    // Draw icon
    if (this.icon) {
      ctx.save();
      ctx.shadowColor = '';
      ctx.shadowBlur = 0;
      iconfont(ctx, this);
      ctx.restore();
    }
  }

  emitRender() {
    let r = Store.get('render') || 0;
    Store.set('render', ++r);
  }

  calcRotateAnchors(angle?: number) {
    if (angle === undefined) {
      angle = this.rotate;
    }
    this.rotatedAnchors = [];
    for (const item of this.anchors) {
      this.rotatedAnchors.push(item.clone().rotate(angle, this.rect.center));
    }
  }

  getTextRect() {
    let textRect = this.iconTextRect;
    if (!this.icon && !this.image) {
      textRect = this.fullTextRect;
    }

    return textRect;
  }
}
