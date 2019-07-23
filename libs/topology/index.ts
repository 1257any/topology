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
import { AnimateLayer } from './animateLayer';
import { Rect } from './models/rect';
import { s8 } from './uuid/uuid';
import { getBezierPoint } from './middles/lines/curve';
import { pointInRect } from './middles/utils';

const resizeCursors = ['nw-resize', 'ne-resize', 'se-resize', 'sw-resize'];
enum MoveInType {
  None,
  Line,
  LineMove,
  LineFrom,
  LineTo,
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
  animateLayer: AnimateLayer;
  nodes: Node[] = [];
  lines: Line[] = [];
  options: Options;
  private subcribe: Observer;

  lastHoverNode: Node;
  input = document.createElement('textarea');
  inputNode: Node;
  mouseDown: MouseEvent;
  moveIn: {
    type: MoveInType;
    activeAnchorIndex: number;
    hoverAnchorIndex: number;
    hoverNode: Node;
    hoverLine: Line;
    lineControlPoint: Point;
  } = {
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
  lineName = 'curve';

  clipboard: ICanvasData;

  locked = false;

  private scheduledAnimationFrame = false;

  private caches: ICanvasCache = {
    index: 0,
    list: []
  };

  constructor(parent: string | HTMLElement, options?: Options) {
    this.options = options || {};

    if (!this.options.font) {
      this.options.font = {
        color: '#333',
        fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
        fontSize: 12,
        lineHeight: 1.5,
        textAlign: 'center',
        textBaseline: 'middle'
      };
    }

    if (!this.options.color) {
      this.options.color = '#333';
    }

    if (!this.options.rotateCursor) {
      this.options.rotateCursor = '/assets/img/rotate.cur';
    }

    if (!this.options.font.fontFamily) {
      this.options.font.fontFamily = '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial';
    }

    if (!this.options.font.color) {
      this.options.font.color = '#333';
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

    Store.set('nodes', this.nodes);
    Store.set('lines', this.lines);

    if (typeof parent === 'string') {
      this.parentElem = document.getElementById(parent);
    } else {
      this.parentElem = parent;
    }

    this.offscreen = new Canvas(this.options, 'offscreen');
    this.parentElem.appendChild(this.canvas);
    this.activeLayer = new ActiveLayer(this.parentElem, this.options);
    this.animateLayer = new AnimateLayer(this.parentElem, this.options);
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
    this.input.style.resize = 'none';
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
    this.animateLayer.resize(this.canvas.width, this.canvas.height);
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

    // New active.
    this.activeLayer.setNodes([node]);
    this.activeLayer.render();

    this.hoverLayer.canvas.focus();

    this.nodes.push(node);
    this.offscreen.render(true);

    this.cache();

    if (this.options.on) {
      this.options.on('node', node);
    }

    return true;
  }

  // open - true: open a new file; false: redraw
  render(data?: ICanvasData, open?: boolean) {
    if (data) {
      this.nodes.splice(0, this.nodes.length);
      this.lines.splice(0, this.lines.length);
      if (open) {
        for (const item of data.nodes) {
          this.nodes.push(new Node(item));
        }
        for (const item of data.lines) {
          this.lines.push(new Line(item));
        }
        this.caches.list = [];
        this.cache();
      } else {
        this.nodes.push.apply(this.nodes, data.nodes);
        this.lines.push.apply(this.lines, data.lines);
      }

      this.activeLayer.nodes = [];
      this.activeLayer.lines = [];
      this.hoverLayer.node = null;
      this.hoverLayer.render();
      this.activeLayer.render();
      this.animateLayer.render();
    }

    this.offscreen.render();
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
          this.hoverLayer.node = this.moveIn.hoverNode;
          this.hoverLayer.render();

          // Send a move event.
          if (!this.lastHoverNode && this.options.on) {
            this.options.on('moveInNode', new Node(this.moveIn.hoverNode));
          }
        } else if (this.lastHoverNode) {
          // Clear hover anchors.
          this.hoverLayer.node = null;
          this.hoverLayer.canvas.height = this.hoverLayer.canvas.height;

          // Send a move event.
          if (this.options.on) {
            this.options.on('moveOutNode', null);
          }
        }

        if (this.moveIn.type === MoveInType.LineControlPoint) {
          this.hoverLayer.hoverLineCP = this.moveIn.lineControlPoint;
          this.hoverLayer.render();
        } else if (this.hoverLayer.hoverLineCP) {
          this.hoverLayer.hoverLineCP = null;
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
            return;
          }
          break;
        case MoveInType.Nodes:
          this.nodesMoved = true;
          this.activeLayer.moveNodes(
            new Rect(e.offsetX, e.offsetY, e.offsetX - this.mouseDown.offsetX, e.offsetY - this.mouseDown.offsetY)
          );
          break;
        case MoveInType.ResizeCP:
          this.activeLayer.resizeNodes(this.moveIn.activeAnchorIndex, e);
          break;
        case MoveInType.LineTo:
        case MoveInType.HoverAnchors:
          this.hoverLayer.lineTo(this.getLineDock(e), this.toArrowType);
          break;
        case MoveInType.LineFrom:
          this.hoverLayer.lineFrom(this.getLineDock(e));
          break;
        case MoveInType.LineMove:
          this.hoverLayer.lineMove(e, this.mouseDown);
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
          break;
        case MoveInType.Rotate:
          if (this.activeLayer.nodes.length) {
            this.activeLayer.offsetRotate(this.getAngle(e));
            this.activeLayer.updateLines();
          }
          break;
      }

      this.hoverLayer.render();
      this.activeLayer.render();
      this.animateLayer.render();
      this.offscreen.render(true);
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
      this.offscreen.render(true);
    }

    switch (this.moveIn.type) {
      // Click the space.
      case MoveInType.None:
        this.activeLayer.nodes = [];
        this.activeLayer.lines = [];
        this.activeLayer.canvas.height = this.activeLayer.canvas.height;

        this.hoverLayer.node = null;
        this.hoverLayer.line = null;
        this.hoverLayer.canvas.height = this.hoverLayer.canvas.height;

        if (this.options.on) {
          this.options.on('space', null);
        }

        return;

      // Click a line.
      case MoveInType.Line:
      case MoveInType.LineControlPoint:
        if (e.ctrlKey) {
          this.activeLayer.lines.push(this.moveIn.hoverLine);
          if (this.options.on) {
            if (this.lines.length > 1 || this.nodes.length) {
              this.options.on('multi', null);
            } else {
              this.options.on('line', this.moveIn.hoverLine);
            }
          }
        } else {
          this.activeLayer.nodes = [];
          this.activeLayer.lines = [this.moveIn.hoverLine];
          if (this.options.on) {
            this.options.on('line', this.moveIn.hoverLine);
          }
        }

        Store.set('activeLine', this.moveIn.hoverLine);
        this.hoverLayer.render();
        this.activeLayer.render();

        return;
      case MoveInType.LineMove:
        this.hoverLayer.initLine = new Line(this.moveIn.hoverLine);
      // tslint:disable-next-line:no-switch-case-fall-through
      case MoveInType.LineFrom:
      case MoveInType.LineTo:
        this.activeLayer.nodes = [];
        this.activeLayer.lines = [this.moveIn.hoverLine];
        if (this.options.on) {
          this.options.on('line', this.moveIn.hoverLine);
        }
        Store.set('activeLine', this.moveIn.hoverLine);

        this.hoverLayer.line = this.moveIn.hoverLine;

        this.hoverLayer.render();
        this.activeLayer.render();
        this.animateLayer.render();
        return;
      case MoveInType.HoverAnchors:
        this.hoverLayer.setLine(
          new Point(
            this.moveIn.hoverNode.rotatedAnchors[this.moveIn.hoverAnchorIndex].x,
            this.moveIn.hoverNode.rotatedAnchors[this.moveIn.hoverAnchorIndex].y,
            this.moveIn.hoverNode.rotatedAnchors[this.moveIn.hoverAnchorIndex].direction,
            this.moveIn.hoverAnchorIndex,
            this.moveIn.hoverNode.id
          ),
          this.fromArrowType,
          this.lineName
        );
      // tslint:disable-next-line:no-switch-case-fall-through
      case MoveInType.Nodes:
        if (!this.moveIn.hoverNode || this.activeLayer.hasNode(this.moveIn.hoverNode)) {
          break;
        }

        if (e.ctrlKey) {
          this.activeLayer.addNode(this.moveIn.hoverNode);

          if (this.options.on) {
            if (this.activeLayer.nodes.length > 1 || this.activeLayer.lines.length) {
              this.options.on('multi', null);
            } else {
              this.options.on('node', this.moveIn.hoverNode);
            }
          }
        } else {
          this.activeLayer.setNodes([this.moveIn.hoverNode]);

          if (this.options.on) {
            this.options.on('node', this.moveIn.hoverNode);
          }
        }
        break;
    }

    // Save node rects to move.
    this.activeLayer.saveNodeRects();
    this.activeLayer.render();
    this.animateLayer.render();
  };

  private onmouseup = (e: MouseEvent) => {
    this.mouseDown = null;
    this.hoverLayer.dockAnchor = null;

    if (this.hoverLayer.dragRect) {
      this.getRectNodes(this.nodes, this.hoverLayer.dragRect);
      this.getRectLines(this.lines, this.hoverLayer.dragRect);
      this.activeLayer.render();

      if (this.options.on && this.activeLayer.nodes && this.activeLayer.nodes.length) {
        this.options.on('multi', null);
      }
    } else {
      switch (this.moveIn.type) {
        // Add the line.
        case MoveInType.HoverAnchors:
          // Deactive.
          this.activeLayer.nodes = [];
          this.activeLayer.lines = [];

          // New active.
          if (this.hoverLayer.line && this.hoverLayer.line.to) {
            this.activeLayer.lines = [this.hoverLayer.line];
            Store.set('activeLine', this.hoverLayer.line);
            this.activeLayer.render();
          }

          this.offscreen.render(true);

          this.hoverLayer.line = null;
          break;
        case MoveInType.Rotate:
          this.activeLayer.updateRotate();
          this.activeLayer.render();
          this.animateLayer.render();
          break;

        case MoveInType.LineControlPoint:
          Store.set('pts-' + this.moveIn.hoverLine.id, null);
          break;
      }
    }

    this.hoverLayer.dragRect = null;
    this.hoverLayer.render();

    if (this.nodesMoved || this.moveIn.type !== MoveInType.None) {
      this.cache();
    }
    this.nodesMoved = false;
  };

  private ondblclick = (e: MouseEvent) => {
    switch (this.moveIn.type) {
      case MoveInType.Nodes:
        if (this.moveIn.hoverNode) {
          const textRect = this.moveIn.hoverNode.getTextRect();
          if (textRect.hitRotate(e, this.moveIn.hoverNode.rotate, this.moveIn.hoverNode.rect.center)) {
            this.showInput(textRect);
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
        for (const line of this.activeLayer.lines) {
          i = 0;
          for (const l of this.lines) {
            if (line.id === l.id) {
              this.lines.splice(i, 1);
              break;
            }
            ++i;
          }
        }

        for (const node of this.activeLayer.nodes) {
          i = 0;
          for (const n of this.nodes) {
            if (node.id === n.id) {
              this.nodes.splice(i, 1);
              break;
            }
            ++i;
          }
        }
        this.activeLayer.nodes = [];
        this.activeLayer.lines = [];
        this.hoverLayer.node = null;
        this.activeLayer.render();
        this.animateLayer.render();
        this.hoverLayer.render();
        this.offscreen.render(true);
        this.cache();
        break;
    }
  };

  private getHoverNode(e: MouseEvent) {
    for (let i = this.nodes.length - 1; i > -1; --i) {
      if (this.nodes[i].hit(e, 2)) {
        this.moveIn.hoverNode = this.nodes[i];
        this.moveIn.type = MoveInType.Nodes;
        break;
      }
    }
  }

  private getMoveIn(e: MouseEvent) {
    this.lastHoverNode = this.moveIn.hoverNode;
    this.moveIn.type = MoveInType.None;
    this.moveIn.hoverNode = null;
    this.moveIn.lineControlPoint = null;
    this.moveIn.hoverLine = null;

    // In nodes
    this.getHoverNode(e);
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

        if (!this.locked) {
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
    }

    if (this.moveIn.type === MoveInType.ResizeCP || this.moveIn.type === MoveInType.Rotate) {
      return;
    }

    // In anchors of hoverNode
    if (this.moveIn.hoverNode && !this.locked) {
      for (let i = 0; i < this.moveIn.hoverNode.rotatedAnchors.length; ++i) {
        if (this.moveIn.hoverNode.rotatedAnchors[i].hit(e, 10)) {
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

      // In LineControlPoint
      if (this.activeLayer.lines.length) {
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
      }

      if (item.from.hit(e, 10)) {
        this.moveIn.type = MoveInType.LineFrom;
        this.moveIn.hoverLine = item;
        this.hoverLayer.canvas.style.cursor = 'move';
        return;
      }

      if (item.to.hit(e, 10)) {
        this.moveIn.type = MoveInType.LineTo;
        this.moveIn.hoverLine = item;
        this.hoverLayer.canvas.style.cursor = 'move';
        return;
      }

      if (item.pointIn(e)) {
        this.moveIn.type = MoveInType.LineMove;
        this.moveIn.hoverLine = item;
        this.hoverLayer.canvas.style.cursor = 'move';
        if (item.from.id || item.to.id) {
          this.moveIn.type = MoveInType.Line;
          this.hoverLayer.canvas.style.cursor = 'pointer';
        }
        return;
      }
    }
  }

  private getLineDock(e: MouseEvent) {
    const point: Point = new Point(e.offsetX, e.offsetY);
    this.hoverLayer.dockAnchor = null;
    for (const item of this.nodes) {
      if (this.moveIn.hoverNode && item.id === this.moveIn.hoverNode.id) {
        continue;
      }

      if (item.rect.hit(e, 10)) {
        this.hoverLayer.node = item;
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

  private getRectLines(lines: Line[], rect: Rect) {
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
    this.activeLayer.lines = [];
    for (const item of lines) {
      if (
        rect.hit({ offsetX: item.from.x, offsetY: item.from.y }) &&
        rect.hit({ offsetX: item.to.x, offsetY: item.to.y })
      ) {
        this.activeLayer.lines.push(item);
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
    if (this.locked) {
      return;
    }
    this.inputNode = this.moveIn.hoverNode;
    this.input.value = this.moveIn.hoverNode.text;
    this.input.style.left = pos.x + 'px';
    this.input.style.top = pos.y + 'px';
    this.input.style.width = pos.width + 'px';
    this.input.style.height = pos.height + 'px';
    this.input.style.zIndex = '1000';
  }

  onInput = (e: MouseEvent) => {};

  getRect() {
    let x1 = 99999;
    let y1 = 99999;
    let x2 = -99999;
    let y2 = -99999;

    const points: Point[] = [];
    for (const item of this.nodes) {
      const pts = item.rect.toPoints();
      if (item.rotate) {
        for (const pt of pts) {
          pt.rotate(item.rotate, item.rect.center);
        }
      }
      points.push.apply(points, pts);
    }

    for (const l of this.lines) {
      points.push(l.from);
      points.push(l.to);
      if (l.name === 'curve') {
        for (let i = 0.01; i < 1; i += 0.02) {
          points.push(getBezierPoint(i, l.from, l.controlPoints[0], l.controlPoints[1], l.to));
        }
      }
    }

    for (const item of points) {
      if (x1 > item.x) {
        x1 = item.x;
      }
      if (y1 > item.y) {
        y1 = item.y;
      }
      if (x2 < item.x) {
        x2 = item.x;
      }
      if (y2 < item.y) {
        y2 = item.y;
      }
    }

    return new Rect(x1, y1, x2 - x1, y2 - y1);
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
    if (this.locked || this.caches.index < 1) {
      return;
    }

    this.render(this.caches.list[--this.caches.index]);
  }

  redo() {
    if (this.locked || this.caches.index > this.caches.list.length - 2) {
      return;
    }

    this.render(this.caches.list[++this.caches.index]);
  }

  save() {
    return {
      nodes: this.nodes,
      lines: this.lines
    };
  }

  toImage(callback?: BlobCallback): string {
    const rect = this.getRect();
    const canvas = document.createElement('canvas');
    canvas.width = rect.width + 20;
    canvas.height = rect.height + 20;
    canvas
      .getContext('2d')
      .drawImage(
        this.offscreen.canvas,
        rect.x - 10,
        rect.y - 10,
        rect.width + 20,
        rect.height + 20,
        0,
        0,
        rect.width + 20,
        rect.height + 20
      );

    if (callback) {
      canvas.toBlob(callback);
      return '';
    }

    return canvas.toDataURL();
  }

  saveAsPng(name?: string) {
    const a = document.createElement('a');
    a.setAttribute('download', name || 'le5le.topology.png');
    a.setAttribute('href', this.toImage());
    a.click();
  }

  cut() {
    if (this.locked) {
      return;
    }

    this.clipboard = {
      nodes: [],
      lines: []
    };
    for (const item of this.activeLayer.nodes) {
      this.clipboard.nodes.push(new Node(item));

      let i = 0;
      for (const node of this.nodes) {
        if (item.id === node.id) {
          this.nodes.splice(i, 1);
        }
        ++i;
      }
    }
    for (const item of this.activeLayer.lines) {
      this.clipboard.lines.push(new Line(item));

      let i = 0;
      for (const line of this.lines) {
        if (item.id === line.id) {
          this.lines.splice(i, 1);
        }
        ++i;
      }
    }

    this.cache();

    this.activeLayer.nodes = [];
    this.activeLayer.lines = [];
    this.activeLayer.render();

    this.animateLayer.render();

    this.hoverLayer.node = null;
    this.hoverLayer.render();

    this.offscreen.render(true);

    this.moveIn.hoverLine = null;
    this.moveIn.hoverNode = null;
  }

  copy() {
    this.clipboard = {
      nodes: [],
      lines: []
    };
    for (const item of this.activeLayer.nodes) {
      this.clipboard.nodes.push(new Node(item));
    }

    for (const item of this.activeLayer.lines) {
      this.clipboard.lines.push(new Line(item));
    }
  }

  parse() {
    if (!this.clipboard || this.locked) {
      return;
    }

    this.hoverLayer.node = null;
    this.hoverLayer.line = null;
    this.hoverLayer.render();

    this.activeLayer.nodes = [];
    this.activeLayer.lines = [];

    const idMaps: any = {};
    for (const item of this.clipboard.nodes) {
      const old = item.id;
      item.id = s8();
      idMaps[old] = item.id;
      item.rect.x += 20;
      item.rect.ex += 20;
      item.rect.y += 20;
      item.rect.ey += 20;

      const node = new Node(item);
      this.nodes.push(node);
      this.activeLayer.nodes.push(node);
    }
    for (const item of this.clipboard.lines) {
      item.id = s8();
      item.from = new Point(
        item.from.x + 20,
        item.from.y + 20,
        item.from.direction,
        item.from.anchorIndex,
        idMaps[item.from.id]
      );
      item.to = new Point(item.to.x + 20, item.to.y + 20, item.to.direction, item.to.anchorIndex, idMaps[item.to.id]);

      const line = new Line(item);
      this.lines.push(line);
      this.activeLayer.lines.push(line);
      Store.set('activeLine', line);
    }

    this.offscreen.render(true);
    this.activeLayer.render();
    this.animateLayer.render();

    this.cache();
  }

  update() {
    this.cache();
    this.activeLayer.changeLineType();
    this.activeLayer.render();
    this.animateLayer.render();
    this.hoverLayer.render();
    this.offscreen.render(true);
  }

  lock(lock: boolean) {
    this.locked = lock;
    Store.set('locked', lock);
  }

  destory() {
    this.subcribe.unsubcribe();
  }
}
