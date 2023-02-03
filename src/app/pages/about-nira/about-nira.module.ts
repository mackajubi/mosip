import { NgModule } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from 'src/app/modules/material.module';
import { SharedModule } from 'src/app/modules/shared-module.module';
import { AboutNIRARoutingModule } from './about-nira-routing.module';

import { WhoWeAreComponent } from './who-we-are/who-we-are.component';
import { AboutUsComponent } from './about-nira.component';
import { ChairmanzMessageComponent } from './chairmanz-message/chairmanz-message.component';
import { EdzMessageComponent } from './edz-message/edz-message.component';
import { TopManagementComponent } from './top-management/top-management.component';
import { BoardOfDirectorsComponent } from './board-of-directors/board-of-directors.component';
import { DepartmentFinanceComponent } from './department-finance/department-finance.component';
import { DepartmentLegalComponent } from './department-legal/department-legal.component';
import { DepartmentIctComponent } from './department-ict/department-ict.component';
import { DepartmentHrComponent } from './department-hr/department-hr.component';
import { DepartmentOperationsAndRegistrationsComponent } from './department-operations-and-registrations/department-operations-and-registrations.component';

@NgModule({
    declarations: [
        WhoWeAreComponent,
        AboutUsComponent,
        ChairmanzMessageComponent,
        EdzMessageComponent,
        TopManagementComponent,
        BoardOfDirectorsComponent,
        DepartmentFinanceComponent,
        DepartmentLegalComponent,
        DepartmentIctComponent,
        DepartmentHrComponent,
        DepartmentOperationsAndRegistrationsComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        AboutNIRARoutingModule,
        HttpClientModule
    ],
    entryComponents: [ ],
    providers: [
        DatePipe
    ]
})
export class AboutNIRAPageModule { }
