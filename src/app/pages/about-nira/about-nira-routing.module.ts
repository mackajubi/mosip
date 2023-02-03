import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WhoWeAreComponent } from './who-we-are/who-we-are.component';
import { AboutUsComponent } from './about-nira.component';
import { BoardOfDirectorsComponent } from './board-of-directors/board-of-directors.component';
import { TopManagementComponent } from './top-management/top-management.component';
import { ChairmanzMessageComponent } from './chairmanz-message/chairmanz-message.component';
import { EdzMessageComponent } from './edz-message/edz-message.component';
import { DepartmentFinanceComponent } from './department-finance/department-finance.component';
import { DepartmentLegalComponent } from './department-legal/department-legal.component';
import { DepartmentIctComponent } from './department-ict/department-ict.component';
import { DepartmentHrComponent } from './department-hr/department-hr.component';
import { DepartmentOperationsAndRegistrationsComponent } from './department-operations-and-registrations/department-operations-and-registrations.component';

const routes: Routes = [
  {
    path: '',
    component: AboutUsComponent,
    children: [
      {
        path: '',
        redirectTo: 'who-we-are',
        pathMatch: 'full',
      },
      {
        path: 'who-we-are',
        component: WhoWeAreComponent
      },
      {
        path: 'board-of-directors',
        component: BoardOfDirectorsComponent
      },
      {
        path: 'chairmanz-message-board-of-directors',
        component: ChairmanzMessageComponent
      },   
      {
        path: 'edz-message',
        component: EdzMessageComponent
      },   
      {
        path: 'edz-message/:slug',
        component: EdzMessageComponent
      },   
      {
        path: 'top-management-team',
        component: TopManagementComponent
      },
      {
        path: 'department-of-finance',
        component: DepartmentFinanceComponent
      },   
      {
        path: 'department-of-legal',
        component: DepartmentLegalComponent
      },   
      {
        path: 'department-of-ict',
        component: DepartmentIctComponent
      },   
      {
        path: 'department-of-hr',
        component: DepartmentHrComponent
      },   
      {
        path: 'department-of-operations-and-registrations',
        component: DepartmentOperationsAndRegistrationsComponent
      },   
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutNIRARoutingModule { }
