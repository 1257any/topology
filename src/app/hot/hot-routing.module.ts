import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HotComponent } from './hot.component';

const hotRoutes: Routes = [
  {
    path: '',
    component: HotComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(hotRoutes)],
  exports: [RouterModule]
})
export class HotRoutingModule {}
