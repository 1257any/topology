import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Topology } from 'libs/topology';

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
            text: '带图标的圆角矩形',
            textMaxLine: 1,
            icon: '\uec46',
            iconFamily: 'iconfont',
            iconSize: 40,
            iconColor: '#2f54eb',
            rect: {
              width: 200,
              height: 100
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
        }
      ]
    }
  ];
  canvas: Topology;
  constructor() {}

  ngOnInit() {
    this.canvas = new Topology(this.workspace.nativeElement);
  }

  onDrag(event: DragEvent, node: any) {
    event.dataTransfer.setData('Text', JSON.stringify(node.data));
  }

  onkeyDocument(key: KeyboardEvent) {
    switch (key.keyCode) {
      case 89:
        if (key.ctrlKey) {
          this.canvas.redo();
        }
        break;
      case 90:
        if (key.ctrlKey) {
          this.canvas.undo();
        }
        break;
    }
  }
}
