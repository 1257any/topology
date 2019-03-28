export enum NodeType {
  Shape,
  Line,
  Image,
  Text,
  Group
}

export class Node {
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  text: string;
  drawFn: string;
  type: NodeType = NodeType.Shape;
  children: Node[] = [];
  data?: any;
}
