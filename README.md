English | [简体中文](./README.CN.md)

# Le5le-topology

Le5le-topology is a diagram visualization framework uses canvas and typescript. Developers are able to build diagram (topology, UML) and analysis micro-services architecture application easily.

- [→ Home website, online diagramming](http://topology.le5le.com) . It is very slow while open the site for my network speed is 1Mb/s.
- [→ Online Demo](https://alsmile.github.io/topology/index.html)

# Why le5le-topology

- Extensible - Developers are able to make own diagrams easily. You just have to focus on your core logic in the framework.
- Fast rendering - It uses canvas and offscreen.
- Animate - Can be used the details of networking and tracking.
- TypeScript.

# Source

```
- libs
  |- topology  // The topogoly-core lib source.
- src  // The topology.le5le.com source that uses angular.
- demo // The demo uses js.
```

# Getting Started

```
import { Topology } from 'togology-core';


var canvas = new Topology('topo-dom', options);
canvas.render(data, true);

```

# Docs

[Todo]

[→ Chinese docs](https://www.yuque.com/alsmile/topology/about)

# Development

## Make your diagrams

- Step 1:

[→ Reference](https://github.com/le5le-com/topology/tree/master/libs/topology-flow-diagram/display)

```
export function diagram(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  // ...
  ctx.fill();
  ctx.stroke();
}

// [Option] The default is same to rectangle.
export function diagramIconRect(node: Node) {
  let w = node.rect.width / 3;
  let h = node.rect.height / 3;
  if (w > h) {
    w = h;
  } else {
    h = w;
  }
  let top = node.rect.width / 5;
  if (top < 10) {
    top = 10;
  }
  node.iconRect = new Rect(node.rect.x + (node.rect.width - w) / 2, node.rect.y + top, w, h);
}

// [Option] The default is same to rectangle.
// fullTextRect - Only text.
// iconTextRect - Incloud icon and text.
export function diagramTextRect(node: Node) {
  let bottom = node.rect.height / 10;
  if (bottom < 5) {
    bottom = 0;
  }
  node.iconTextRect = new Rect(
    node.rect.x + node.rect.width / 3,
    node.rect.y + (node.rect.height * 2) / 3 - bottom,
    node.rect.width / 3,
    node.rect.height / 3 - 5
  );

  const w = node.rect.width / 2;
  const h = (node.rect.height * 1) / 2;
  node.fullTextRect = new Rect(node.rect.x + (node.rect.width - w) / 2, node.rect.y + node.rect.height / 4, w, h);
}

// [Option] The default is same to rectangle.
export function diagramAnchors(node: Node) {
  node.anchors.push(new Point(node.rect.x + node.rect.width / 2, node.rect.y, Direction.Up));
  node.anchors.push(new Point(node.rect.x + node.rect.width, node.rect.y + node.rect.height / 2, Direction.Right));
  node.anchors.push(new Point(node.rect.x + node.rect.width / 2, node.rect.y + node.rect.height, Direction.Bottom));
  node.anchors.push(new Point(node.rect.x, node.rect.y + node.rect.height / 2, Direction.Left));
}
```

- Step 2:

[→ Reference](https://github.com/le5le-com/topology/blob/master/demo/index.js)

```
// registerNode: Register a custom node.
// name - The name of node.
// drawFn - How to draw.
// anchorsFn - How to get the anchors.
// iconRectFn - How to get the icon rect.
// textRectFn - How to get the text rect.
// force - Overwirte the node if exists.
registerNode(
name: string,
drawFn: (ctx: CanvasRenderingContext2D, node: Node) => void,
anchorsFn?: (node: Node) => void,
iconRectFn?: (node: Node) => void,
textRectFn?: (node: Node) => void,
force?: boolean
);

```

## Angular project

```
$ yarn or npm install

# build watching file changes and run angular project
$ npm start


# build
$ npm run build

```

## Topology-core lib

```
[libs/topology#] yarn or npm install

# build
[libs/topology#] npm run build

```

## Topology-flow-diagram lib

```
[libs/topology#] yarn or npm install

# build
[libs/topology-flow-diagram#] npm run build

```

## Demo

```
[demo#] yarn or npm install

# build
[demo#] npm run build

```

# How to Contribute

If you have any comment or advice, please report your issue, or make any change as you wish and submit an PR.

alsmile123@qq.com

# License

MIT © le5le.com
