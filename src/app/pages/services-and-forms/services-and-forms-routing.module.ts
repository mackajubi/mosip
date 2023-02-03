import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RopForm2Component } from './registration-of-persons/rop-form2/rop-form2.component';
import { RopForm3Component } from './registration-of-persons/rop-form3/rop-form3.component';

import { ServicesAndFormsComponent } from './services-and-forms.component';
import { BirthsForm8Component } from './births/births-form8/births-form8.component';
import { DeathsForm16Component } from './deaths/deaths-form16/deaths-form16.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesAndFormsComponent,
    children: [
      {
        path: '',
        redirectTo: 'registration-of-persons-form-3',
        pathMatch: 'full',
      },
      {
        path: 'registration-of-persons-form-2',
        component: RopForm2Component
      },
      {
        path: 'registration-of-persons-form-3',
        component: RopForm3Component
      },
      {
        path: 'births-form-8',
        component: BirthsForm8Component
      },
      {
        path: 'deaths-form-16',
        component: DeathsForm16Component
      },
    ]      
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesAndFormsRoutingModule { }
