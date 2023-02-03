import { NgModule } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from 'src/app/modules/material.module';
import { SharedModule } from 'src/app/modules/shared-module.module';
import { PhotosRoutingModule } from './photos-routing.module';

import { PhotosComponent } from './photos.component';

@NgModule({
    declarations: [
        PhotosComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        PhotosRoutingModule,
        HttpClientModule
    ],
    entryComponents: [ ],
    providers: [
        DatePipe
    ]
})
export class PhotosPageModule { }
