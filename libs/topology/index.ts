import { Options } from './options';
import { Node } from './models/node';
import { Point, hitPoint } from './models/point';
import { Line } from './models/line';
import { drawNodeFns, drawLineFns } from './middles/index';
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
  HoverAnchors,
  Line,
  LineControlPoint,
  Rotate
}

export class Topology {
  parentElem: HTMLElement;
  canvas = document.createElement('canvas');
  offscreen: Canvas;
  hoverLayer: HoverLayer;
  activeLayer: ActiveLayer;
  nodes: Node[] = [];
  lines: Line[] = [];
  options: Options;
  subcribe: Observer;

  lastHover: Node;
  hoverNode: Node;
  mouseDown: MouseEvent;
  moveIn = {
    type: MoveInType.None,
    activeAnchorIndex: 0,
    hoverAnchorIndex: 0,
    activeLine: null,
    controlPoint: null
  };
  selectedRect = new Rect(0, 0, 0, 0);
  fromArrowType = '';
  toArrowType = 'triangleSolid';
  scheduledAnimationFrame = false;
  constructor(parent: string | HTMLElement, options?: Options) {
    this.options = options || {};

    if (!this.options.font) {
      this.options.font = {
        color: '#555',
        fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
        fontSize: 12,
        lineHeight: 1.5,
        textAlign: 'center',
        textBaseline: 'middle'
      };
    }

    if (!this.options.rotateCursor) {
      this.options.rotateCursor = '/assets/img/rotate.cur';
    }

    if (!this.options.font.fontFamily) {
      this.options.font.fontFamily = '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial';
    }

    if (!this.options.font.color) {
      this.options.font.color = '#555';
    }
    if (!this.options.font.fontSize) {
      // px
      this.options.font.fontSize = 12;
    }
    if (!this.options.font.lineHeight) {
      // number
      this.options.font.lineHeight = 1.5;
    }
    if (!this.options.font.textAlign) {
      this.options.font.textAlign = 'center';
    }
    if (!this.options.font.textBaseline) {
      this.options.font.textBaseline = 'middle';
    }

    Store.set('lines', this.lines);

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
    if (!drawNodeFns[node.shapeName]) {
      return false;
    }

    // Deactive.
    this.deactiveNodes();
    this.offscreen.render();

    // New active.
    node.activeStrokeStyle = this.options.activeColor;
    this.activeLayer.nodes = [node];
    this.nodes.push(node);
    this.activeLayer.render();

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
          this.hoverLayer.nodes = [this.hoverNode];
          this.hoverLayer.render();
        } else if (this.lastHover) {
          // Clear hover anchors.
          this.hoverLayer.nodes = [];
          this.hoverLayer.canvas.height = this.hoverLayer.canvas.height;
        }

        if (this.moveIn.type === MoveInType.LineControlPoint) {
          this.hoverLayer.controlPoint = this.moveIn.controlPoint;
          this.hoverLayer.render();
        } else if (this.hoverLayer.controlPoint) {
          this.hoverLayer.controlPoint = null;
          this.hoverLayer.render();
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
          this.hoverLayer.lineTo(this.getLineDock(e), this.toArrowType);
          this.hoverLayer.render();
          break;
        case MoveInType.LineControlPoint:
          this.moveIn.activeLine.controlPoints[this.moveIn.controlPoint.id].x = e.offsetX;
          this.moveIn.activeLine.controlPoints[this.moveIn.controlPoint.id].y = e.offsetY;
          if (drawLineFns[this.moveIn.activeLine.name] && drawLineFns[this.moveIn.activeLine.name].dockControlPointFn) {
            drawLineFns[this.moveIn.activeLine.name].dockControlPointFn(
              this.moveIn.activeLine.controlPoints[this.moveIn.controlPoint.id],
              this.moveIn.activeLine
            );
          }
          this.activeLayer.render();
          this.hoverLayer.render();
          break;
        case MoveInType.Rotate:
          if (this.activeLayer.occupy) {
            this.activeLayer.offsetRotate(this.getAngle(e));
            this.activeLayer.render();
          }
          break;
      }
    });
  };

  onmousedown = (e: MouseEvent) => {
    this.mouseDown = e;

    Store.set('activeLine', null);

    if (this.moveIn.type !== MoveInType.Rotate) {
      if (!this.hoverNode) {
        // Deactive.
        this.deactiveNodes();

        // Click a line.
        if (this.moveIn.type === MoveInType.Line || this.moveIn.type === MoveInType.LineControlPoint) {
          this.moveIn.activeLine.activeStrokeStyle = this.options.activeColor;
          this.activeLayer.lines = [this.moveIn.activeLine];
          Store.set('activeLine', this.moveIn.activeLine);
          this.activeLayer.render();

          this.calcOffscreenLines();
          this.offscreen.render();
          return;
        }

        // Click the space.
        if (!this.activeLayer.occupy || !this.activeLayer.occupy.hit(e, 5)) {
          this.deactiveLines();
          this.offscreen.render();

          this.activeLayer.canvas.height = this.activeLayer.canvas.height;
          return;
        }
      }

      // Draw line.
      if (this.moveIn.type === MoveInType.HoverAnchors) {
        this.hoverLayer.setLine(
          {
            id: this.hoverNode.id,
            anchorIndex: this.moveIn.hoverAnchorIndex,
            direction: this.hoverNode.anchors[this.moveIn.hoverAnchorIndex].direction,
            x:
              this.hoverNode.anchors[this.moveIn.hoverAnchorIndex].x +
              this.hoverNode.anchors[this.moveIn.hoverAnchorIndex].width / 2,
            y:
              this.hoverNode.anchors[this.moveIn.hoverAnchorIndex].y +
              this.hoverNode.anchors[this.moveIn.hoverAnchorIndex].height / 2
          },
          this.fromArrowType
        );
      }

      // Select more.
      if (e.ctrlKey) {
        this.hoverNode.activeStrokeStyle = this.options.activeColor;
        this.activeLayer.addNode(this.hoverNode);
      } else if (this.hoverNode && !this.activeLayer.hasNode(this.hoverNode)) {
        this.hoverNode.activeStrokeStyle = this.options.activeColor;
        this.activeLayer.nodes = [this.hoverNode];
      }
    }

    this.calcActiveLines();

    this.calcOffscreenNodes();
    this.calcOffscreenLines();

    // Save initial rects to move.
    this.activeLayer.saveRects();

    this.activeLayer.render();
    this.offscreen.render();
  };

  onmouseup = (e: MouseEvent) => {
    this.mouseDown = null;
    this.hoverLayer.dockAnchor = null;

    if (this.hoverLayer.dragRect) {
      this.getSelectedNodes(this.nodes, this.hoverLayer.dragRect);
      this.calcActiveLines();

      this.calcOffscreenNodes();
      this.offscreen.render();
      this.activeLayer.render();
    }

    switch (this.moveIn.type) {
      // Add the line.
      case MoveInType.HoverAnchors:
        // Deactive.
        this.deactiveNodes();
        this.deactiveLines();

        // New active.
        if (this.hoverLayer.line && this.hoverLayer.line.to) {
          this.hoverLayer.line.activeStrokeStyle = this.options.activeColor;
          this.activeLayer.lines = [this.hoverLayer.line];
          Store.set('activeLine', this.hoverLayer.line);
          this.activeLayer.render();
        }

        this.calcOffscreenLines();
        this.offscreen.render();

        this.hoverLayer.clearLines();
        break;
      case MoveInType.Rotate:
        this.activeLayer.updateRotate();
        break;
    }

    this.hoverLayer.dragRect = null;
    this.hoverLayer.render();
  };

  calcActiveLines() {
    this.activeLayer.lines = [];
    for (const item of this.lines) {
      let found = false;
      for (const n of this.hoverLayer.lines) {
        if (item.id === n.id) {
          found = true;
          break;
        }
      }
      if (found) {
        continue;
      }

      for (const n of this.activeLayer.nodes) {
        if (item.from.id === n.id || (item.to && item.to.id === n.id)) {
          item.activeStrokeStyle = '';
          this.activeLayer.lines.push(item);
          break;
        }
      }
    }
  }

  calcOffscreenNodes() {
    this.offscreen.nodes = [];
    for (const item of this.nodes) {
      let found = false;
      for (const n of this.hoverLayer.nodes) {
        if (item.id === n.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        for (const n of this.activeLayer.nodes) {
          if (item.id === n.id) {
            found = true;
            break;
          }
        }
      }
      if (!found) {
        item.activeStrokeStyle = '';
        this.offscreen.nodes.push(item);
      }
    }
  }

  calcOffscreenLines() {
    this.offscreen.lines = [];
    for (const item of this.lines) {
      let found = false;
      for (const n of this.hoverLayer.lines) {
        if (item.id === n.id) {
          found = true;
          break;
        }
      }
      for (const n of this.activeLayer.lines) {
        if (item.id === n.id) {
          found = true;
          break;
        }
      }
      if (!found && item.to) {
        item.activeStrokeStyle = '';
        this.offscreen.lines.push(item);
      }
    }
  }

  deactiveNodes() {
    for (const item of this.activeLayer.nodes) {
      item.activeStrokeStyle = '';
      this.offscreen.nodes.push(item);
    }
    this.activeLayer.nodes = [];
  }

  deactiveLines() {
    for (const item of this.activeLayer.lines) {
      item.activeStrokeStyle = '';
      if (item.to) {
        this.offscreen.lines.push(item);
      }
    }
    this.activeLayer.lines = [];
  }

  getHoverNode(e: MouseEvent, nodes: Node[]) {
    let node: Node;
    for (let i = nodes.length - 1; i >= 0; --i) {
      if (nodes[i].rect.hit(e, 10)) {
        node = nodes[i];
        this.moveIn.type = MoveInType.Nodes;
        break;
      }
    }

    return node;
  }

  getMoveIn(e: MouseEvent) {
    if (this.mouseDown) {
      return;
    }

    this.moveIn.type = MoveInType.None;
    this.moveIn.controlPoint = null;

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
      if (
        e.offsetX > this.activeLayer.occupy.x + this.activeLayer.occupy.width / 2 - 5 &&
        e.offsetX < this.activeLayer.occupy.x + this.activeLayer.occupy.width / 2 + 5 &&
        e.offsetY > this.activeLayer.occupy.y - 30 &&
        e.offsetY < this.activeLayer.occupy.y - 20
      ) {
        this.moveIn.type = MoveInType.Rotate;
        this.hoverLayer.canvas.style.cursor = `url("${this.options.rotateCursor}"), auto`;
      } else {
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
    }

    if (this.moveIn.type === MoveInType.ActiveAnchors || this.moveIn.type === MoveInType.Rotate) {
      return;
    }

    // In anchors of hoverNode
    if (this.hoverNode) {
      for (let i = 0; i < this.hoverNode.anchors.length; ++i) {
        if (this.hoverNode.anchors[i].hit(e, 7)) {
          this.moveIn.type = MoveInType.HoverAnchors;
          this.moveIn.hoverAnchorIndex = i;
          this.hoverLayer.canvas.style.cursor = 'crosshair';
          break;
        }
      }
    }

    if (this.moveIn.type !== MoveInType.None) {
      return;
    }

    // In line
    let index = 0;
    for (const item of this.lines) {
      ++index;
      if (!item.to) {
        this.lines.splice(index - 1, 1);
        continue;
      }
      let i = 0;
      for (const pt of item.controlPoints) {
        if (hitPoint(e, pt)) {
          pt.id = i;
          this.moveIn.type = MoveInType.LineControlPoint;
          this.moveIn.controlPoint = pt;
          this.moveIn.activeLine = item;
          this.hoverLayer.canvas.style.cursor = 'pointer';
          return;
        }
        ++i;
      }
      if (item.pointIn(e)) {
        this.moveIn.type = MoveInType.Line;
        this.moveIn.activeLine = item;
        this.hoverLayer.canvas.style.cursor = 'pointer';
        break;
      }
    }
  }

  getLineDock(e: MouseEvent) {
    const point: Point = { x: e.offsetX, y: e.offsetY };
    this.hoverLayer.dockAnchor = null;
    for (const item of this.nodes) {
      if (item.id === this.hoverNode.id) {
        continue;
      }

      if (item.rect.hit(e, 10)) {
        this.hoverLayer.nodes.push(item);
      }
      for (let i = 0; i < item.anchors.length; ++i) {
        if (item.anchors[i].hit(e, 10)) {
          point.id = item.id;
          point.anchorIndex = i;
          point.direction = item.anchors[point.anchorIndex].direction;
          point.x = item.anchors[point.anchorIndex].x + item.anchors[point.anchorIndex].width / 2;
          point.y = item.anchors[point.anchorIndex].y + item.anchors[point.anchorIndex].height / 2;
          this.hoverLayer.dockAnchor = item.anchors[i];
          break;
        }
      }

      if (point.id) {
        break;
      }
    }

    return point;
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
      if (rect.hitRect(item.rect)) {
        this.activeLayer.addNode(item);
      }

      if (item.children) {
        this.getSelectedNodes(item.children, rect);
      }
    }
  }

  getAngle(e: MouseEvent) {
    if (e.offsetX === this.activeLayer.occupy.centerX) {
      return e.offsetY <= this.activeLayer.occupy.centerY ? 0 : 180;
    }

    if (e.offsetY === this.activeLayer.occupy.centerY) {
      return e.offsetX < this.activeLayer.occupy.centerX ? 270 : 90;
    }

    const x = e.offsetX - this.activeLayer.occupy.centerX;
    const y = e.offsetY - this.activeLayer.occupy.centerY;
    let angle = (Math.atan(Math.abs(x / y)) / (2 * Math.PI)) * 360;
    if (x > 0 && y > 0) {
      angle = 180 - angle;
    } else if (x < 0 && y > 0) {
      angle += 180;
    } else if (x < 0 && y < 0) {
      angle = 360 - angle;
    }
    return angle;
  }

  destory() {
    this.subcribe.unsubcribe();
  }
}
