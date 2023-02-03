import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TendersComponent } from './tenders.component';

const routes: Routes = [
  {
    path: '',
    component: TendersComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TendersRoutingModule { }
