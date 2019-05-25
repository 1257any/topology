import { Node } from '../../models/node';
import { Anchor } from '../../models/anchor';
import { Direction } from '../../models/direction';

export function arrowAnchors(node: Node) {
  node.anchors.push(
    new Anchor(Direction.Left, node.rect, node.rect.x - 4, node.rect.y + node.rect.height / 2 - 4, 8, 8)
  );
  node.anchors.push(
    new Anchor(
      Direction.Right,
      node.rect,
      node.rect.x + node.rect.width - 4,
      node.rect.y + node.rect.height / 2 - 4,
      8,
      8
    )
  );
}
