import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Topology } from 'libs/topology';
import { Node } from 'libs/topology/models/node';
import { Line } from 'libs/topology/models/line';
import { Options } from 'libs/topology/options';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(document:keydown)': 'onkeyDocument($event)'
  }
})
export class HomeComponent implements OnInit {
  @ViewChild('workspace') workspace: ElementRef;
  tools: any[] = [
    {
      group: '基本形状',
      children: [
        {
          name: 'rect',
          icon: 'icon-round-rect',
          data: {
            text: '圆角矩形',
            textMaxLine: 1,
            rect: {
              width: 200,
              height: 50
            },
            borderRadius: 0.1,
            name: 'rect'
          }
        },
        {
          name: 'rect',
          icon: 'icon-rect',
          data: {
            text: '矩形',
            rect: {
              width: 100,
              height: 100
            },
            name: 'rect',
            icon: '\uec46',
            iconFamily: 'iconfont',
            iconSize: 40,
            iconColor: '#2f54eb'
          }
        },
        {
          name: 'circle',
          icon: 'icon-circle',
          data: {
            text: '圆',
            rect: {
              width: 100,
              height: 100
            },
            name: 'circle',
            textMaxLine: 1
          }
        },
        {
          name: 'triangle',
          icon: 'icon-triangle',
          data: {
            text: '三角形',
            rect: {
              width: 100,
              height: 100
            },
            name: 'triangle'
          }
        },
        {
          name: 'diamond',
          icon: 'icon-diamond',
          data: {
            text: '菱形',
            rect: {
              width: 100,
              height: 100
            },
            name: 'diamond'
          }
        },
        {
          name: 'arrow',
          icon: 'icon-arrow',
          data: {
            text: '箭头',
            rect: {
              width: 100,
              height: 100
            },
            name: 'arrow'
          }
        },
        {
          name: 'text',
          icon: 'icon-text',
          data: {
            text: '这是一段测试文本，用来测试换行：This is a text.',
            rect: {
              width: 100,
              height: 100
            },
            name: 'text'
          }
        },
        {
          name: 'image',
          icon: 'icon-image',
          data: {
            rect: {
              width: 100,
              height: 100
            },
            name: 'image',
            image: '/assets/img/logo.png'
          }
        },
        {
          name: 'line',
          icon: 'icon-line',
          data: {
            text: '直线',
            rect: {
              width: 100,
              height: 100
            },
            name: 'line'
          }
        },
        {
          name: 'more[Todo]',
          icon: 'icon-more'
        }
      ]
    },
    {
      group: '流程图',
      children: [
        {
          name: 'rect',
          icon: 'icon-rounded-rect',
          data: {
            text: '开始/结束',
            textMaxLine: 1,
            rect: {
              width: 100,
              height: 50
            },
            borderRadius: 0.5,
            name: 'rect'
          }
        },
        {
          name: 'rect',
          icon: 'icon-rect',
          data: {
            text: '矩形',
            rect: {
              width: 100,
              height: 100
            },
            name: 'rect',
            icon: '\uec46',
            iconFamily: 'iconfont',
            iconSize: 40,
            iconColor: '#2f54eb'
          }
        },
        {
          name: 'circle',
          icon: 'icon-circle',
          data: {
            text: '圆',
            rect: {
              width: 100,
              height: 100
            },
            name: 'circle',
            textMaxLine: 1
          }
        },
        {
          name: 'diamond',
          icon: 'icon-diamond',
          data: {
            text: '菱形',
            rect: {
              width: 100,
              height: 100
            },
            name: 'diamond'
          }
        },
        {
          name: 'more[Todo]',
          icon: 'icon-more'
        }
      ]
    },
    {
      group: '活动图',
      children: [
        {
          name: 'rect',
          icon: 'icon-round-rect',
          data: {
            text: '圆角矩形',
            textMaxLine: 1,
            rect: {
              width: 100,
              height: 50
            },
            borderRadius: 0.2,
            name: 'rect'
          }
        },
        {
          name: 'rect',
          icon: 'icon-rect',
          data: {
            text: '矩形',
            rect: {
              width: 100,
              height: 50
            },
            name: 'rect'
          }
        },
        {
          name: 'circle',
          icon: 'icon-circle',
          data: {
            text: '圆',
            rect: {
              width: 100,
              height: 100
            },
            name: 'circle',
            textMaxLine: 1
          }
        },
        {
          name: 'more[Todo]',
          icon: 'icon-more'
        }
      ]
    },
    {
      group: 'UML类图',
      children: [
        {
          name: 'rect',
          icon: 'icon-round-rect',
          data: {
            text: '圆角矩形',
            textMaxLine: 1,
            rect: {
              width: 200,
              height: 50
            },
            borderRadius: 0.1,
            name: 'rect'
          }
        },
        {
          name: 'more[Todo]',
          icon: 'icon-more'
        }
      ]
    }
  ];
  canvas: Topology;
  canvasOptions: Options = {};
  filename = '空白图形';
  selectedNodes: Node[];
  selectedLine: Line;
  constructor() {}

  ngOnInit() {
    this.canvasOptions.on = this.onMessage;
    this.canvas = new Topology(this.workspace.nativeElement, this.canvasOptions);
    // window.canvas = this.canvas;
  }

  onDrag(event: DragEvent, node: any) {
    event.dataTransfer.setData('Text', JSON.stringify(node.data));
  }

  onkeyDocument(key: KeyboardEvent) {
    switch (key.keyCode) {
      case 68:
        if (key.ctrlKey) {
          this.onSavePng();
        }
        break;
      case 78:
        if (key.ctrlKey) {
          this.onNew();
        }
        break;
      case 79:
        if (key.ctrlKey) {
          this.onOpen();
        }
        break;
      case 83:
        if (key.ctrlKey) {
          if (key.shiftKey) {
            // Save as
          } else {
            // Save
          }
        }
        if (key.altKey && key.shiftKey) {
          this.onSaveLocal();
        }
        break;
      case 88:
        if (key.ctrlKey) {
          this.onCut();
        }
        break;
      case 67:
        if (key.ctrlKey) {
          this.onCopy();
        }
        break;
      case 86:
        if (key.ctrlKey) {
          this.onParse();
        }
        break;
      case 89:
        if (key.ctrlKey) {
          this.canvas.redo();
        }
        break;
      case 90:
        if (key.ctrlKey) {
          if (key.shiftKey) {
            this.canvas.redo();
          } else {
            this.canvas.undo();
          }
        }
        break;
    }

    return false;
  }

  onNew() {
    this.canvas.render({ nodes: [], lines: [] });
  }

  onOpen() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = event => {
      const elem: any = event.srcElement || event.target;
      if (elem.files && elem.files[0]) {
        this.filename = elem.files[0].name.replace('.json', '');
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const text = e.target.result + '';
          try {
            const data = JSON.parse(text);
            if (data && Array.isArray(data.nodes) && Array.isArray(data.lines)) {
              this.canvas.render(data, true);
            }
          } catch (e) {
            return false;
          }
        };
        reader.readAsText(elem.files[0]);
      }
    };
    input.click();
  }

  onSaveLocal() {
    const data = this.canvas.save();
    FileSaver.saveAs(new Blob([data], { type: 'text/plain;charset=utf-8' }), 'le5le.topology.json');
  }

  onSavePng() {
    this.canvas.saveAsPng();
  }

  onCut() {
    this.canvas.cut();
  }
  onCopy() {
    this.canvas.copy();
  }
  onParse() {
    this.canvas.parse();
  }

  onMessage = (event: string, data: any) => {
    switch (event) {
      case 'node':
        this.selectedNodes = [data];
        this.selectedLine = null;
        break;
      case 'nodes':
        this.selectedNodes = data;
        this.selectedLine = null;
        break;
      case 'line':
        this.selectedNodes = null;
        this.selectedLine = data;
        break;
      case 'space':
        this.selectedNodes = null;
        this.selectedLine = null;
        break;
    }
    console.log('onMessage:', event, data, this.selectedNodes, this.selectedLine);
  };
}
