import { Node, occupyRect } from './models/node';
import { Canvas } from './canvas';
import { Store } from './store/store';

export class ActiveLayer extends Canvas {
  canvas = document.createElement('canvas');
  nodes: Node[] = [];
  constructor(options) {
    super(options);
    if (!options || !options.strokeStyle) {
      this.options.strokeStyle = '#c73203';
    }
  }

  render() {
    const rect = occupyRect(this.nodes);
    if (!rect) {
      return;
    }

    // 清空背景
    this.canvas.height = this.canvas.height;
    const ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = this.options.strokeStyle;
    ctx.beginPath();
    ctx.strokeRect(rect.x - 3, rect.y - 3, rect.width + 6, rect.height + 6);
    ctx.stroke();

    this.emitRender();
  }
}
