import { Node } from '../../models/node';
import { Rect } from '../../models/rect';

export function triangleIconRect(node: Node) {
  let w = (node.width * 2) / 7;
  let h = (node.height * 2) / 7;
  if (w > h) {
    w = h;
  } else {
    h = w;
  }
  let top = w;
  if (top < 10) {
    top = 10;
  }
  node.iconRect = new Rect(node.x + (node.width - w) / 2, node.y + top, w, h);
}

export function triangleTextRect(node: Node) {
  if (node.icon || node.image) {
    node.textRect = new Rect(
      node.x + node.width / 4,
      node.y + (node.height * 2) / 3,
      node.width / 2,
      node.height / 3 - 5
    );
  } else {
    const w = node.width / 2;
    const h = (node.height * 3) / 7;
    node.textRect = new Rect(node.x + (node.width - w) / 2, node.y + node.height / 2 - 5, w, h);
  }
}
