import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Topology } from 'libs/topology';

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
          icon: 'icon-round-rect'
        },
        {
          name: 'rect',
          icon: 'icon-rect'
        },
        {
          name: 'circle',
          icon: 'icon-circle'
        },
        {
          name: 'triangle',
          icon: 'icon-triangle'
        },
        {
          name: 'diamond',
          icon: 'icon-diamond'
        },
        {
          name: 'arrow',
          icon: 'icon-arrow-right'
        },
        {
          name: 'text',
          icon: 'icon-text'
        }
      ]
    }
  ];
  canvas: Topology;
  constructor() {}

  ngOnInit() {
    this.canvas = new Topology(this.workspace.nativeElement);
  }
}
