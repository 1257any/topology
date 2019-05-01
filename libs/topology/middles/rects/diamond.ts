import { Node } from '../../models/node';
import { Rect } from '../../models/rect';

export function diamondIconRect(node: Node) {
  let w = node.width / 3;
  let h = node.height / 3;
  if (w > h) {
    w = h;
  } else {
    h = w;
  }
  let top = node.width / 5;
  if (top < 10) {
    top = 10;
  }
  node.iconRect = new Rect(node.x + (node.width - w) / 2, node.y + top, w, h);
}

export function diamondTextRect(node: Node) {
  if (node.icon || node.image) {
    let bottom = node.height / 10;
    if (bottom < 5) {
      bottom = 0;
    }
    node.textRect = new Rect(
      node.x + node.width / 3,
      node.y + (node.height * 2) / 3 - bottom,
      node.width / 3,
      node.height / 3 - 5
    );
  } else {
    const w = node.width / 2;
    const h = (node.height * 1) / 2;
    node.textRect = new Rect(node.x + (node.width - w) / 2, node.y + node.height / 4, w, h);
  }
}
