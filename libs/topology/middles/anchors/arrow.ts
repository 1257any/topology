import { Node } from '../../models/node';
import { Rect } from '../../models/rect';

export function arrowAnchors(node: Node) {
  node.anchors.push(new Rect(node.x - 4, node.y + node.height / 2 - 4, 8, 8));
  node.anchors.push(new Rect(node.x + node.width - 4, node.y + node.height / 2 - 4, 8, 8));
}
