import { Node } from '../../models/node';
import { Rect } from '../../models/rect';

export function lineIconRect(node: Node) {
  node.iconRect = new Rect(0, 0, 0, 0);
}

export function lineTextRect(node: Node) {
  node.textRect = new Rect(node.x + 10, node.y + node.height / 2 - 20, node.width - 20, 20);
}
