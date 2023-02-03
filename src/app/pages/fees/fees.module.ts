import { NgModule } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from 'src/app/modules/material.module';
import { SharedModule } from 'src/app/modules/shared-module.module';
import { FeesRoutingModule } from './fees-routing.module';

import { FeesComponent } from './fees.component';

@NgModule({
    declarations: [
        FeesComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        FeesRoutingModule,
        HttpClientModule
    ],
    entryComponents: [ ],
    providers: [
        DatePipe
    ]
})
export class FeesPageModule { }
