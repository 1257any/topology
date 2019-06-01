import { Options } from './options';
import { Node } from './models/node';
import { Point } from './models/point';
import { Line } from './models/line';
import { drawNodeFns, drawLineFns } from './middles/index';
import { Canvas } from './canvas';
import { Store } from './store/store';
import { Observer } from './store/observer';
import { HoverLayer } from './hoverLayer';
import { ActiveLayer } from './activeLayer';
import { Rect } from './models/rect';
import { pointInRect } from './middles/draws/nodes/rect';

const resizeCursors = ['nw-resize', 'ne-resize', 'se-resize', 'sw-resize'];
enum MoveInType {
  None,
  Line,
  LineControlPoint,
  Nodes,
  ResizeCP,
  HoverAnchors,
  Rotate
}

interface ICanvasData {
  nodes: Node[];
  lines: Line[];
}

interface ICanvasCache {
  index: number;
  list: ICanvasData[];
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
  private subcribe: Observer;

  lastHoverNode: Node;
  input = document.createElement('input');
  inputNode: Node;
  mouseDown: MouseEvent;
  moveIn = {
    type: MoveInType.None,
    activeAnchorIndex: 0,
    hoverAnchorIndex: 0,
    hoverNode: null,
    hoverLine: null,
    lineControlPoint: null
  };
  nodesMoved = false;

  fromArrowType = '';
  toArrowType = 'triangleSolid';

  private scheduledAnimationFrame = false;

  private caches: ICanvasCache = {
    index: 0,
    list: []
  };

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
    this.hoverLayer.canvas.ondblclick = this.ondblclick;
    this.hoverLayer.canvas.tabIndex = 0;
    this.hoverLayer.canvas.onkeydown = this.onkeydown;

    this.input.style.position = 'absolute';
    this.input.style.zIndex = '-1';
    this.input.style.left = '-1000px';
    this.input.style.width = '0';
    this.input.style.height = '0';
    this.input.style.outline = 'none';
    this.input.style.border = '1px solid #cdcdcd';
    this.parentElem.appendChild(this.input);

    this.cache();
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
      this.canvas.height = this.parentElem.clientHeight - 8;
    }

    this.offscreen.resize(this.canvas.width, this.canvas.height);
    this.hoverLayer.resize(this.canvas.width, this.canvas.height);
    this.activeLayer.resize(this.canvas.width, this.canvas.height);
  }

  private ondrop(event: DragEvent) {
    event.preventDefault();
    const node = JSON.parse(event.dataTransfer.getData('Text'));
    node.rect = node.rect || {};
    node.rect.x = event.offsetX - ((node.width / 2 + 0.5) << 0);
    node.rect.y = event.offsetY - ((node.height / 2 + 0.5) << 0);
    this.addNode(new Node(node));
  }

  addNode(node: Node): boolean {
    if (!drawNodeFns[node.name]) {
      return false;
    }

    // Deactive.
    this.deactiveNodes();
    this.offscreen.render(true);

    // New active.
    node.activeStrokeStyle = this.options.activeColor;
    this.activeLayer.setNodes([node]);
    this.nodes.push(node);
    this.activeLayer.render();

    this.hoverLayer.canvas.focus();

    this.cache();

    return true;
  }

  render(data?: ICanvasData, json?: boolean) {
    if (data) {
      this.activeLayer.nodes = [];
      this.activeLayer.lines = [];
      this.hoverLayer.nodes = [];
      this.hoverLayer.lines = [];
      this.offscreen.nodes = [];
      this.offscreen.lines = [];

      this.nodes.splice(0, this.nodes.length);
      this.lines.splice(0, this.lines.length);
      if (json) {
        for (const item of data.nodes) {
          this.nodes.push(new Node(item));
        }
        for (const item of data.lines) {
          this.lines.push(new Line(item));
        }
      } else {
        this.nodes.push.apply(this.nodes, data.nodes);
        this.lines.push.apply(this.lines, data.lines);
      }

      this.offscreen.nodes.push.apply(this.offscreen.nodes, this.nodes);
      this.offscreen.lines.push.apply(this.offscreen.lines, this.lines);
      this.offscreen.render();
      this.activeLayer.render();
      this.hoverLayer.render();
    }

    // 清空画布
    this.canvas.height = this.canvas.height;
    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.offscreen.canvas, 0, 0);
  }

  private onMouseMove = (e: MouseEvent) => {
    if (this.scheduledAnimationFrame) {
      return;
    }

    this.scheduledAnimationFrame = true;
    requestAnimationFrame(() => {
      this.scheduledAnimationFrame = false;

      if (!this.mouseDown) {
        this.getMoveIn(e);

        // Render hover anchors.
        if (this.moveIn.hoverNode) {
          this.hoverLayer.nodes = [this.moveIn.hoverNode];
          this.hoverLayer.render();

          // Send a move event.
          if (this.options.on) {
            this.options.on('moveInNode', this.moveIn.hoverNode);
          }
        } else if (this.lastHoverNode) {
          // Clear hover anchors.
          this.hoverLayer.nodes = [];
          this.hoverLayer.canvas.height = this.hoverLayer.canvas.height;

          // Send a move event.
          if (this.options.on) {
            this.options.on('moveOutNode', null);
          }
        }

        if (this.moveIn.type === MoveInType.LineControlPoint) {
          this.hoverLayer.lineControlPoint = this.moveIn.lineControlPoint;
          this.hoverLayer.render();
        } else if (this.hoverLayer.lineControlPoint) {
          this.hoverLayer.lineControlPoint = null;
          this.hoverLayer.render();
        }

        return;
      }

      const out = e.offsetX + 50 > this.hoverLayer.canvas.width || e.offsetY + 50 > this.hoverLayer.canvas.height;
      if (out) {
        if (e.offsetX + 50 > this.hoverLayer.canvas.width) {
          this.canvas.width += 200;
        }
        if (e.offsetY + 50 > this.hoverLayer.canvas.height) {
          this.canvas.height += 200;
        }

        this.offscreen.canvas.width = this.canvas.width;
        this.offscreen.canvas.height = this.canvas.height;
        this.hoverLayer.canvas.width = this.canvas.width;
        this.hoverLayer.canvas.height = this.canvas.height;
        this.activeLayer.canvas.width = this.canvas.width;
        this.activeLayer.canvas.height = this.canvas.height;

        // Send a resize event.
        if (this.options.on) {
          this.options.on('resize', {
            width: this.canvas.width,
            height: this.canvas.height
          });
        }
      }

      switch (this.moveIn.type) {
        case MoveInType.None:
          this.hoverLayer.dragRect = new Rect(
            this.mouseDown.offsetX,
            this.mouseDown.offsetY,
            e.offsetX - this.mouseDown.offsetX,
            e.offsetY - this.mouseDown.offsetY
          );
          if (!out) {
            this.hoverLayer.render();
          }
          break;
        case MoveInType.Nodes:
          this.nodesMoved = true;
          this.activeLayer.moveNodes(
            new Rect(e.offsetX, e.offsetY, e.offsetX - this.mouseDown.offsetX, e.offsetY - this.mouseDown.offsetY)
          );
          if (!out) {
            this.hoverLayer.render();
          }
          break;
        case MoveInType.ResizeCP:
          this.activeLayer.resizeNodes(this.moveIn.activeAnchorIndex, e);
          if (!out) {
            this.hoverLayer.render();
          }
          break;
        case MoveInType.HoverAnchors:
          this.hoverLayer.lineTo(this.getLineDock(e), this.toArrowType);
          if (!out) {
            this.hoverLayer.render();
          }
          break;
        case MoveInType.LineControlPoint:
          this.moveIn.hoverLine.controlPoints[this.moveIn.lineControlPoint.id].x = e.offsetX;
          this.moveIn.hoverLine.controlPoints[this.moveIn.lineControlPoint.id].y = e.offsetY;
          if (drawLineFns[this.moveIn.hoverLine.name] && drawLineFns[this.moveIn.hoverLine.name].dockControlPointFn) {
            drawLineFns[this.moveIn.hoverLine.name].dockControlPointFn(
              this.moveIn.hoverLine.controlPoints[this.moveIn.lineControlPoint.id],
              this.moveIn.hoverLine
            );
          }
          if (!out) {
            this.activeLayer.render();
            this.hoverLayer.render();
          }
          break;
        case MoveInType.Rotate:
          if (this.activeLayer.nodes.length) {
            this.activeLayer.offsetRotate(this.getAngle(e));
            this.activeLayer.updateLines();
            if (!out) {
              this.activeLayer.render();
            }
          }
          break;
      }

      if (out) {
        this.hoverLayer.render();
        this.activeLayer.render();
        this.offscreen.render(true);
      }
    });
  };

  private onmousedown = (e: MouseEvent) => {
    this.mouseDown = e;

    Store.set('activeLine', null);

    if (this.inputNode) {
      this.inputNode.text = this.input.value;
      this.input.style.zIndex = '-1';
      this.input.style.left = '-1000px';
      this.input.style.width = '0';
      this.inputNode = null;
      this.cache();
    }

    if (this.moveIn.type !== MoveInType.Rotate) {
      // Click a line.
      if (this.moveIn.type === MoveInType.Line || this.moveIn.type === MoveInType.LineControlPoint) {
        this.moveIn.hoverLine.activeStrokeStyle = this.options.activeColor;
        this.activeLayer.lines = [this.moveIn.hoverLine];
        Store.set('activeLine', this.moveIn.hoverLine);
        this.activeLayer.render();

        this.calcOffscreenLines();
        this.offscreen.render(true);

        if (this.options.on) {
          this.options.on('line', this.moveIn.hoverLine);
        }
        return;
      }

      // Click the space.
      if (this.moveIn.type < MoveInType.Nodes) {
        // Deactive.
        this.deactiveNodes();

        if (this.options.on) {
          this.options.on('space', null);
        }

        if (!pointInRect({ x: e.offsetX, y: e.offsetY }, this.activeLayer.sizeCPs)) {
          this.deactiveLines();
          this.offscreen.render(true);

          this.activeLayer.canvas.height = this.activeLayer.canvas.height;
          return;
        }
      }

      // Draw line.
      if (this.moveIn.type === MoveInType.HoverAnchors) {
        this.hoverLayer.setLine(
          new Point(
            this.moveIn.hoverNode.rotatedAnchors[this.moveIn.hoverAnchorIndex].x,
            this.moveIn.hoverNode.rotatedAnchors[this.moveIn.hoverAnchorIndex].y,
            this.moveIn.hoverNode.rotatedAnchors[this.moveIn.hoverAnchorIndex].direction,
            this.moveIn.hoverAnchorIndex,
            this.moveIn.hoverNode.id
          ),
          this.fromArrowType
        );
      }

      // Select more.
      if (e.ctrlKey) {
        this.moveIn.hoverNode.activeStrokeStyle = this.options.activeColor;
        this.activeLayer.addNode(this.moveIn.hoverNode);

        if (this.options.on) {
          this.options.on('nodes', this.activeLayer.nodes);
        }
      } else if (this.moveIn.hoverNode && !this.activeLayer.hasNode(this.moveIn.hoverNode)) {
        this.moveIn.hoverNode.activeStrokeStyle = this.options.activeColor;
        this.activeLayer.setNodes([this.moveIn.hoverNode]);

        if (this.options.on) {
          this.options.on('node', this.moveIn.hoverNode);
        }
      }
    }

    this.calcActiveLines();

    this.calcOffscreenNodes();
    this.calcOffscreenLines();

    // Save node rects to move.
    this.activeLayer.saveNodeRects();

    this.activeLayer.render();
    this.offscreen.render(true);
  };

  private onmouseup = (e: MouseEvent) => {
    this.mouseDown = null;
    this.hoverLayer.dockAnchor = null;

    if (this.hoverLayer.dragRect) {
      this.getRectNodes(this.nodes, this.hoverLayer.dragRect);
      this.calcActiveLines();
      this.calcOffscreenNodes();
      this.offscreen.render(true);
      this.activeLayer.render();

      if (this.options.on) {
        this.options.on('nodes', this.activeLayer.nodes);
      }
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
        this.offscreen.render(true);

        this.hoverLayer.clearLines();
        break;
      case MoveInType.Rotate:
        this.activeLayer.updateRotate();
        this.activeLayer.render();
        break;
    }

    this.hoverLayer.dragRect = null;
    this.hoverLayer.render();

    if (this.nodesMoved) {
      this.cache();
    } else if (this.moveIn.type !== MoveInType.None) {
      this.cache();
    }
    this.nodesMoved = false;
    this.moveIn.hoverLine = null;
  };

  private ondblclick = (e: MouseEvent) => {
    switch (this.moveIn.type) {
      case MoveInType.Nodes:
        if (this.moveIn.hoverNode) {
          if (
            this.moveIn.hoverNode.textRect.hitRotate(e, this.moveIn.hoverNode.rotate, this.moveIn.hoverNode.rect.center)
          ) {
            this.showInput(this.moveIn.hoverNode.textRect);
          }
          if (this.options.on) {
            this.options.on('dblclick', this.moveIn.hoverNode);
          }
        }
        break;
    }
  };

  private onkeydown = (key: KeyboardEvent) => {
    switch (key.keyCode) {
      // Delete
      case 46:
        if (!this.activeLayer.nodes.length && !this.activeLayer.lines.length) {
          return;
        }

        let i = 0;
        for (const line of this.lines) {
          for (const l of this.activeLayer.lines) {
            if (line.id === l.id) {
              this.lines.splice(i, 1);
            }
          }
          ++i;
        }

        i = 0;
        for (const node of this.nodes) {
          for (const n of this.activeLayer.nodes) {
            if (node.id === n.id) {
              this.nodes.splice(i, 1);
            }
          }
          ++i;
        }
        this.activeLayer.nodes = [];
        this.activeLayer.lines = [];
        this.hoverLayer.nodes = [];
        this.hoverLayer.lines = [];
        this.activeLayer.render();
        this.hoverLayer.render();
        this.cache();
        break;
    }
  };

  private calcActiveLines() {
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
        if (item.to && (item.from.id === n.id || item.to.id === n.id)) {
          item.activeStrokeStyle = '';
          this.activeLayer.lines.push(item);
          break;
        }
      }
    }
  }

  private calcOffscreenNodes() {
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

  private calcOffscreenLines() {
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

  private deactiveNodes() {
    for (const item of this.activeLayer.nodes) {
      item.activeStrokeStyle = '';
      this.offscreen.nodes.push(item);
    }
    this.activeLayer.nodes = [];
  }

  private deactiveLines() {
    for (const item of this.activeLayer.lines) {
      item.activeStrokeStyle = '';
      if (item.to) {
        this.offscreen.lines.push(item);
      }
    }
    this.activeLayer.lines = [];
  }

  private getHoverNode(e: MouseEvent, nodes: Node[]) {
    let node: Node;
    for (let i = nodes.length - 1; i >= 0; --i) {
      if (nodes[i].hit(e, 2)) {
        node = nodes[i];
        this.moveIn.type = MoveInType.Nodes;
        break;
      }
    }

    return node;
  }

  private getMoveIn(e: MouseEvent) {
    this.moveIn.type = MoveInType.None;
    this.moveIn.lineControlPoint = null;

    // In nodes
    this.lastHoverNode = this.moveIn.hoverNode;
    this.moveIn.hoverNode = this.getHoverNode(e, this.nodes);
    if (this.moveIn.hoverNode) {
      this.hoverLayer.canvas.style.cursor = 'move';
    } else {
      this.hoverLayer.canvas.style.cursor = 'default';
    }

    // In activeLayer
    if (this.activeLayer.nodes.length) {
      if (this.activeLayer.rotateCPs[0].hit(e, 15)) {
        this.moveIn.type = MoveInType.Rotate;
        this.hoverLayer.canvas.style.cursor = `url("${this.options.rotateCursor}"), auto`;
      } else {
        if (pointInRect({ x: e.offsetX, y: e.offsetY }, this.activeLayer.sizeCPs)) {
          this.moveIn.type = MoveInType.Nodes;
          this.hoverLayer.canvas.style.cursor = 'move';
        }

        for (let i = 0; i < this.activeLayer.sizeCPs.length; ++i) {
          if (this.activeLayer.sizeCPs[i].hit(e, 10)) {
            this.moveIn.type = MoveInType.ResizeCP;
            this.moveIn.activeAnchorIndex = i;
            this.hoverLayer.canvas.style.cursor = resizeCursors[i];
            break;
          }
        }
      }
    }

    if (this.moveIn.type === MoveInType.ResizeCP || this.moveIn.type === MoveInType.Rotate) {
      return;
    }

    // In anchors of hoverNode
    if (this.moveIn.hoverNode) {
      for (let i = 0; i < this.moveIn.hoverNode.rotatedAnchors.length; ++i) {
        if (this.moveIn.hoverNode.rotatedAnchors[i].hit(e, 7)) {
          this.moveIn.type = MoveInType.HoverAnchors;
          this.moveIn.hoverAnchorIndex = i;
          this.hoverLayer.canvas.style.cursor = 'crosshair';
          break;
        }
      }

      // if (
      //   this.moveIn.hoverNode.textRect.hitRotate(e, this.moveIn.hoverNode.rotate, this.moveIn.hoverNode.rect.center)
      // ) {
      //   this.hoverLayer.canvas.style.cursor = 'text';
      // }
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
        if (pt.hit(e)) {
          pt.id = i;
          this.moveIn.type = MoveInType.LineControlPoint;
          this.moveIn.lineControlPoint = pt;
          this.moveIn.hoverLine = item;
          this.hoverLayer.canvas.style.cursor = 'pointer';
          return;
        }
        ++i;
      }
      if (item.pointIn(e)) {
        this.moveIn.type = MoveInType.Line;
        this.moveIn.hoverLine = item;
        this.hoverLayer.canvas.style.cursor = 'pointer';
        break;
      }
    }
  }

  private getLineDock(e: MouseEvent) {
    const point: Point = new Point(e.offsetX, e.offsetY);
    this.hoverLayer.dockAnchor = null;
    for (const item of this.nodes) {
      if (item.id === this.moveIn.hoverNode.id) {
        continue;
      }

      if (item.rect.hit(e, 10)) {
        this.hoverLayer.nodes.push(item);
      }
      for (let i = 0; i < item.rotatedAnchors.length; ++i) {
        if (item.rotatedAnchors[i].hit(e, 10)) {
          point.id = item.id;
          point.anchorIndex = i;
          point.direction = item.rotatedAnchors[point.anchorIndex].direction;
          point.x = item.rotatedAnchors[point.anchorIndex].x;
          point.y = item.rotatedAnchors[point.anchorIndex].y;
          this.hoverLayer.dockAnchor = item.rotatedAnchors[i];
          break;
        }
      }

      if (point.id) {
        break;
      }
    }

    return point;
  }

  private getRectNodes(nodes: Node[], rect: Rect) {
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
        this.getRectNodes(item.children, rect);
      }
    }
  }

  private getAngle(e: MouseEvent) {
    if (e.offsetX === this.activeLayer.center.x) {
      return e.offsetY <= this.activeLayer.center.y ? 0 : 180;
    }

    if (e.offsetY === this.activeLayer.center.y) {
      return e.offsetX < this.activeLayer.center.x ? 270 : 90;
    }

    const x = e.offsetX - this.activeLayer.center.x;
    const y = e.offsetY - this.activeLayer.center.y;
    let angle = (Math.atan(Math.abs(x / y)) / (2 * Math.PI)) * 360;
    if (x > 0 && y > 0) {
      angle = 180 - angle;
    } else if (x < 0 && y > 0) {
      angle += 180;
    } else if (x < 0 && y < 0) {
      angle = 360 - angle;
    }
    if (this.activeLayer.nodes.length === 1) {
      return angle - this.activeLayer.nodes[0].rotate;
    }
    return angle;
  }

  private showInput(pos: Rect) {
    this.inputNode = this.moveIn.hoverNode;
    this.input.value = this.moveIn.hoverNode.text;
    this.input.style.left = pos.x + 'px';
    this.input.style.top = pos.y + 'px';
    this.input.style.width = pos.width + 'px';
    this.input.style.height = pos.height + 'px';
    this.input.style.zIndex = '1000';
  }

  private cache() {
    const c = {
      nodes: [],
      lines: []
    };
    for (const item of this.nodes) {
      c.nodes.push(new Node(item));
    }
    for (const item of this.lines) {
      c.lines.push(new Line(item));
    }
    if (this.caches.index < this.caches.list.length - 1) {
      this.caches.list.splice(this.caches.index + 1, this.caches.list.length - this.caches.index - 1, c);
    } else {
      this.caches.list.push(c);
    }

    this.caches.index = this.caches.list.length - 1;
  }

  undo() {
    if (this.caches.index < 1) {
      return;
    }

    this.render(this.caches.list[--this.caches.index]);
  }

  redo() {
    if (this.caches.index > this.caches.list.length - 2) {
      return;
    }

    this.render(this.caches.list[++this.caches.index]);
  }

  save(): string {
    return JSON.stringify({
      nodes: this.nodes,
      lines: this.lines
    });
  }

  saveAsPng(name?: string) {
    this.deactiveNodes();
    this.deactiveLines();
    this.offscreen.render();
    // 清空画布
    this.canvas.height = this.canvas.height;
    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.offscreen.canvas, 0, 0);

    const a = document.createElement('a');
    a.setAttribute('download', name || 'le5le.topology.png');
    a.setAttribute('href', this.canvas.toDataURL());
    a.click();
  }

  destory() {
    this.subcribe.unsubcribe();
  }
}
