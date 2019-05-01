import { Node } from '../../models/node';
import { Rect } from '../../models/rect';

export function defaultIconRect(node: Node) {
  if (node.shapeName === 'image') {
    node.iconRect = new Rect(node.x, node.y, node.width, node.height);
  } else {
    let w = (node.width * 2) / 3;
    let h = (node.height * 2) / 3;
    if (w > h) {
      w = h;
    } else {
      h = w;
    }
    node.iconRect = new Rect(node.x + (node.width - w) / 2 + 10, node.y + 10, w - 20, h - 20);
  }
}

export function defaultTextRect(node: Node) {
  if (node.icon || node.image) {
    node.textRect = new Rect(node.x + 10, node.y + (node.height * 2) / 3, node.width - 20, node.height / 3 - 5);
  } else {
    node.textRect = new Rect(node.x + 10, node.y + 10, node.width - 20, node.height - 20);
  }
}
