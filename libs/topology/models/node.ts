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
  rotateAnchors: Point[] = [];
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
    this.rotateAnchors = [];
    for (const item of this.anchors) {
      this.rotateAnchors.push(item.clone().rotate(angle, { x: this.rect.centerX, y: this.rect.centerY }));
    }
  }
}

export function occupyRect(nodes: Node[]) {
  if (!nodes || !nodes.length) {
    return;
  }

  let x1 = 99999;
  let y1 = 99999;
  let x2 = -99999;
  let y2 = -99999;

  for (const item of nodes) {
    if (x1 > item.rect.x) {
      x1 = item.rect.x;
    }
    if (y1 > item.rect.y) {
      y1 = item.rect.y;
    }
    if (x2 < item.rect.ex) {
      x2 = item.rect.ex;
    }
    if (y2 < item.rect.ey) {
      y2 = item.rect.ey;
    }

    const childrenRect = occupyRect(item.children);
    if (childrenRect) {
      if (x1 > childrenRect.x) {
        x1 = childrenRect.x;
      }
      if (y1 > childrenRect.y) {
        y1 = childrenRect.y;
      }
      if (x2 < childrenRect.ex) {
        x2 = childrenRect.ex;
      }
      if (y2 < childrenRect.ey) {
        y2 = childrenRect.ey;
      }
    }
  }

  return new Rect(x1, y1, x2 - x1, y2 - y1);
}
