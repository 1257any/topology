import { Node } from '../../models/node';
import { Rect } from '../../models/rect';

export function messageIconRect(node: Node) {
  node.iconRect = new Rect(0, 0, 0, 0);
}

export function messageTextRect(node: Node) {
  node.iconTextRect = new Rect(node.rect.x, node.rect.y, node.rect.width, (node.rect.height * 3) / 4);
  node.fullTextRect = node.iconTextRect;
}
