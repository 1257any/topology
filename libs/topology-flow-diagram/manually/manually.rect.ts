import { Node } from '../../topology/models/node';
import { Rect } from '../../topology/models/rect';

export function flowManuallyIconRect(node: Node) {
  node.iconRect = new Rect(0, 0, 0, 0);
}

export function flowManuallyTextRect(node: Node) {
  node.iconTextRect = new Rect(
    node.rect.x,
    node.rect.y + node.rect.height / 4,
    node.rect.width,
    (node.rect.height * 3) / 4
  );
  node.fullTextRect = node.iconTextRect;
}
