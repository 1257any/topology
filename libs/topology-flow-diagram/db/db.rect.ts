import { Node } from '../../topology/models/node';
import { Rect } from '../../topology/models/rect';

export function flowDbIconRect(node: Node) {
  node.iconRect = new Rect(0, 0, 0, 0);
}

export function flowDbTextRect(node: Node) {
  node.iconTextRect = new Rect(
    node.rect.x,
    node.rect.y + node.rect.height / 8,
    node.rect.width,
    (node.rect.height * 5) / 8
  );
  node.fullTextRect = node.iconTextRect;
}
