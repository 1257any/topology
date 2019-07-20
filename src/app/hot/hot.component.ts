import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { StoreService } from 'le5le-store';
import { NoticeService } from 'le5le-components/notice';

import { HotService } from './hot.service';

@Component({
  selector: 'app-hot',
  templateUrl: 'hot.component.html',
  styleUrls: ['./hot.component.scss'],
  providers: [HotService]
})
export class HotComponent implements OnInit, OnDestroy {
  search = {
    desc: '',
    user: '',
    pageIndex: 1,
    pageCount: 8
  };
  data = {
    list: [],
    count: 0
  };
  loading = true;

  subRoute: any;
  constructor(
    private service: HotService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    this.subRoute = this.activateRoute.queryParamMap.subscribe(params => {
      this.search.pageIndex = +params.get('pageIndex') || 1;
      this.search.pageCount = +params.get('pageCount') || 8;
      this.list();
    });
  }

  async list(pageIndex?: number) {
    if (pageIndex > 0) {
      this.search.pageIndex = pageIndex;
    }

    this.loading = true;
    this.data = await this.service.Topologies(this.search);
    this.loading = false;
  }

  onOpen(item: any) {
    this.router.navigate(['/'], {
      queryParams: {
        id: item.id
      }
    });
  }

  onFavorite(event: MouseEvent, item: any) {
    event.stopPropagation();

    if (!this.storeService.get('user')) {
      const _noticeService: NoticeService = new NoticeService();
      _noticeService.notice({
        body: '请先登录',
        theme: 'error'
      });
      return;
    }

    this.service.Favorite(item);
  }

  onStar(event: MouseEvent, item: any) {
    event.stopPropagation();

    if (!this.storeService.get('user')) {
      const _noticeService: NoticeService = new NoticeService();
      _noticeService.notice({
        body: '请先登录',
        theme: 'error'
      });
      return;
    }

    this.service.Star(item);
  }

  ngOnDestroy() {
    this.subRoute.unsubscribe();
  }
}
