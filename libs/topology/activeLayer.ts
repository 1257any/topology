import { Node, occupyRect } from './models/node';
import { Canvas } from './canvas';

export class ActiveLayer extends Canvas {
  canvas = document.createElement('canvas');
  nodes: Node[] = [];
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

    const rect = occupyRect(this.nodes);
    if (!rect) {
      return;
    }

    const ctx = this.canvas.getContext('2d');

    // Territory
    ctx.strokeStyle = this.options.activeStyle.strokeStyle + '50';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.stroke();

    // Line.
    ctx.beginPath();
    // tslint:disable-next-line:no-bitwise
    ctx.moveTo(rect.x + ((rect.width / 2 + 0.5) << 0), rect.y);
    // tslint:disable-next-line:no-bitwise
    ctx.lineTo(rect.x + ((rect.width / 2 + 0.5) << 0), rect.y - 25);
    ctx.stroke();

    // Anchors
    ctx.strokeStyle = this.options.activeStyle.strokeStyle;
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      // tslint:disable-next-line:no-bitwise
      rect.x + ((rect.width / 2 + 0.5) << 0),
      rect.y - 25,
      5,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.fill();

    ctx.strokeStyle = this.options.activeStyle.strokeStyle + 'e0';
    ctx.strokeRect(rect.x - 4, rect.y - 4, 8, 8);
    ctx.fillRect(rect.x - 4, rect.y - 4, 8, 8);

    ctx.strokeRect(rect.x + rect.width - 4, rect.y - 4, 8, 8);
    ctx.fillRect(rect.x + rect.width - 4, rect.y - 4, 8, 8);

    ctx.strokeRect(rect.x + rect.width - 4, rect.y + rect.height - 4, 8, 8);
    ctx.fillRect(rect.x + rect.width - 4, rect.y + rect.height - 4, 8, 8);

    ctx.strokeRect(rect.x - 4, rect.y + rect.height - 4, 8, 8);
    ctx.fillRect(rect.x - 4, rect.y + rect.height - 4, 8, 8);
  }
}
