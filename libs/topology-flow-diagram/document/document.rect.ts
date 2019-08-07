import { Node } from '../../topology/models/node';
import { Rect } from '../../topology/models/rect';

export function flowDocumentIconRect(node: Node) {
  node.iconRect = new Rect(0, 0, 0, 0);
}

export function flowDocumentTextRect(node: Node) {
  node.textRect = new Rect(node.rect.x, node.rect.y, node.rect.width, (node.rect.height * 5) / 7);
  node.fullTextRect = node.textRect;
}
