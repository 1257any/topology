import { Rect } from './rect';

export interface Node extends Rect {
  id?: string;
  icon?: string;
  image?: string;
  img?: HTMLImageElement;
  text?: string;
  iconRect?: Rect;
  textRect?: Rect;
  children?: Node[];
  anchor?: Rect[];
  style?: any;
  styleHover?: any;
  data?: any;
  drawFnName: string;
}

export function calcIconRect(node: Node) {
  if (node.icon || node.image) {
    if (node.drawFnName === 'image') {
      node.iconRect = {
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height
      };
    } else {
      node.iconRect = {
        // tslint:disable-next-line:no-bitwise
        x: (node.x + (node.width - 50) / 2) << 0,
        y: node.y + 10,
        width: 50,
        height: 50
      };
    }
  }
}

export function calcTextRect(node: Node) {
  if (node.iconRect) {
    node.textRect = {
      x: node.x + 10,
      y: node.y + 60,
      width: node.width - 20,
      height: node.height - 70
    };
  } else {
    node.textRect = {
      x: node.x + 10,
      y: node.y + 60,
      width: node.width - 20,
      height: node.height - 70
    };
  }
}
