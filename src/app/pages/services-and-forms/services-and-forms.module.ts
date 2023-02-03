import { NgModule } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {
    NgxMatDatetimePickerModule, 
    NgxMatNativeDateModule, 
    NgxMatTimepickerModule 
} from '@angular-material-components/datetime-picker';

import { MaterialModule } from 'src/app/modules/material.module';
import { SharedModule } from 'src/app/modules/shared-module.module';
import { ServicesAndFormsRoutingModule } from './services-and-forms-routing.module';

import { ServicesAndFormsComponent } from './services-and-forms.component';
import { RopForm2Component } from './registration-of-persons/rop-form2/rop-form2.component';
import { BirthsForm8Component } from './births/births-form8/births-form8.component';
import { DeathsForm16Component } from './deaths/deaths-form16/deaths-form16.component';
import { RopForm3Component } from './registration-of-persons/rop-form3/rop-form3.component';
import { RopForm3SpouseDetailsDialogComponent } from 'src/app/dialogs/rop-form3-spouse-details-dialog/rop-form3-spouse-details-dialog.component';
import { RopForm3ChildDetailsDialogComponent } from 'src/app/dialogs/rop-form3-child-details-dialog/rop-form3-child-details-dialog.component';

@NgModule({
    declarations: [
        ServicesAndFormsComponent,
        RopForm2Component,
        RopForm3Component,
        BirthsForm8Component,
        DeathsForm16Component,
        RopForm3SpouseDetailsDialogComponent,
        RopForm3ChildDetailsDialogComponent,  
    ],
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ServicesAndFormsRoutingModule,
        HttpClientModule,
        NgxMatDatetimePickerModule, 
        NgxMatNativeDateModule, 
        NgxMatTimepickerModule
    ],
    entryComponents: [
        RopForm3SpouseDetailsDialogComponent,
        RopForm3ChildDetailsDialogComponent,        
    ],
    providers: [
        DatePipe
    ]
})
export class ServicesAndFormsPageModule { }
