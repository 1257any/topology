import { Node, occupyRect } from './models/node';
import { Canvas } from './canvas';
import { Rect } from './models/rect';

export class ActiveLayer extends Canvas {
  canvas = document.createElement('canvas');
  nodes: Node[] = [];
  // 总面积
  occupy: Rect;
  // 改变大小的锚点
  anchors: Rect[] = [];
  // 备份初始位置，方便移动事件处理
  rects: Rect[] = [];
  constructor(parent: HTMLElement, options: any) {
    super(options);
    this.options.activeStyle = options.activeStyle || {};
    if (!this.options.activeStyle || !this.options.activeStyle.fillStyle) {
      this.options.activeStyle.strokeStyle = '#804a4a';
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

    this.anchors = [];
    // Left Top
    this.anchors.push(new Rect(this.occupy.x - 4, this.occupy.y - 4, 8, 8));
    // Right Top
    this.anchors.push(new Rect(this.occupy.x + this.occupy.width - 4, this.occupy.y - 4, 8, 8));
    // Right Bottom
    this.anchors.push(new Rect(this.occupy.x + this.occupy.width - 4, this.occupy.y + this.occupy.height - 4, 8, 8));
    // Left Bottom
    this.anchors.push(new Rect(this.occupy.x - 4, this.occupy.y + this.occupy.height - 4, 8, 8));

    const ctx = this.canvas.getContext('2d');
    // Territory
    ctx.strokeStyle = this.options.activeStyle.strokeStyle + '50';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.strokeRect(this.occupy.x, this.occupy.y, this.occupy.width, this.occupy.height);
    ctx.stroke();

    // Line.
    ctx.beginPath();
    ctx.moveTo(this.occupy.x + ((this.occupy.width / 2 + 0.5) << 0), this.occupy.y);
    ctx.lineTo(this.occupy.x + ((this.occupy.width / 2 + 0.5) << 0), this.occupy.y - 25);
    ctx.stroke();

    ctx.strokeStyle = this.options.activeStyle.strokeStyle;
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2;

    // Circle of anchors
    ctx.beginPath();
    ctx.arc(this.occupy.x + ((this.occupy.width / 2 + 0.5) << 0), this.occupy.y - 25, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();

    ctx.strokeStyle = this.options.activeStyle.strokeStyle + 'e0';
    for (const item of this.anchors) {
      ctx.strokeRect(item.x, item.y, item.width, item.height);
      ctx.fillRect(item.x, item.y, item.width, item.height);
    }
  }

  saveRects() {
    this.rects = [];
    for (const item of this.nodes) {
      this.rects.push(new Rect(item.x, item.y, item.width, item.height));
    }
  }

  resizeNodes(type: number, pos: Rect) {
    let i = 0;
    for (const item of this.nodes) {
      switch (type) {
        // nw-resize
        case 0:
          if (this.rects[i].width - pos.width > 20) {
            item.x = this.rects[i].x + pos.width;
            item.width = this.rects[i].width - pos.width;
          }

          if (this.rects[i].height - pos.height > 20) {
            item.y = this.rects[i].y + pos.height;
            item.height = this.rects[i].height - pos.height;
          }
          break;
        // ne-resize
        case 1:
          if (this.rects[i].width + pos.width > 20) {
            item.width = this.rects[i].width + pos.width;
          }

          if (this.rects[i].height - pos.height > 20) {
            item.y = this.rects[i].y + pos.height;
            item.height = this.rects[i].height - pos.height;
          }
          break;
        // se-resize
        case 2:
          if (this.rects[i].width + pos.width > 20) {
            item.width = this.rects[i].width + pos.width;
          }

          if (this.rects[i].height + pos.height > 20) {
            item.height = this.rects[i].height + pos.height;
          }
          break;
        // sw-resize
        case 3:
          if (this.rects[i].width - pos.width > 20) {
            item.x = this.rects[i].x + pos.width;
            item.width = this.rects[i].width - pos.width;
          }

          if (this.rects[i].height + pos.height > 20) {
            item.height = this.rects[i].height + pos.height;
          }
          break;
      }
      item.ex = item.x + item.width;
      item.ey = item.y + item.height;
      item.init();
      ++i;
    }

    this.render();
  }

  moveNodes(pos: Rect) {
    let i = 0;
    for (const item of this.nodes) {
      item.x = this.rects[i].x + pos.width;
      item.y = this.rects[i].y + pos.height;
      item.ex = item.x + item.width;
      item.ey = item.y + item.height;
      item.init();
      ++i;
    }

    this.render();
  }
}
