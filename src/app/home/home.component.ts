import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Topology } from 'libs/topology';
import { Options } from 'libs/topology/options';
import { registerNode } from 'libs/topology/middles';
import {
  flowData,
  flowDataAnchors,
  flowDataIconRect,
  flowDataTextRect,
  flowSubprocess,
  flowSubprocessIconRect,
  flowSubprocessTextRect,
  flowDb,
  flowDbIconRect,
  flowDbTextRect,
  flowDocument,
  flowDocumentAnchors,
  flowDocumentIconRect,
  flowDocumentTextRect,
  flowInternalStorage,
  flowInternalStorageIconRect,
  flowInternalStorageTextRect,
  flowExternStorage,
  flowExternStorageAnchors,
  flowExternStorageIconRect,
  flowExternStorageTextRect,
  flowQueue,
  flowQueueIconRect,
  flowQueueTextRect,
  flowManually,
  flowManuallyAnchors,
  flowManuallyIconRect,
  flowManuallyTextRect,
  flowDisplay,
  flowDisplayAnchors,
  flowDisplayIconRect,
  flowDisplayTextRect,
  flowParallel,
  flowParallelAnchors,
  flowComment,
  flowCommentAnchors
} from 'libs/topology-flow-diagram';

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
            icon: '\ue64d',
            iconFamily: 'topology',
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
          icon: 'icon-pentagram',
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
              width: 80,
              height: 100
            },
            name: 'file'
          }
        },
        {
          name: 'text',
          icon: 'icon-text',
          data: {
            text: 'le5le-topology / 乐吾乐',
            rect: {
              width: 160,
              height: 30
            },
            name: 'text'
          }
        },
        {
          name: 'image',
          icon: 'icon-image',
          data: {
            text: '图片',
            rect: {
              width: 80,
              height: 100
            },
            name: 'image',
            image: '/assets/img/logo.png'
          }
        },
        {
          name: 'cube',
          icon: 'icon-cube',
          data: {
            rect: {
              width: 50,
              height: 70
            },
            is3D: true,
            z: 10,
            zRotate: 15,
            fillStyle: '#ddd',
            name: 'cube',
            icon: '\ue63c',
            iconFamily: 'topology',
            iconColor: '#777',
            iconSize: 30
          }
        }
      ]
    },
    {
      group: '流程图',
      children: [
        {
          name: '开始/结束',
          icon: 'icon-flow-start',
          data: {
            text: '开始',
            textMaxLine: 1,
            rect: {
              width: 120,
              height: 40
            },
            borderRadius: 0.5,
            name: 'rectangle'
          }
        },
        {
          name: '流程',
          icon: 'icon-rectangle',
          data: {
            text: '流程',
            rect: {
              width: 120,
              height: 40
            },
            name: 'rectangle'
          }
        },
        {
          name: '判定',
          icon: 'icon-diamond',
          data: {
            text: '判定',
            rect: {
              width: 120,
              height: 60
            },
            name: 'diamond'
          }
        },
        {
          name: '数据',
          icon: 'icon-flow-data',
          data: {
            text: '数据',
            rect: {
              width: 120,
              height: 50
            },
            name: 'flowData'
          }
        },
        {
          name: '准备',
          icon: 'icon-flow-ready',
          data: {
            text: '准备',
            rect: {
              width: 120,
              height: 50
            },
            name: 'hexagon'
          }
        },
        {
          name: '子流程',
          icon: 'icon-flow-subprocess',
          data: {
            text: '子流程',
            rect: {
              width: 120,
              height: 50
            },
            name: 'flowSubprocess'
          }
        },
        {
          name: '数据库',
          icon: 'icon-db',
          data: {
            text: '数据库',
            rect: {
              width: 80,
              height: 120
            },
            name: 'flowDb'
          }
        },
        {
          name: '文档',
          icon: 'icon-flow-document',
          data: {
            text: '文档',
            rect: {
              width: 120,
              height: 100
            },
            name: 'flowDocument'
          }
        },
        {
          name: '内部存储',
          icon: 'icon-internal-storage',
          data: {
            text: '内部存储',
            rect: {
              width: 120,
              height: 80
            },
            name: 'flowInternalStorage'
          }
        },
        {
          name: '外部存储',
          icon: 'icon-extern-storage',
          data: {
            text: '外部存储',
            rect: {
              width: 120,
              height: 80
            },
            name: 'flowExternStorage'
          }
        },
        {
          name: '队列',
          icon: 'icon-flow-queue',
          data: {
            text: '队列',
            rect: {
              width: 100,
              height: 100
            },
            name: 'flowQueue'
          }
        },
        {
          name: '手动输入',
          icon: 'icon-flow-manually',
          data: {
            text: '手动输入',
            rect: {
              width: 120,
              height: 80
            },
            name: 'flowManually'
          }
        },
        {
          name: '展示',
          icon: 'icon-flow-display',
          data: {
            text: '展示',
            rect: {
              width: 120,
              height: 80
            },
            name: 'flowDisplay'
          }
        },
        {
          name: '并行模式',
          icon: 'icon-flow-parallel',
          data: {
            text: '并行模式',
            rect: {
              width: 120,
              height: 50
            },
            name: 'flowParallel'
          }
        },
        {
          name: '注释',
          icon: 'icon-flow-comment',
          data: {
            text: '注释',
            rect: {
              width: 100,
              height: 100
            },
            name: 'flowComment'
          }
        }
      ]
    },
    {
      group: '活动图 [Todo]',
      children: []
    },
    {
      group: 'UML类图 [Todo]',
      children: []
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
  icons: { icon: string; iconFamily: string }[] = [];
  readonly = false;

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
      if (this.data && user && this.data.userId !== this.user.id) {
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
          this.onSavePng(menu.data);
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
          this.readonly = menu.data;
          this.canvas.lock(menu.data);
          break;
      }
    });

    // Wait for parent dom render.
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

    this.canvasRegister();
  }

  canvasRegister() {
    registerNode('flowData', flowData, flowDataAnchors, flowDataIconRect, flowDataTextRect);
    registerNode('flowSubprocess', flowSubprocess, null, flowSubprocessIconRect, flowSubprocessTextRect);
    registerNode('flowDb', flowDb, null, flowDbIconRect, flowDbTextRect);
    registerNode('flowDocument', flowDocument, flowDocumentAnchors, flowDocumentIconRect, flowDocumentTextRect);
    registerNode(
      'flowInternalStorage',
      flowInternalStorage,
      null,
      flowInternalStorageIconRect,
      flowInternalStorageTextRect
    );
    registerNode(
      'flowExternStorage',
      flowExternStorage,
      flowExternStorageAnchors,
      flowExternStorageIconRect,
      flowExternStorageTextRect
    );
    registerNode('flowQueue', flowQueue, null, flowQueueIconRect, flowQueueTextRect);
    registerNode('flowManually', flowManually, flowManuallyAnchors, flowManuallyIconRect, flowManuallyTextRect);
    registerNode('flowDisplay', flowDisplay, flowDisplayAnchors, flowDisplayIconRect, flowDisplayTextRect);
    registerNode('flowParallel', flowParallel, flowParallelAnchors, null, null);
    registerNode('flowComment', flowComment, flowCommentAnchors, null, null);
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
    this.data.data = this.canvas.data();
    this.canvas.toImage(null, null, async blob => {
      if (this.data.id && !this.coreService.isVip(this.user)) {
        await this.service.DelImage(this.data.image);
      }
      const file = await this.service.Upload(blob, this.data.shared);
      if (!file) {
        return;
      }
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
    const data = this.canvas.data();
    FileSaver.saveAs(
      new Blob([JSON.stringify(data)], { type: 'text/plain;charset=utf-8' }),
      `${this.data.name || 'le5le.topology'}.json`
    );
  }

  onSavePng(options?: { type?: string; quality?: any; ext?: string }) {
    if (!options) {
      options = {};
    }
    const name = this.data.name + (options.ext || '.png');
    this.canvas.saveAsImage(name, options.type, options.quality);
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

    this.canvas.update(props.data);
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
