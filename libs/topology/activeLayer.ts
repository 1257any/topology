import { occupyRect } from './models/node';
import { Canvas } from './canvas';
import { Rect } from './models/rect';

export class ActiveLayer extends Canvas {
  // 总面积
  occupy: Rect;
  initialOccupy: Rect;
  // 改变大小的锚点
  anchors: Rect[] = [];
  // 备份初始位置，方便移动事件处理
  rects: Rect[] = [];
  constructor(parent: HTMLElement, options: any) {
    super(options);
    if (!this.options.activeColor) {
      this.options.activeColor = '#2f54eb';
    }
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    parent.appendChild(this.canvas);
  }

  render() {
    super.render(false);

    this.occupy = occupyRect(this.nodes);
    if (!this.occupy) {
      return;
    }

    this.calcAnchors();

    const ctx = this.canvas.getContext('2d');

    if (this.nodes.length === 1) {
      ctx.translate(this.nodes[0].rect.centerX, this.nodes[0].rect.centerY);
      ctx.rotate(((this.nodes[0].rotate + this.nodes[0].offsetRotate) * Math.PI) / 180);
      ctx.translate(-this.nodes[0].rect.centerX, -this.nodes[0].rect.centerY);
    }

    // Territory
    ctx.strokeStyle = this.options.activeColor + '50';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.strokeRect(this.occupy.x, this.occupy.y, this.occupy.width, this.occupy.height);

    // Line.
    ctx.moveTo(this.occupy.x + ((this.occupy.width / 2 + 0.5) << 0), this.occupy.y);
    ctx.lineTo(this.occupy.x + ((this.occupy.width / 2 + 0.5) << 0), this.occupy.y - 25);
    ctx.stroke();

    ctx.strokeStyle = this.options.activeColor;
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2;

    // Rotate circle.
    ctx.beginPath();
    ctx.arc(this.occupy.x + ((this.occupy.width / 2 + 0.5) << 0), this.occupy.y - 25, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();

    ctx.strokeStyle = this.options.activeColor + 'e0';
    for (const item of this.anchors) {
      ctx.strokeRect(item.x, item.y, item.width, item.height);
      ctx.fillRect(item.x, item.y, item.width, item.height);
    }
  }

  calcAnchors() {
    this.anchors = [];
    // Left Top
    this.anchors.push(new Rect(this.occupy.x - 4, this.occupy.y - 4, 8, 8));
    // Right Top
    this.anchors.push(new Rect(this.occupy.x + this.occupy.width - 4, this.occupy.y - 4, 8, 8));
    // Right Bottom
    this.anchors.push(new Rect(this.occupy.x + this.occupy.width - 4, this.occupy.y + this.occupy.height - 4, 8, 8));
    // Left Bottom
    this.anchors.push(new Rect(this.occupy.x - 4, this.occupy.y + this.occupy.height - 4, 8, 8));
  }

  // 即将缩放选中的nodes，备份nodes最初大小，方便缩放比例计算
  saveRects() {
    this.rects = [];
    for (const item of this.nodes) {
      this.rects.push(new Rect(item.rect.x, item.rect.y, item.rect.width, item.rect.height));
    }
    if (this.occupy) {
      this.initialOccupy = new Rect(this.occupy.x, this.occupy.y, this.occupy.width, this.occupy.height);
    }
  }

  resizeNodes(type: number, e: MouseEvent) {
    let i = 0;
    let newOccupy: Rect;
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
          w = this.initialOccupy.ex - e.offsetX;
          h = this.initialOccupy.ey - e.offsetY;
          newOccupy = new Rect(
            w > 30 ? x : this.initialOccupy.ex - 30,
            h > 30 ? y : this.initialOccupy.ey - 30,
            w > 30 ? w : 30,
            h > 30 ? h : 30
          );
          break;
        // ne-resize
        case 1:
          y = e.offsetY;
          w = e.offsetX - this.initialOccupy.x;
          h = this.initialOccupy.ey - e.offsetY;
          newOccupy = new Rect(
            this.initialOccupy.x,
            h > 30 ? y : this.initialOccupy.ey - 30,
            w > 30 ? w : 30,
            h > 30 ? h : 30
          );
          break;
        // se-resize
        case 2:
          w = e.offsetX - this.initialOccupy.x;
          h = e.offsetY - this.initialOccupy.y;
          newOccupy = new Rect(this.initialOccupy.x, this.initialOccupy.y, w > 30 ? w : 30, h > 30 ? h : 30);
          break;
        // sw-resize
        case 3:
          x = e.offsetX;
          w = this.initialOccupy.ex - e.offsetX;
          h = e.offsetY - this.initialOccupy.y;
          newOccupy = new Rect(
            w > 30 ? x : this.initialOccupy.ex - 30,
            this.initialOccupy.y,
            w > 30 ? w : 30,
            h > 30 ? h : 30
          );
          break;
      }

      this.calcRelPos(
        item.rect,
        this.rects[i],
        newOccupy,
        newOccupy.width / this.initialOccupy.width,
        newOccupy.height / this.initialOccupy.height
      );
      item.rect.calceCenter();
      item.init();
      ++i;
    }

    this.updateLines();
    this.render();
  }

  // 当initialOccupy缩放为occupy后，计算node在occupy中的新位置
  // initNode - node的原始位置
  // xScale - x坐标缩放比例
  // yScale - y坐标缩放比例
  calcRelPos(node: Rect, initNode: Rect, occupy: Rect, xScale: number, yScale: number) {
    node.x = occupy.x + (initNode.x - this.initialOccupy.x) * xScale;
    node.y = occupy.y + (initNode.y - this.initialOccupy.y) * yScale;
    node.width = initNode.width * xScale;
    node.height = initNode.height * yScale;
    node.ex = node.x + node.width;
    node.ey = node.y + node.height;
  }

  moveNodes(pos: Rect) {
    if (this.rects.length !== this.nodes.length) {
      return;
    }

    let i = 0;
    for (const item of this.nodes) {
      item.rect.x = this.rects[i].x + pos.width;
      item.rect.y = this.rects[i].y + pos.height;
      item.rect.ex = item.rect.x + item.rect.width;
      item.rect.ey = item.rect.y + item.rect.height;
      item.rect.calceCenter();
      item.init();
      ++i;
    }

    this.updateLines();
    this.render();
  }

  updateLines() {
    for (const item of this.nodes) {
      for (const line of this.lines) {
        if (line.from.id === item.id) {
          line.from.x = item.rotateAnchors[line.from.anchorIndex].x;
          line.from.y = item.rotateAnchors[line.from.anchorIndex].y;
        }
        if (line.to.id === item.id) {
          line.to.x = item.rotateAnchors[line.to.anchorIndex].x;
          line.to.y = item.rotateAnchors[line.to.anchorIndex].y;
        }
        line.calcControlPoints();
      }
    }
  }
}
