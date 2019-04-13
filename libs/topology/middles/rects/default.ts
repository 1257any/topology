import { Node } from '../../models/node';
import { Rect } from '../../models/rect';

export function defaultIconRect(node: Node) {
  if (node.shapeName === 'image') {
    node.iconRect = new Rect(node.x, node.y, node.width, node.height);
  } else {
    node.iconRect = new Rect(node.x + (node.width - 50) / 2, node.y + 10, 50, 50);
  }
}

export function defaultTextRect(node: Node) {
  if (node.icon || node.image) {
    node.textRect = new Rect(node.x + 10, node.y + 60, node.width - 20, node.height - 70);
  } else {
    node.textRect = new Rect(node.x + 10, node.y + 10, node.width - 20, node.height - 20);
  }
}
