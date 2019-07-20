import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserHomeService } from './home.service';
@Component({
  selector: 'app-user-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [UserHomeService],
  host: {
    '(document:mousedown)': 'onclickDocument()'
  }
})
export class UserHomeComponent implements OnInit, OnDestroy {
  search = {
    text: '',
    user: '',
    pageIndex: 1,
    pageCount: 8
  };
  data = {
    list: [],
    count: 0
  };
  loading = true;

  desc = '';
  edited: any = {};

  subRoute: any;
  constructor(private service: UserHomeService, private router: Router, private activateRoute: ActivatedRoute) {}

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

  onEditDesc(event: MouseEvent, item: any) {
    event.stopPropagation();

    this.desc = item.desc;
    item.edited = true;
    this.edited = item;
  }

  async onSubmitDesc(invalid: boolean) {
    if (invalid) {
      return;
    }

    if (
      !(await this.service.Patch({
        id: this.edited.id,
        desc: this.desc
      }))
    ) {
      return;
    }

    this.edited.desc = this.desc;
    this.edited.edited = false;
  }

  onclickDocument() {
    this.edited.edited = false;
  }

  onEnterDesc(e: KeyboardEvent) {
    e.stopPropagation();
    if (e.keyCode !== 13) {
      return;
    }
    if (e.ctrlKey) {
      this.desc += '\n';
      return;
    }

    this.onSubmitDesc(!this.desc);
  }

  ngOnDestroy() {
    this.subRoute.unsubscribe();
  }
}
