import { Node } from '../../models/node';
import { Anchor } from '../../models/anchor';
import { Direction } from '../../models/direction';

export function defaultAnchors(node: Node) {
  // up
  node.anchors.push(new Anchor(Direction.Up, node.rect, node.rect.x + node.rect.width / 2 - 4, node.rect.y - 4, 8, 8));
  // right
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
  // bottom
  node.anchors.push(
    new Anchor(
      Direction.Bottom,
      node.rect,
      node.rect.x + node.rect.width / 2 - 4,
      node.rect.y + node.rect.height - 4,
      8,
      8
    )
  );
  // left
  node.anchors.push(
    new Anchor(Direction.Left, node.rect, node.rect.x - 4, node.rect.y + node.rect.height / 2 - 4, 8, 8)
  );
}
