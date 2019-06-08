import { Component, OnInit, OnDestroy } from '@angular/core';

import { StoreService } from 'le5le-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private _storeService: StoreService) {}

  ngOnInit() {}

  ngOnDestroy() {}
}
