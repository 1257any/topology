import { Node } from '../../models/node';
import { Rect } from '../../models/rect';

export function imageIconRect(node: Node) {
  node.iconRect = new Rect(node.rect.x, node.rect.y, node.rect.width, node.rect.height);
}

export function imageTextRect(node: Node) {
  node.iconTextRect = new Rect(node.rect.x, node.rect.ey + 5, node.rect.width, 30);
  node.fullTextRect = node.iconTextRect;
}
