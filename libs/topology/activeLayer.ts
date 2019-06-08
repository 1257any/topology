import { Node } from './models/node';
import { Canvas } from './canvas';
import { Rect } from './models/rect';
import { Point } from './models/point';
import { Store } from './store/store';

export class ActiveLayer extends Canvas {
  rotateCPs: Point[] = [];
  sizeCPs: Point[] = [];
  center: Point = new Point(0, 0);

  initialSizeCPs: Point[] = [];

  // 备份初始位置，方便移动事件处理
  nodeRects: Rect[] = [];

  constructor(parent: HTMLElement, options: any) {
    super(options, 'ActiveLayer');
    if (!this.options.activeColor) {
      this.options.activeColor = '#2f54eb';
    }
    this.color = this.options.activeColor;

    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    parent.appendChild(this.canvas);
  }

  calcControlPoints() {
    if (!this.nodes.length) {
      return;
    } else if (this.nodes.length === 1) {
      this.center.x = this.nodes[0].rect.center.x;
      this.center.y = this.nodes[0].rect.center.y;
      this.sizeCPs = this.nodes[0].rect.toPoints();
      this.rotateCPs = [
        new Point(this.nodes[0].rect.x + this.nodes[0].rect.width / 2, this.nodes[0].rect.y - 35),
        new Point(this.nodes[0].rect.x + this.nodes[0].rect.width / 2, this.nodes[0].rect.y)
      ];

      if (this.rotate || this.nodes[0].rotate) {
        for (const pt of this.sizeCPs) {
          if (this.nodes[0].rotate) {
            pt.rotate(this.nodes[0].rotate, this.nodes[0].rect.center);
          }
          if (this.rotate) {
            pt.rotate(this.rotate, this.center);
          }
        }
        for (const pt of this.rotateCPs) {
          if (this.nodes[0].rotate) {
            pt.rotate(this.nodes[0].rotate, this.nodes[0].rect.center);
          }
          if (this.rotate) {
            pt.rotate(this.rotate, this.center);
          }
        }
      }

      return;
    }

    let x1 = 99999;
    let y1 = 99999;
    let x2 = -99999;
    let y2 = -99999;
    const pts = this.getPoints(this.nodes);
    for (const item of pts) {
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
    this.center.x = (x1 + (x2 - x1) / 2) << 0;
    this.center.y = (y1 + (y2 - y1) / 2) << 0;
    this.sizeCPs = [new Point(x1, y1), new Point(x2, y1), new Point(x2, y2), new Point(x1, y2)];
    this.rotateCPs = [new Point(x1 + (x2 - x1) / 2, y1 - 35), new Point(x1 + (x2 - x1) / 2, y1)];
  }

  getPoints(nodes: Node[]) {
    const points: Point[] = [];
    for (const item of nodes) {
      const pts = item.rect.toPoints();
      if (item.rotate) {
        for (const pt of pts) {
          pt.rotate(item.rotate, item.rect.center);
        }
      }
      points.push.apply(points, pts);
    }

    return points;
  }

  render() {
    super.render(false);

    if (!this.nodes.length) {
      return;
    }

    const ctx = this.canvas.getContext('2d');

    // This is diffence between single node and more.
    if (this.rotate && this.nodes.length > 1) {
      ctx.translate(this.center.x, this.center.y);
      ctx.rotate((this.rotate * Math.PI) / 180);
      ctx.translate(-this.center.x, -this.center.y);
    }

    // Occupied territory.
    ctx.strokeStyle = this.options.activeColor + '30';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.sizeCPs[0].x, this.sizeCPs[0].y);
    ctx.lineTo(this.sizeCPs[1].x, this.sizeCPs[1].y);
    ctx.lineTo(this.sizeCPs[2].x, this.sizeCPs[2].y);
    ctx.lineTo(this.sizeCPs[3].x, this.sizeCPs[3].y);
    ctx.closePath();
    ctx.stroke();

    // Draw rotate control point.
    ctx.moveTo(this.rotateCPs[0].x, this.rotateCPs[0].y);
    ctx.lineTo(this.rotateCPs[1].x, this.rotateCPs[1].y);
    ctx.stroke();

    ctx.strokeStyle = this.options.activeColor;
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.rotateCPs[0].x, this.rotateCPs[0].y, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();

    // Draw size control points.
    ctx.strokeStyle = this.options.activeColor + '80';
    ctx.lineWidth = 1;
    for (const item of this.sizeCPs) {
      ctx.save();
      ctx.beginPath();
      if (this.nodes.length === 1 && (this.nodes[0].rotate || this.rotate)) {
        ctx.translate(item.x, item.y);
        ctx.rotate(((this.nodes[0].rotate + this.rotate) * Math.PI) / 180);
        ctx.translate(-item.x, -item.y);
      }
      ctx.strokeRect(item.x - 5, item.y - 5, 10, 10);
      ctx.fillRect(item.x - 4, item.y - 4, 8, 8);
      ctx.restore();
    }
  }

  // 即将缩放选中的nodes，备份nodes最初大小，方便缩放比例计算
  saveNodeRects() {
    this.nodeRects = [];
    for (const item of this.nodes) {
      this.nodeRects.push(new Rect(item.rect.x, item.rect.y, item.rect.width, item.rect.height));
    }

    this.initialSizeCPs = [];
    for (const item of this.sizeCPs) {
      this.initialSizeCPs.push(item.clone());
    }
  }

  resizeNodes(type: number, e: MouseEvent) {
    let i = 0;
    const pos: Point = new Point(0, 0);
    let x;
    let y;
    let w;
    let h;
    for (const item of this.nodes) {
      switch (type) {
        // nw-resize
        case 0:
          x = e.offsetX;
          y = e.offsetY;
          w = this.initialSizeCPs[2].x - e.offsetX;
          h = this.initialSizeCPs[2].y - e.offsetY;
          pos.x = w > 30 ? x : this.initialSizeCPs[2].x - 30;
          pos.y = h > 30 ? y : this.initialSizeCPs[2].y - 30;
          break;
        // ne-resize
        case 1:
          y = e.offsetY;
          w = e.offsetX - this.initialSizeCPs[0].x;
          h = this.initialSizeCPs[2].y - e.offsetY;
          pos.x = this.initialSizeCPs[0].x;
          pos.y = h > 30 ? y : this.initialSizeCPs[2].y - 30;
          break;
        // se-resize
        case 2:
          w = e.offsetX - this.initialSizeCPs[0].x;
          h = e.offsetY - this.initialSizeCPs[0].y;
          pos.x = this.initialSizeCPs[0].x;
          pos.y = this.initialSizeCPs[0].y;
          break;
        // sw-resize
        case 3:
          x = e.offsetX;
          w = this.initialSizeCPs[2].x - e.offsetX;
          h = e.offsetY - this.initialSizeCPs[0].y;
          pos.x = w > 30 ? x : this.initialSizeCPs[2].x - 30;
          pos.y = this.initialSizeCPs[0].y;
          break;
      }

      w = w > 30 ? w : 30;
      h = h > 30 ? h : 30;
      this.calcRelPos(
        item.rect,
        this.nodeRects[i],
        pos,
        w / (this.initialSizeCPs[2].x - this.initialSizeCPs[0].x),
        h / (this.initialSizeCPs[2].y - this.initialSizeCPs[0].y)
      );
      item.rect.calceCenter();
      item.init();
      ++i;
    }
    this.calcControlPoints();
    this.updateLines();
    this.render();
  }

  // 当initialOccupy缩放为occupy后，计算node在occupy中的新位置
  // initNode - node的原始位置
  // xScale - x坐标缩放比例
  // yScale - y坐标缩放比例
  calcRelPos(node: Rect, initNode: Rect, pos: Point, xScale: number, yScale: number) {
    node.x = pos.x + (initNode.x - this.initialSizeCPs[0].x) * xScale;
    node.y = pos.y + (initNode.y - this.initialSizeCPs[0].y) * yScale;
    node.width = initNode.width * xScale;
    node.height = initNode.height * yScale;
    node.ex = node.x + node.width;
    node.ey = node.y + node.height;
  }

  moveNodes(pos: Rect) {
    if (this.nodeRects.length !== this.nodes.length) {
      return;
    }
    let i = 0;
    for (const item of this.nodes) {
      item.rect.x = this.nodeRects[i].x + pos.width;
      item.rect.y = this.nodeRects[i].y + pos.height;
      item.rect.ex = item.rect.x + item.rect.width;
      item.rect.ey = item.rect.y + item.rect.height;
      item.rect.calceCenter();
      item.init();
      ++i;
    }
    this.updateLines();

    this.calcControlPoints();
    this.render();
  }

  updateLines() {
    const lines = Store.get('lines');
    for (const item of this.nodes) {
      for (const line of lines) {
        if (line.from.id === item.id) {
          line.from.x = item.rotatedAnchors[line.from.anchorIndex].x;
          line.from.y = item.rotatedAnchors[line.from.anchorIndex].y;
        }
        if (line.to.id === item.id) {
          line.to.x = item.rotatedAnchors[line.to.anchorIndex].x;
          line.to.y = item.rotatedAnchors[line.to.anchorIndex].y;
        }
        line.calcControlPoints();
      }
    }
  }

  offsetRotate(angle: number) {
    let i = 0;
    for (const item of this.nodes) {
      const center = this.nodeRects[i].center.clone();
      center.rotate(angle, this.center);
      item.rect.x = (center.x - item.rect.width / 2 + 0.5) << 0;
      item.rect.y = (center.y - item.rect.height / 2 + 0.5) << 0;
      item.rect.ex = item.rect.x + item.rect.width;
      item.rect.ey = item.rect.y + item.rect.height;
      item.rect.calceCenter();
      item.init();
      item.offsetRotate = angle;
      item.calcRotateAnchors(item.rotate + item.offsetRotate);
      ++i;
    }
    this.rotate = angle;
    if (this.nodes.length === 1) {
      this.calcControlPoints();
    }
  }

  updateRotate() {
    for (const item of this.nodes) {
      item.rotate += item.offsetRotate;
      item.offsetRotate = 0;
    }
    this.rotate = 0;
    if (this.nodes.length > 1) {
      this.calcControlPoints();
    }
  }

  addNode(node: Node): boolean {
    const b = super.addNode(node);

    if (b) {
      this.calcControlPoints();
    }

    return b;
  }

  setNodes(nodes: Node[]) {
    this.nodes = nodes;
    this.calcControlPoints();
  }
}
