import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { StoreService } from 'le5le-store';
import { environment } from 'src/environments/environment';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService]
})
export class AppComponent implements OnInit, OnDestroy {
  user: any;
  urls = environment.urls;
  file = {
    id: '',
    fileId: '',
    data: { nodes: [], lines: [] },
    name: '',
    desc: '',
    image: '',
    shared: false
  };
  filename = '';
  list = {
    recommend: [],
    recently: [],
    created: []
  };
  menuClicked = false;
  showFigure = false;
  editFilename = false;
  blank = false;
  editMode = false;
  locked = false;

  disableStartDlg = false;

  showLicense = false;
  showHelp = false;
  showAbout = false;
  constructor(private service: AppService, private storeService: StoreService, private router: Router) {}

  ngOnInit() {
    this.disableStartDlg = localStorage.getItem('disable.startDlg') === 'true';
    this.blank = location.pathname === '/' && !location.search && !this.disableStartDlg;
    this.user = this.storeService.get('user');
    this.storeService.get$('user').subscribe((user: any) => {
      this.user = user;
      this.getRecently();
      this.getStarTopo();
      this.getUserTopo();
    });

    this.storeService.get$('file').subscribe((file: any) => {
      this.locked = false;
      this.file = file;
      this.filename = file.name;
      this.editFilename = false;
    });

    this.storeService.get$('recently').subscribe((item: any) => {
      for (let i = 0; i < this.list.recently.length; ++i) {
        if (this.list.recently[i].id === item.id || i > 3) {
          this.list.recently.splice(i, 1);
        }
      }

      this.list.recently.unshift(item);
      if (this.user) {
        localStorage.setItem('recently_' + this.user.id, JSON.stringify(this.list.recently));
      }
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      const pathname = (event as NavigationEnd).url.substring(0, (event as NavigationEnd).url.indexOf('?'));
      if ((event as NavigationEnd).url === '/' || pathname === '/') {
        this.editMode = true;
      } else {
        this.editMode = false;
        this.file = {
          id: '',
          fileId: '',
          data: { nodes: [], lines: [] },
          name: '',
          desc: '',
          image: '',
          shared: false
        };
      }
    });

    this.getRecently();
    this.getStarTopo();
    this.getUserTopo();
  }

  async getStarTopo() {
    const ret = await this.service.Topologies({ pageIndex: 1, pageCount: 5, count: 0 });
    this.list.recommend = ret.list;
  }

  async getUserTopo() {
    if (!this.user) {
      return;
    }

    const ret = await this.service.UserTopologies({ pageIndex: 1, pageCount: 5, count: 0 });
    this.list.created = ret.list;
  }

  getRecently() {
    if (!this.user) {
      return;
    }

    try {
      this.list.recently = JSON.parse(localStorage.getItem('recently_' + this.user.id));
    } catch (e) {}

    if (!this.list.recently) {
      this.list.recently = [];
    }
  }

  onMenu(menu: string, data?: any) {
    if (!this.editMode && menu !== 'new' && menu !== 'open') {
      return;
    }

    if (menu === 'new' || menu === 'open') {
      this.router.navigateByUrl('/');
    }

    setTimeout(
      () => {
        this.storeService.set('clickMenu', {
          event: menu,
          data
        });
      },
      this.editMode ? 0 : 300
    );

    this.blank = false;
  }

  onClickMenu(event: MouseEvent) {
    if ((event.target as HTMLElement).nodeName === 'A') {
      let node = (event.target as HTMLElement).parentElement;
      let isDropdown = false;
      let disabled = false;
      while (node) {
        if (node.className.indexOf('dropdown') > -1) {
          isDropdown = true;
        }
        if (node.className.indexOf('disabled') > -1) {
          disabled = true;
          break;
        }
        node = node.parentElement;
      }

      if (disabled) {
        return;
      }

      if (isDropdown) {
        this.menuClicked = true;
        setTimeout(() => {
          this.menuClicked = false;
        }, 500);
      }
    }
  }

  onLeaveFigure() {
    setTimeout(() => {
      this.showFigure = false;
    }, 800);
  }

  onEditFile(input: HTMLElement) {
    this.editFilename = true;
    setTimeout(() => {
      input.focus();
    });
  }

  async onSubmit(invalid: boolean) {
    if (invalid) {
      return;
    }

    this.storeService.set('clickMenu', {
      event: 'filename',
      data: this.filename
    });
  }

  onClick() {
    if (this.editFilename) {
      this.onSubmit(!this.filename);
    }
    this.editFilename = false;
  }

  onHome() {
    this.router.navigateByUrl('/');
  }

  onSignup() {
    location.href = `${environment.urls.account}?signup=true`;
  }

  onLogin() {
    location.href = `${environment.urls.account}?cb=${encodeURIComponent(location.href)}`;
  }

  onSignout() {
    this.storeService.set('auth', -1);
  }

  onChangeDisableStart() {
    localStorage.setItem('disable.startDlg', this.disableStartDlg + '');
  }

  ngOnDestroy() {}
}
