import { Options } from './options';
import { Node } from './models/node';
import { drawFns, anchorsFns } from './middles/index';
import { Canvas } from './canvas';
import { Store } from './store/store';
import { Observer } from './store/observer';
import { HoverLayer } from './hoverLayer';
import { ActiveLayer } from './activeLayer';
import { Rect } from './models/rect';

const resizeCursors = ['nw-resize', 'ne-resize', 'se-resize', 'sw-resize'];
enum MoveInType {
  None,
  Nodes,
  ActiveAnchors,
  HoverAnchors
}

export class Topology {
  parentElem: HTMLElement;
  canvas = document.createElement('canvas');
  offscreen: Canvas;
  hoverLayer: HoverLayer;
  activeLayer: ActiveLayer;
  nodes: Node[] = [];
  options: Options;
  subcribe: Observer;

  lastHover: Node;
  hoverNode: Node;
  mouseDown: MouseEvent;
  moveIn = {
    type: MoveInType.None,
    activeAnchorIndex: 0,
    hoverAnchorIndex: 0
  };
  selectedRect = new Rect(0, 0, 0, 0);
  scheduledAnimationFrame = false;
  constructor(parent: string | HTMLElement, options?: Options) {
    this.options = options || {};

    if (!this.options.style) {
      this.options.style = {};
    }

    if (!this.options.style.fontFamily) {
      this.options.style.fontFamily = '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial';
    }

    if (!this.options.style.fontSize) {
      // px
      this.options.style.fontSize = 12;
    }
    if (!this.options.style.lineHeight) {
      // number
      this.options.style.lineHeight = 1.5;
    }

    if (typeof parent === 'string') {
      this.parentElem = document.getElementById(parent);
    } else {
      this.parentElem = parent;
    }

    this.offscreen = new Canvas(this.options);

    this.parentElem.appendChild(this.canvas);
    this.activeLayer = new ActiveLayer(this.parentElem, this.options);
    this.hoverLayer = new HoverLayer(this.parentElem, this.options);

    this.resize();

    this.hoverLayer.canvas.ondragover = event => event.preventDefault();
    this.hoverLayer.canvas.ondrop = event => {
      this.ondrop(event);
    };

    this.subcribe = Store.subcribe('render', () => {
      this.render();
    });

    this.hoverLayer.canvas.onmousemove = this.onMouseMove;
    this.hoverLayer.canvas.onmousedown = this.onmousedown;
    this.hoverLayer.canvas.onmouseup = this.onmouseup;
  }

  resize() {
    if (this.options.width && this.options.width !== 'auto') {
      this.canvas.width = +this.options.width;
    } else {
      this.canvas.width = this.parentElem.clientWidth;
    }
    if (this.options.height && this.options.height !== 'auto') {
      this.canvas.height = +this.options.height;
    } else {
      this.canvas.height = this.parentElem.clientHeight;
    }

    this.offscreen.resize(this.canvas.width, this.canvas.height);
    this.hoverLayer.resize(this.canvas.width, this.canvas.height);
    this.activeLayer.resize(this.canvas.width, this.canvas.height);
  }

  ondrop(event: DragEvent) {
    event.preventDefault();
    const node = JSON.parse(event.dataTransfer.getData('Text'));

    node.x = event.offsetX - ((node.width / 2 + 0.5) << 0);

    node.y = event.offsetY - ((node.height / 2 + 0.5) << 0);
    this.addNode(new Node(node));
  }

  addNode(node: Node): boolean {
    if (!drawFns[node.shapeName]) {
      return false;
    }

    this.offscreen.nodes.push.apply(this.offscreen.nodes, this.activeLayer.nodes);
    this.offscreen.render();

    this.activeLayer.clearNodes();
    if (this.activeLayer.addNode(node)) {
      this.nodes.push(node);
      this.activeLayer.render();
    }

    return true;
  }

  render(nodes?: Node[]) {
    if (nodes) {
      this.nodes = nodes;
      this.offscreen.nodes = nodes;
      this.activeLayer.nodes = [];
    }

    // 清空画布
    this.canvas.height = this.canvas.height;
    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.offscreen.canvas, 0, 0);
  }

  onMouseMove = (e: MouseEvent) => {
    if (this.scheduledAnimationFrame) {
      return;
    }

    this.scheduledAnimationFrame = true;
    requestAnimationFrame(() => {
      this.scheduledAnimationFrame = false;
      this.getMoveIn(e);

      if (!this.mouseDown) {
        // Render hover anchors.
        if (this.hoverNode) {
          this.hoverLayer.setNodes([this.hoverNode]);
          this.hoverLayer.render();
        } else if (this.lastHover) {
          // Clear hover anchors.
          this.hoverLayer.nodes = [];
          this.hoverLayer.canvas.height = this.hoverLayer.canvas.height;
        }

        return;
      }

      switch (this.moveIn.type) {
        case MoveInType.None:
          this.hoverLayer.dragRect = new Rect(
            this.mouseDown.offsetX,
            this.mouseDown.offsetY,
            e.offsetX - this.mouseDown.offsetX,
            e.offsetY - this.mouseDown.offsetY
          );
          this.hoverLayer.render();
          break;
        case MoveInType.Nodes:
          this.activeLayer.moveNodes(
            new Rect(e.offsetX, e.offsetY, e.offsetX - this.mouseDown.offsetX, e.offsetY - this.mouseDown.offsetY)
          );
          this.hoverLayer.render();
          break;
        case MoveInType.ActiveAnchors:
          this.activeLayer.resizeNodes(this.moveIn.activeAnchorIndex, e);
          this.hoverLayer.render();
          break;
        case MoveInType.HoverAnchors:
          break;
      }
    });
  };

  onmousedown = (e: MouseEvent) => {
    this.mouseDown = e;

    // Click the space.
    if (!this.hoverNode && (!this.activeLayer.occupy || !this.activeLayer.occupy.hit(e, 5))) {
      this.offscreen.nodes.push.apply(this.offscreen.nodes, this.activeLayer.nodes);
      this.offscreen.render();

      this.activeLayer.nodes = [];
      this.activeLayer.canvas.height = this.activeLayer.canvas.height;
      return;
    }

    // Select more.
    if (e.ctrlKey) {
      this.activeLayer.addNode(this.hoverNode);
    } else if (this.hoverNode && !this.activeLayer.hasNode(this.hoverNode)) {
      this.activeLayer.setNodes([this.hoverNode]);
    }

    this.offscreenNodes();

    // Save the rects for move.
    this.activeLayer.saveRects();

    this.activeLayer.render();
    this.offscreen.render();
  };

  onmouseup = (e: MouseEvent) => {
    this.mouseDown = null;

    if (this.hoverLayer.dragRect) {
      this.getSelectedNodes(this.nodes, this.hoverLayer.dragRect);
      this.offscreenNodes();
      this.offscreen.render();
      this.activeLayer.render();
    }

    this.hoverLayer.dragRect = null;
    this.hoverLayer.render();
  };

  offscreenNodes() {
    this.offscreen.nodes = [];
    for (const item of this.nodes) {
      let found = false;
      for (const n of this.activeLayer.nodes) {
        if (item.id === n.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.offscreen.nodes.push(item);
      }
    }
  }

  getHoverNode(e: MouseEvent, nodes: Node[]) {
    let node: Node;
    for (let i = nodes.length - 1; i >= 0; --i) {
      if (nodes[i].hit(e, 10)) {
        node = nodes[i];
        this.moveIn.type = MoveInType.Nodes;
        if (!nodes[i].children || !nodes[i].children.length) {
          break;
        }

        const child = this.getHoverNode(e, nodes[i].children);
        if (child) {
          node = child;
        }
      }
    }

    return node;
  }

  getMoveIn(e: MouseEvent) {
    if (this.mouseDown) {
      return;
    }

    this.moveIn.type = MoveInType.None;

    // In nodes
    this.lastHover = this.hoverNode;
    this.hoverNode = this.getHoverNode(e, this.nodes);
    if (this.hoverNode) {
      this.hoverLayer.canvas.style.cursor = 'move';
    } else {
      this.hoverLayer.canvas.style.cursor = 'default';
    }

    // In activeLayer
    if (this.activeLayer.occupy) {
      if (this.activeLayer.occupy.hit(e)) {
        this.moveIn.type = MoveInType.Nodes;
        this.hoverLayer.canvas.style.cursor = 'move';
      }

      for (let i = 0; i < this.activeLayer.anchors.length; ++i) {
        if (this.activeLayer.anchors[i].hit(e)) {
          this.moveIn.type = MoveInType.ActiveAnchors;
          this.moveIn.activeAnchorIndex = i;
          this.hoverLayer.canvas.style.cursor = resizeCursors[i];
          break;
        }
      }
    }

    if (this.moveIn.type === MoveInType.ActiveAnchors || !this.hoverNode) {
      return;
    }

    // In anchors of hoverNode
    for (let i = 0; i < this.hoverNode.anchors.length; ++i) {
      if (this.hoverNode.anchors[i].hit(e, 7)) {
        this.moveIn.type = MoveInType.HoverAnchors;
        this.moveIn.hoverAnchorIndex = i;
        this.hoverLayer.canvas.style.cursor = 'crosshair';
        break;
      }
    }
  }

  getSelectedNodes(nodes: Node[], rect: Rect) {
    if (rect.width < 0) {
      rect.width = -rect.width;
      rect.x = rect.ex;
      rect.ex = rect.x + rect.width;
    }
    if (rect.height < 0) {
      rect.height = -rect.height;
      rect.y = rect.ey;
      rect.ey = rect.y + rect.height;
    }
    for (const item of nodes) {
      if (rect.hitRect(item)) {
        this.activeLayer.addNode(item);
      }

      if (item.children) {
        this.getSelectedNodes(item.children, rect);
      }
    }
  }

  destory() {
    this.subcribe.unsubcribe();
  }
}
