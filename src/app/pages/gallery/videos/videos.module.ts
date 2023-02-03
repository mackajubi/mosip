import { NgModule } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from 'src/app/modules/material.module';
import { SharedModule } from 'src/app/modules/shared-module.module';
import { VideosRoutingModule } from './videos-routing.module';

import { VideosComponent } from './videos.component';

@NgModule({
    declarations: [
        VideosComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        VideosRoutingModule,
        HttpClientModule
    ],
    entryComponents: [ ],
    providers: [
        DatePipe
    ]
})
export class VideosPageModule { }
