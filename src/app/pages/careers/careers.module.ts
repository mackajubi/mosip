import { NgModule } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from 'src/app/modules/material.module';
import { SharedModule } from 'src/app/modules/shared-module.module';
import { FeesRoutingModule } from './careers-routing.module';

import { CareersComponent } from './careers.component';

@NgModule({
    declarations: [
        CareersComponent
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
export class CareersPageModule { }
