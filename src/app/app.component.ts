import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { StoreService } from 'le5le-store';

import { NoticeService } from 'le5le-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(document:keydown)': 'onkeyDocument($event)'
  }
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private _storeService: StoreService) {}

  ngOnInit() {}

  onkeyDocument(event: KeyboardEvent) {
    event.returnValue = false;

    // tslint:disable-next-line:triple-equals
    if (event.keyCode != 27) {
      return;
    }
    const modals: any = document.querySelectorAll('.modal');

    if (modals && modals.length) {
      if (modals[modals.length - 1].className.indexOf('no-esc') > -1) {
        return;
      }
      if (modals[modals.length - 1].className.indexOf('confirm') > -1) {
        const _noticeService: NoticeService = new NoticeService();
        _noticeService.dialog({
          title: '提示',
          body: '确定退出当前窗口？',
          callback: async (ret: boolean) => {
            if (ret) {
              modals[modals.length - 1].parentElement.removeChild(modals[modals.length - 1]);
            }
          }
        });
      } else if (modals[modals.length - 1].className.indexOf('disable-cancel') === -1) {
        modals[modals.length - 1].parentElement.removeChild(modals[modals.length - 1]);
      }
    }
  }

  ngOnDestroy() {}
}
