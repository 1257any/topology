import { Node } from '../../models/node';
import { Rect } from '../../models/rect';

export function arrowIconRect(node: Node) {
  node.iconRect = new Rect(0, 0, 0, 0);
}

export function arrowTextRect(node: Node) {
  let right = node.width / 10;
  if (right < 10) {
    right = 10;
  }
  node.textRect = new Rect(node.x + 10, node.y + node.height / 3, node.width - 20 - right, node.height / 3);
}
