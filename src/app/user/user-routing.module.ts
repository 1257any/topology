import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { UserHomeComponent } from './home/home.component';
import { UserFavoriteComponent } from './favorite/favorite.component';
import { UserHistoryComponent } from './history/history.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'home', component: UserHomeComponent },
      { path: 'favorite', component: UserFavoriteComponent },
      { path: 'history', component: UserHistoryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
