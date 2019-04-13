import { Node } from '../../models/node';
import { Rect } from '../../models/rect';

export function circleIconRect(node: Node) {
  node.iconRect = new Rect(node.x + (node.width - 50) / 2, node.y + 10, 50, 50);
}

export function circleTextRect(node: Node) {
  if (node.icon || node.image) {
    node.textRect = new Rect(node.x + 10, node.y + 60, node.width - 20, node.height - 70);
    node.textRect = new Rect(
      node.x + node.width / 6,
      node.y + node.height / 6 + 60,
      (node.width * 4) / 6,
      (node.height * 4) / 6
    );
  } else {
    node.textRect = new Rect(
      node.x + node.width / 6,
      node.y + node.height / 6,
      (node.width * 4) / 6,
      (node.height * 4) / 6
    );
  }
}
