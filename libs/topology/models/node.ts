import { Pen } from './pen';
import { Rect } from './rect';
import { Point } from './point';
import { s8 } from '../uuid/uuid';
import { anchorsFns, iconRectFns, textRectFns, drawNodeFns } from '../middles';
import { defaultAnchors } from '../middles/anchors/default';
import { defaultIconRect, defaultTextRect } from '../middles/rects/default';
import { text } from '../middles/draws/nodes/text';
import { iconfont } from '../middles/draws/nodes/iconfont';
import { Store } from '../store/store';

export class Node extends Pen {
  id: string;

  shapeName: string;

  // 0 -1 之间的小数
  borderRadius: number;

  // icon
  icon: string;
  iconFamily: string;
  iconSize: number;
  iconColor: string;
  iconRect: Rect;

  image: string;
  img: HTMLImageElement;

  text: string;
  textMaxLine: number;
  textRect: Rect;

  anchors: Point[] = [];
  rotatedAnchors: Point[] = [];
  children: Node[];
  data: any;

  constructor(json: any) {
    super();
    this.id = json.id || s8();
    this.rect = new Rect(json.x, json.y, json.width, json.height);

    this.shapeName = json.shapeName;

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
    this.textMaxLine = +json.textMaxLine;

    this.data = json.data;

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
    if (iconRectFns[this.shapeName]) {
      iconRectFns[this.shapeName](this);
    } else {
      defaultIconRect(this);
    }

    // Calc rect of text.
    if (textRectFns[this.shapeName]) {
      textRectFns[this.shapeName](this);
    } else {
      defaultTextRect(this);
    }

    // Calc anchors.
    this.anchors = [];
    if (anchorsFns[this.shapeName]) {
      anchorsFns[this.shapeName](this);
    } else {
      defaultAnchors(this);
    }

    this.calcRotateAnchors();
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw shape.
    drawNodeFns[this.shapeName](ctx, this);

    // Draw text.
    if (this.shapeName !== 'text' && this.text) {
      text(ctx, this);
    }

    // Draw image.
    if (this.image) {
      // There is the cache of image.
      if (this.img) {
        ctx.drawImage(this.img, this.iconRect.x, this.iconRect.y, this.iconRect.width, this.iconRect.height);
        return;
      } else {
        // Load image and draw it.
        this.img = new Image();
        this.img.crossOrigin = 'anonymous';
        this.img.src = this.image;
        this.img.onload = () => {
          ctx.drawImage(this.img, this.iconRect.x, this.iconRect.y, this.iconRect.width, this.iconRect.height);
          this.emitRender();
        };
      }

      return;
    }

    // Draw icon
    if (this.icon) {
      iconfont(ctx, this);
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
}
