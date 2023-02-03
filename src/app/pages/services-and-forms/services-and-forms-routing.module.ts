import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RopForm1Component } from './registration-of-persons/rop-form1/rop-form1.component';
import { RopForm2Component } from './registration-of-persons/rop-form2/rop-form2.component';
import { RopForm3Component } from './registration-of-persons/rop-form3/rop-form3.component';
import { RopForm11Component } from './registration-of-persons/rop-form11/rop-form11.component';

import { ServicesAndFormsComponent } from './services-and-forms.component';
import { BirthsForm3Component } from './births/births-form3/births-form3.component';
import { BirthsForm6Component } from './births/births-form6/births-form6.component';
import { BirthsForm7Component } from './births/births-form7/births-form7.component';
import { BirthsForm8Component } from './births/births-form8/births-form8.component';
import { DeathsForm11Component } from './deaths/deaths-form11/deaths-form11.component';
import { DeathsForm12Component } from './deaths/deaths-form12/deaths-form12.component';
import { DeathsForm13Component } from './deaths/deaths-form13/deaths-form13.component';
import { DeathsForm15Component } from './deaths/deaths-form15/deaths-form15.component';
import { DeathsForm16Component } from './deaths/deaths-form16/deaths-form16.component';
import { BirthsForm5Component } from './births/births-form5/births-form5.component';
import { RopFormXComponent } from './registration-of-persons/rop-form-x/rop-form-x.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesAndFormsComponent,
    children: [
      {
        path: '',
        redirectTo: 'registration-of-persons-form-1',
        pathMatch: 'full',
      },
      {
        path: 'registration-of-persons-form-1',
        component: RopForm1Component
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
        path: 'registration-of-persons-form-11',
        component: RopForm11Component
      },
      {
        path: 'registration-of-persons-form-x',
        component: RopFormXComponent
      },
      {
        path: 'births-form-3',
        component: BirthsForm3Component
      },
      {
        path: 'births-form-5',
        component: BirthsForm5Component
      },
      {
        path: 'births-form-6',
        component: BirthsForm6Component
      },
      {
        path: 'births-form-7',
        component: BirthsForm7Component
      },
      {
        path: 'births-form-8',
        component: BirthsForm8Component
      },
      {
        path: 'deaths-form-11',
        component: DeathsForm11Component
      },
      {
        path: 'deaths-form-12',
        component: DeathsForm12Component
      },
      {
        path: 'deaths-form-13',
        component: DeathsForm13Component
      },
      {
        path: 'deaths-form-15',
        component: DeathsForm15Component
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
