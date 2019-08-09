import { Point } from 'topology-core/models/point';
import { Node } from 'topology-core/models/node';
import { Direction } from 'topology-core/models/direction';

export function flowCommentAnchors(node: Node) {
  node.anchors.push(new Point(node.rect.x, node.rect.y + node.rect.height / 2, Direction.Left));
}
