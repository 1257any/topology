import { Component, OnInit, OnDestroy } from '@angular/core';

import { StoreService } from 'le5le-store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  user: any;
  urls = environment.urls;
  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.user = this.storeService.get('user');
    this.storeService.get$('user').subscribe((user: any) => {
      this.user = user;
    });
  }

  onMenu(menu: string) {
    this.storeService.set('clickMenu', menu);
  }

  onSignup() {
    location.href = `${environment.urls.account}?signup=true`;
  }

  onLogin() {
    location.href = environment.urls.account;
  }

  onSignout() {
    this.storeService.set('user', -1);
  }

  ngOnDestroy() {}
}
