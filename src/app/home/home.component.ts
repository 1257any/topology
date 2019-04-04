import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Topology } from 'libs/topology';
import { drawFns } from 'libs/topology/middles/index';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('workspace') workspace: ElementRef;
  tools: any[] = [
    {
      group: '基本形状',
      children: [
        {
          name: 'roundRect',
          icon: 'icon-round-rect',
          data: {
            width: 100,
            height: 100,
            drawFnName: 'roundRect'
          }
        },
        {
          name: 'rect',
          icon: 'icon-rect',
          data: {
            width: 100,
            height: 100,
            drawFnName: 'rect'
          }
        },
        {
          name: 'circle',
          icon: 'icon-circle',
          data: {
            width: 100,
            height: 100,
            drawFnName: 'circle'
          }
        },
        {
          name: 'triangle',
          icon: 'icon-triangle',
          data: {
            width: 100,
            height: 100,
            drawFnName: 'triangle'
          }
        },
        {
          name: 'diamond',
          icon: 'icon-diamond',
          data: {
            width: 100,
            height: 100,
            drawFnName: 'diamond'
          }
        },
        {
          name: 'arrow',
          icon: 'icon-arrow-right',
          data: {
            width: 100,
            height: 100,
            drawFnName: 'arrow'
          }
        },
        {
          name: 'text',
          icon: 'icon-text',
          data: {
            text: '这是测试文本：This is a text.',
            width: 100,
            height: 100,
            drawFnName: 'text'
          }
        },
        {
          name: 'image',
          icon: 'icon-image',
          data: {
            width: 100,
            height: 100,
            drawFnName: 'image',
            image: '/assets/img/logo.png'
          }
        },
        {
          name: 'line',
          icon: 'icon-line',
          data: {
            width: 100,
            height: 100,
            drawFnName: 'line'
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
}
