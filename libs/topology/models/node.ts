import { Pen } from './pen';
import { Rect } from './rect';
import { Point } from './point';
import { anchorsFns, iconRectFns, textRectFns, drawNodeFns } from '../middles';
import { defaultAnchors } from '../middles/default.anchor';
import { defaultIconRect, defaultTextRect } from '../middles/default.rect';
import { text, iconfont } from '../middles/nodes/text';
import { Store } from '../store/store';

export class Node extends Pen {
  is3D = false;
  z: number;
  zRotate = 0;

  // 0 -1 之间的小数
  borderRadius: number;

  // icon
  icon: string;
  iconFamily: string;
  iconSize: number;
  iconColor: string;

  image: string;
  imgNaturalWidth: number;
  imgNaturalHeight: number;
  imageWidth: number;
  imageHeight: number;
  imageRatio = true;
  private img: HTMLImageElement;

  iconRect: Rect;
  fullIconRect: Rect;

  text: string;
  textMaxLine: number;
  textRect: Rect;
  fullTextRect: Rect;

  anchors: Point[] = [];
  rotatedAnchors: Point[] = [];
  children: Node[];

  constructor(json: any) {
    super(json);

    this.is3D = json.is3D;
    this.z = json.z;
    this.zRotate = json.zRotate || 0;

    this.borderRadius = +json.borderRadius || 0;
    if (this.borderRadius > 1) {
      this.borderRadius = 1;
    }

    this.icon = json.icon;
    this.iconFamily = json.iconFamily;
    this.iconSize = +json.iconSize;
    this.iconColor = json.iconColor;

    this.image = json.image;
    if (json.imgNaturalWidth) {
      this.imgNaturalWidth = json.imgNaturalWidth;
    }
    if (json.imgNaturalHeight) {
      this.imgNaturalHeight = json.imgNaturalHeight;
    }
    if (json.imageWidth) {
      this.imageWidth = json.imageWidth;
    }
    if (json.imageHeight) {
      this.imageHeight = json.imageHeight;
    }
    this.imageRatio = json.imageRatio;

    this.text = json.text;
    if (json.textMaxLine) {
      this.textMaxLine = +json.textMaxLine || 0;
    }

    if (json.children) {
      this.children = [];
      for (const item of json.children) {
        item.children.push(new Node(item));
      }
    }
    this.init();
  }

  init() {
    // Calc rect of text.
    if (textRectFns[this.name]) {
      textRectFns[this.name](this);
    } else {
      defaultTextRect(this);
    }

    // Calc rect of icon.
    if (iconRectFns[this.name]) {
      iconRectFns[this.name](this);
    } else {
      defaultIconRect(this);
    }

    this.calcAnchors();
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
        this.drawImg(ctx);
        return;
      } else {
        // Load image and draw it.
        this.img = new Image();
        this.img.crossOrigin = 'anonymous';
        this.img.src = this.image;
        this.img.onload = () => {
          this.imgNaturalWidth = this.img.naturalWidth;
          this.imgNaturalHeight = this.img.naturalHeight;
          this.drawImg(ctx);
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

  drawImg(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.shadowColor = '';
    ctx.shadowBlur = 0;
    const rect = this.getIconRect().clone();
    const h = rect.height;
    if (this.imageWidth) {
      rect.width = this.imageWidth;
    }
    if (this.imageHeight) {
      rect.height = this.imageHeight;
    }
    if (this.imageRatio) {
      if (this.imageWidth) {
        rect.height = (this.imgNaturalHeight / this.imgNaturalWidth) * rect.width;
      } else {
        rect.width = (this.imgNaturalWidth / this.imgNaturalHeight) * rect.height;
      }
    }
    if (this.name !== 'image') {
      rect.x += ((this.rect.width - rect.width) / 2) << 0;
      rect.y += ((h - rect.height) / 2) << 0;
    }
    ctx.drawImage(this.img, rect.x, rect.y, rect.width, rect.height);
    ctx.restore();
  }

  emitRender() {
    let r = Store.get('render') || 0;
    Store.set('render', ++r);
  }

  calcAnchors() {
    this.anchors = [];
    if (anchorsFns[this.name]) {
      anchorsFns[this.name](this);
    } else {
      defaultAnchors(this);
    }

    this.calcRotateAnchors();
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
    let textRect = this.textRect;
    if (!this.icon && !this.image) {
      textRect = this.fullTextRect;
    }

    return textRect;
  }

  getIconRect() {
    let rect = this.iconRect;
    if (!this.text) {
      rect = this.fullIconRect || this.fullTextRect;
    }

    return rect;
  }
}
