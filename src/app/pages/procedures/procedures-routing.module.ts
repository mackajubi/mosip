import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProceduresComponent } from './procedures.component';

const routes: Routes = [
  {
    path: '',
    component: ProceduresComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProceduresRoutingModule { }
