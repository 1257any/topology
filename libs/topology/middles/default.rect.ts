import { Node } from '../models/node';
import { Rect } from '../models/rect';

export function defaultIconRect(node: Node) {
  if (node.name === 'image') {
    node.iconRect = new Rect(node.rect.x, node.rect.y, node.rect.width, node.rect.height);
  } else {
    let w = (node.rect.width * 2) / 3;
    let h = (node.rect.height * 2) / 3;
    if (w > h) {
      w = h;
    } else {
      h = w;
    }
    node.iconRect = new Rect(node.rect.x + (node.rect.width - w) / 2 + 10, node.rect.y + 10, w - 20, h - 20);
  }
}

export function defaultTextRect(node: Node) {
  if (node.name === 'image') {
    node.iconTextRect = new Rect(node.rect.x, node.rect.y + node.rect.height, node.rect.width, node.rect.height);
  } else {
    node.iconTextRect = new Rect(
      node.rect.x + 10,
      node.rect.y + (node.rect.height * 2) / 3,
      node.rect.width - 20,
      node.rect.height / 3 - 5
    );
  }
  node.fullTextRect = new Rect(node.rect.x + 10, node.rect.y + 10, node.rect.width - 20, node.rect.height - 20);
}
