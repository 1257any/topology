import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Topology } from 'libs/topology';
import { Options } from 'libs/topology/options';
import { ActivatedRoute, Router } from '@angular/router';

import * as FileSaver from 'file-saver';
import { StoreService } from 'le5le-store';
import { NoticeService } from 'le5le-components/notice';

import { HomeService } from './home.service';
import { Props } from './props/props.model';
import { environment } from 'src/environments/environment';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(document:keydown)': 'onkeyDocument($event)'
  }
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('workspace', { static: true }) workspace: ElementRef;
  tools: any[] = [
    {
      group: '基本形状',
      children: [
        {
          name: 'rectangle',
          icon: 'icon-rect',
          data: {
            text: 'Topology',
            rect: {
              width: 100,
              height: 100
            },
            name: 'rectangle',
            icon: '\uec46',
            iconFamily: 'iconfont',
            iconSize: 40,
            iconColor: '#2f54eb'
          }
        },
        {
          name: 'rectangle',
          icon: 'icon-rectangle',
          data: {
            text: '圆角矩形',
            textMaxLine: 1,
            rect: {
              width: 200,
              height: 50
            },
            borderRadius: 0.1,
            name: 'rectangle'
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
          name: 'pentagon',
          icon: 'icon-pentagon',
          data: {
            text: '五边形',
            rect: {
              width: 100,
              height: 100
            },
            name: 'pentagon'
          }
        },
        {
          name: 'hexagon',
          icon: 'icon-hexagon',
          data: {
            text: '六边形',
            rect: {
              width: 100,
              height: 100
            },
            name: 'hexagon'
          }
        },
        {
          name: 'pentagram',
          icon: 'icon-star-o',
          data: {
            text: '五角星',
            rect: {
              width: 100,
              height: 100
            },
            name: 'pentagram'
          }
        },
        {
          name: 'leftArrow',
          icon: 'icon-arrow-left',
          data: {
            text: '左箭头',
            rect: {
              width: 200,
              height: 100
            },
            name: 'leftArrow'
          }
        },
        {
          name: 'rightArrow',
          icon: 'icon-arrow-right',
          data: {
            text: '右箭头',
            rect: {
              width: 200,
              height: 100
            },
            name: 'rightArrow'
          }
        },
        {
          name: 'twowayArrow',
          icon: 'icon-twoway-arrow',
          data: {
            text: '双向箭头',
            rect: {
              width: 200,
              height: 100
            },
            name: 'twowayArrow'
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
          name: 'text',
          icon: 'icon-text',
          data: {
            text:
              '便捷、开放、可扩展、云存储、社区等特点。快速创建微服务拓扑图、微服务流量动画演示、软件项目设计图、流程图、活动图、时序图、类图等UML各种图。',
            rect: {
              width: 100,
              height: 100
            },
            name: 'text'
          }
        },
        {
          name: 'cloud',
          icon: 'icon-cloud',
          data: {
            text: '云',
            rect: {
              width: 100,
              height: 100
            },
            name: 'cloud'
          }
        },
        {
          name: 'message',
          icon: 'icon-msg',
          data: {
            text: '消息框',
            rect: {
              width: 100,
              height: 100
            },
            name: 'message'
          }
        },
        {
          name: 'file',
          icon: 'icon-file',
          data: {
            text: '文档',
            rect: {
              width: 100,
              height: 100
            },
            name: 'file'
          }
        },
        {
          name: 'image',
          icon: 'icon-image',
          data: {
            text: '图片',
            rect: {
              width: 100,
              height: 100
            },
            name: 'image',
            image: '/assets/img/logo.png'
          }
        }
      ]
    },
    {
      group: '流程图',
      children: [
        {
          name: 'rectangle',
          icon: 'icon-rounded-rect',
          data: {
            text: '开始/结束',
            textMaxLine: 1,
            rect: {
              width: 100,
              height: 50
            },
            borderRadius: 0.5,
            name: 'rectangle'
          }
        },
        {
          name: 'rectangle',
          icon: 'icon-rect',
          data: {
            text: '矩形',
            rect: {
              width: 100,
              height: 100
            },
            name: 'rectangle',
            icon: '\uec46',
            iconFamily: 'iconfont',
            iconSize: 32,
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
          name: 'more[Todo]',
          icon: 'icon-more'
        }
      ]
    },
    {
      group: 'UML类图',
      children: [
        {
          name: 'more[Todo]',
          icon: 'icon-more'
        }
      ]
    }
  ];
  canvas: Topology;
  canvasOptions: Options = {};
  selected: Props;
  subMenu: any;

  data = {
    id: '',
    fileId: '',
    data: { nodes: [], lines: [] },
    name: '',
    desc: '',
    image: '',
    userId: '',
    shared: false
  };

  user: any;
  subUser: any;

  subRoute: any;
  constructor(
    private service: HomeService,
    private storeService: StoreService,
    private coreService: CoreService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.user = this.storeService.get('user');
    this.subUser = this.storeService.get$('user').subscribe((user: any) => {
      this.user = user;
      if (this.data && this.data.userId !== this.user.id) {
        this.data.shared = false;
        this.data.id = '';
      }
    });

    this.canvasOptions.on = this.onMessage;
    this.subMenu = this.storeService.get$('clickMenu').subscribe((menu: { event: string; data: any }) => {
      switch (menu.event) {
        case 'new':
          this.onNew();
          break;
        case 'open':
          this.selected = null;
          this.onOpenLocal();
          break;
        case 'save':
          this.save();
          break;
        case 'saveAs':
          this.data.id = '';
          this.save();
          break;
        case 'down':
          this.onSaveLocal();
          break;
        case 'downPng':
          this.onSavePng();
          break;
        case 'undo':
          this.canvas.undo();
          break;
        case 'redo':
          this.canvas.redo();
          break;
        case 'cut':
          this.canvas.cut();
          break;
        case 'copy':
          this.canvas.copy();
          break;
        case 'parse':
          this.canvas.parse();
          break;
        case 'filename':
          this.onSaveFilename(menu.data);
          break;
        case 'share':
          this.onShare();
          break;
        case 'lock':
          this.canvas.lock(menu.data);
          break;
      }
    });

    setTimeout(() => {
      this.canvas = new Topology(this.workspace.nativeElement, this.canvasOptions);
      this.subRoute = this.activateRoute.queryParamMap.subscribe(params => {
        if (params.get('id')) {
          this.onOpen({ id: params.get('id'), fileId: params.get('fileId') });
        } else {
          this.data = {
            id: '',
            fileId: '',
            data: { nodes: [], lines: [] },
            name: '',
            desc: '',
            image: '',
            userId: '',
            shared: false
          };
        }
      });
    });
  }

  onDrag(event: DragEvent, node: any) {
    event.dataTransfer.setData('Text', JSON.stringify(node.data));
  }

  onkeyDocument(key: KeyboardEvent) {
    if (key.target !== this.canvas.hoverLayer.canvas) {
      return;
    }

    switch (key.keyCode) {
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
  }

  onNew() {
    this.data = {
      id: '',
      fileId: '',
      data: { nodes: [], lines: [] },
      name: '',
      desc: '',
      image: '',
      userId: '',
      shared: false
    };
    this.storeService.set('file', this.data);
    this.canvas.render(this.data.data, true);
  }

  async onOpen(data: { id: string; fileId?: string }) {
    const ret = await this.service.Get(data);
    if (!ret) {
      this.router.navigateByUrl('/');
      return;
    }

    this.storeService.set('recently', {
      id: ret.id,
      fileId: ret.fileId || '',
      image: ret.image,
      name: ret.name,
      desc: ret.desc
    });

    if (this.user && ret.userId !== this.user.id) {
      ret.shared = false;
      ret.id = '';
    }
    this.data = ret;
    this.canvas.render(ret.data, true);

    this.storeService.set('file', this.data);
  }

  onOpenLocal() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = event => {
      const elem: any = event.srcElement || event.target;
      if (elem.files && elem.files[0]) {
        this.data.name = elem.files[0].name.replace('.json', '');
        this.storeService.set('file', this.data);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const text = e.target.result + '';
          try {
            const data = JSON.parse(text);
            if (data && Array.isArray(data.nodes) && Array.isArray(data.lines)) {
              this.data = {
                id: '',
                fileId: '',
                data,
                name: '',
                desc: '',
                image: '',
                userId: '',
                shared: false
              };
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

  save() {
    this.data.data = this.canvas.save();
    this.canvas.toImage(async blob => {
      if (this.data.id && !this.coreService.isVip(this.user)) {
        await this.service.DelImage(this.data.image);
      }
      const file = await this.service.Upload(blob, this.data.shared);
      this.data.image = file.url;
      const ret = await this.service.Save(this.data);
      if (ret) {
        this.data.id = ret.id;
        this.storeService.set('file', this.data);
        const _noticeService: NoticeService = new NoticeService();
        _noticeService.notice({
          body: '保存成功！',
          theme: 'success'
        });

        this.storeService.set('recently', {
          id: this.data.id,
          fileId: this.data.fileId || '',
          image: this.data.image,
          name: this.data.name,
          desc: this.data.desc
        });
      }
    });
  }

  async onSaveFilename(filename: string) {
    if (this.data.id) {
      if (
        !(await this.service.Patch({
          id: this.data.id,
          name: filename
        }))
      ) {
        return;
      }

      this.storeService.set('recently', {
        id: this.data.id,
        fileId: this.data.fileId || '',
        image: this.data.image,
        name: filename
      });
    }

    this.data.name = filename;
    this.storeService.set('file', this.data);
  }

  onSaveLocal() {
    const data = this.canvas.save();
    FileSaver.saveAs(new Blob([JSON.stringify(data)], { type: 'text/plain;charset=utf-8' }), 'le5le.topology.json');
  }

  onSavePng() {
    this.canvas.saveAsPng();
  }

  async onShare() {
    if (!this.data.id) {
      return;
    }

    if (
      !(await this.service.Patch({
        id: this.data.id,
        image: this.data.image,
        shared: !this.data.shared
      }))
    ) {
      return;
    }

    this.data.shared = !this.data.shared;
    this.storeService.set('file', this.data);
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
      case 'line':
      case 'multi':
        this.selected = {
          type: event,
          data
        };
        break;
      case 'space':
        this.selected = null;
        break;
    }
    // console.log('onMessage:', event, data, this.selected);
  };

  onChangeProps(props: any) {
    if (this.canvas.locked) {
      return;
    }

    if (props.type === 'line') {
      this.canvas.lineName = props.data.name;
      this.canvas.activeLayer.changeLineType();
    }

    this.canvas.update();
  }

  onSignup() {
    location.href = `${environment.urls.account}?signup=true`;
  }

  onLogin() {
    location.href = environment.urls.account;
  }

  ngOnDestroy() {
    this.subMenu.unsubscribe();
    this.subUser.unsubscribe();
    this.subRoute.unsubscribe();
  }
}
