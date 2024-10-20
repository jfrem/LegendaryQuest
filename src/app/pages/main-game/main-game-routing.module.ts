import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainGamePage } from './main-game.page';

const routes: Routes = [
  {
    path: '',
    component: MainGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainGamePageRoutingModule {}
