import { Node } from '../../models/node';
import { Rect } from '../../models/rect';

export function arrowIconRect(node: Node) {
  node.iconRect = new Rect(0, 0, 0, 0);
}

export function arrowTextRect(node: Node) {
  let right = node.rect.width / 10;
  if (right < 10) {
    right = 10;
  }
  node.textRect = new Rect(
    node.rect.x + 10,
    node.rect.y + node.rect.height / 3,
    node.rect.width - 20 - right,
    node.rect.height / 3
  );
}
