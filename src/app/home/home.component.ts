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

import { HomeService, Tools } from './home.service';
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
  tools: any[] = Tools;
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

  mouseMoving = false;

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
    // for demo
    if (this.data.name === 'cube-demo') {
      const colors = ['#ff6600', '#1890ff', '#52c41a', '#1890ff', '#ff6600'];
      for (let i = 0; i < 5; ++i) {
        this.data.data.lines[i].animateColor = colors[i];
        this.data.data.lines[i].animateSpeed = 2;
        this.data.data.lines[i].animatePlay = true;
      }
    }
    this.canvas.render(ret.data, true);

    this.storeService.set('file', this.data);

    // for demo
    if (this.data.name === 'cube-demo') {
      for (let i = 0; i < 5; ++i) {
        this.canvas.playAnimate(this.data.data.lines[i]);
      }
    }
    // end
  }

  onOpenLocal() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = event => {
      const elem: any = event.srcElement || event.target;
      if (elem.files && elem.files[0]) {
        const name = elem.files[0].name.replace('.json', '');
        this.data.name = name;
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
                name: name,
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
        if (!(await this.service.DelImage(this.data.image))) {
          return;
        }
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

        this.router.navigate(['/'], { queryParams: { id: this.data.id } });
      }
    });
  }

  async onSaveFilename(filename: string) {
    this.data.name = filename;
    this.storeService.set('file', this.data);

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
      case 'moveOut':
        this.workspace.nativeElement.scrollLeft += 10;
        this.workspace.nativeElement.scrollTop += 10;
        break;
      case 'resize':
        if (!this.mouseMoving) {
          this.mouseMoving = true;
          this.workspace.nativeElement.scrollLeft = this.workspace.nativeElement.scrollWidth;
          this.workspace.nativeElement.scrollTop = this.workspace.nativeElement.scrollHeight;
          setTimeout(() => {
            this.mouseMoving = false;
          }, 2000);
        }

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

    this.canvas.updateActive(props.data);
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
