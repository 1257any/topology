[English](./README.md) | 简体中文

# Le5le-topology

Le5le-topology 是一个可视化在线绘图工具，使用 Canvas + Typescript。可以很方便的绘制各种如 topology, UML 等图；还可以很方便的分析微服务之间的关联关系、动态流量等。

- [→ 在线画图官网](http://topology.le5le.com) ，网站可能比较慢，个人申请的云服务器带宽仅仅 1M。
- [→ 在线 Demo](https://alsmile.github.io/topology/index.html)

# 特性

- 极易扩展 - 程序员可以以中间件方式编写自己的图表。框架实现了拖曳、缩放、旋转、自定义属性等基础操作，开发者只用关心图表绘画实现即可。
- 流畅、高性能 - 使用 canvas 和多个场景离屏，操作过程流畅；完全不用担心 SVG 方式 dom 元素过多，性能高效。
- 动画特效 - 目前暂实现了线条动画，可用于展示微服务直接的调用关系和流量演示。
- TypeScript - 使用 TypeScript 编写，支持导出到 es6 和 TypeScript 中。

# 源码结构

```
- libs
  |- topology  // topogoly-core库源码
- src  // 官网源码.
- demo // demo
```

# 快速上手

```
import { Topology } from 'togology-core';


var canvas = new Topology('topo-dom', options);
canvas.render(data, true);

```

# 文档

[Todo]

# 开发

## 扩展定制自己的图

- 第 1 步: 绘制节点 node 的样式

```
// 节点node绘图函数
export function diagram(ctx: CanvasRenderingContext2D, node: Node) {
  ctx.beginPath();
  // ...
  ctx.fill();
  ctx.stroke();
}

// [可选] 计算节点node图标区域，默认使用矩形相关函数.
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

// [可选] 计算节点node文字区域，默认使用矩形相关函数.
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

// [可选] 计算节点node可连线的锚点，默认使用矩形相关函数.
export function diagramAnchors(node: Node) {
  node.anchors.push(new Point(node.rect.x + node.rect.width / 2, node.rect.y, Direction.Up));
  node.anchors.push(new Point(node.rect.x + node.rect.width, node.rect.y + node.rect.height / 2, Direction.Right));
  node.anchors.push(new Point(node.rect.x + node.rect.width / 2, node.rect.y + node.rect.height, Direction.Bottom));
  node.anchors.push(new Point(node.rect.x, node.rect.y + node.rect.height / 2, Direction.Left));
}
```

- 第 2 步: 注册节点 node

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

[在线画图官网](https://topology.le5le.com) 前端源码

```
$ yarn or npm install

# build watching file changes and run angular project
$ npm start


# build
$ npm run build

```

## Topology-core lib

核心库源码

```
[libs/topology#] yarn or npm install

# build
[libs/topology#] npm run build

```

## Topology-flow-diagram lib

流程图源码

```
[libs/topology#] yarn or npm install

# build
[libs/topology-flow-diagram#] npm run build

```

## Demo

demo 源码

```
[demo#] yarn or npm install

# build
[demo#] npm run build

```

# 贡献

有任何建议或问题可以在 issue 提出；或提供一个 pr。

alsmile123@qq.com

# License

MIT © le5le.com
