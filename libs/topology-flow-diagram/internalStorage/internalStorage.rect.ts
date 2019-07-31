import { Node } from '../../topology/models/node';
import { Rect } from '../../topology/models/rect';

export function flowInternalStorageIconRect(node: Node) {
  node.iconRect = new Rect(0, 0, 0, 0);
}

export function flowInternalStorageTextRect(node: Node) {
  const offset = node.rect.width / 7;
  node.iconTextRect = new Rect(
    node.rect.x + offset,
    node.rect.y + offset,
    node.rect.width - offset,
    node.rect.height - offset
  );
  node.fullTextRect = node.iconTextRect;
}
