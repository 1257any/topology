import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HotRoutingModule } from './hot-routing.module';
import { HotComponent } from './hot.component';

@NgModule({
  imports: [SharedModule, HotRoutingModule],
  declarations: [HotComponent]
})
export class HotModule {}
