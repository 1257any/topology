import { Rect } from './rect';
import { s8 } from '../uuid/uuid';

export class Node extends Rect {
  id: string;
  shapeName: string;
  icon: string;
  iconFamily: string;
  iconSize: number;
  iconColor: string;
  image: string;
  img: HTMLImageElement;
  text: string;
  textMaxLine: number;
  iconRect: Rect;
  textRect: Rect;
  anchors: Rect[] = [];
  children: Node[];
  style: any;
  styleHover: any;
  data: any;

  constructor(json: any) {
    super(json.x, json.y, json.width, json.height);
    this.icon = json.icon;
    this.iconFamily = json.iconFamily;
    this.iconSize = +json.iconSize;
    this.iconColor = json.iconColor;
    this.image = json.image;
    this.text = json.text;
    this.textMaxLine = +json.textMaxLine;
    this.style = json.style || {};
    this.styleHover = json.styleHover || {};
    this.data = json.data;
    this.shapeName = json.shapeName;
    if (json.children) {
      this.children = [];
      for (const item of json.children) {
        this.children.push(new Node(item));
      }
    }

    this.init();
  }

  init() {
    this.id = s8();

    if (!this.iconRect) {
      this.calcIconRect();
    }

    if (!this.textRect) {
      this.calcTextRect();
    }
  }

  calcIconRect() {
    if (this.icon || this.image) {
      if (this.shapeName === 'image') {
        this.iconRect = new Rect(this.x, this.y, this.width, this.height);
      } else {
        // tslint:disable-next-line:no-bitwise
        this.iconRect = new Rect((this.x + (this.width - 50) / 2) << 0, this.y + 10, 50, 50);
      }
    }
  }

  calcTextRect() {
    if (this.iconRect) {
      this.textRect = new Rect(this.x + 10, this.y + 60, this.width - 20, this.height - 70);
    } else {
      this.textRect = new Rect(this.x + 10, this.y + 10, this.width - 20, this.height - 20);
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
    if (x1 > item.x) {
      x1 = item.x;
    }
    if (y1 > item.y) {
      y1 = item.y;
    }
    if (x2 < item.ex) {
      x2 = item.ex;
    }
    if (y2 < item.ey) {
      y2 = item.ey;
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
