import { Point } from 'topology-core/models/point';
import { Node } from 'topology-core/models/node';
import { Direction } from 'topology-core/models/direction';

export function flowParallelAnchors(node: Node) {
  node.anchors.push(new Point(node.rect.x + node.rect.width / 2, node.rect.y, Direction.Up));
  node.anchors.push(new Point(node.rect.x + node.rect.width / 2, node.rect.y + node.rect.height, Direction.Bottom));
}
