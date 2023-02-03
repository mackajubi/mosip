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
import { RopForm1Component } from './registration-of-persons/rop-form1/rop-form1.component';
import { RopForm11Component } from './registration-of-persons/rop-form11/rop-form11.component';
import { BirthsForm3Component } from './births/births-form3/births-form3.component';
import { BirthsForm6Component } from './births/births-form6/births-form6.component';
import { BirthsForm7Component } from './births/births-form7/births-form7.component';
import { BirthsForm8Component } from './births/births-form8/births-form8.component';
import { DeathsForm11Component } from './deaths/deaths-form11/deaths-form11.component';
import { DeathsForm12Component } from './deaths/deaths-form12/deaths-form12.component';
import { DeathsForm13Component } from './deaths/deaths-form13/deaths-form13.component';
import { DeathsForm15Component } from './deaths/deaths-form15/deaths-form15.component';
import { DeathsForm16Component } from './deaths/deaths-form16/deaths-form16.component';
import { RopForm3Component } from './registration-of-persons/rop-form3/rop-form3.component';
import { BirthsForm5Component } from './births/births-form5/births-form5.component';
import { RopFormXComponent } from './registration-of-persons/rop-form-x/rop-form-x.component';

@NgModule({
    declarations: [
        ServicesAndFormsComponent,
        RopForm1Component,
        RopForm2Component,
        RopForm3Component,
        RopForm11Component,
        BirthsForm3Component,
        BirthsForm6Component,
        BirthsForm7Component,
        BirthsForm8Component,
        DeathsForm11Component,
        DeathsForm12Component,
        DeathsForm13Component,
        DeathsForm15Component,
        DeathsForm16Component,
        BirthsForm5Component,
        RopFormXComponent,
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
    ],
    providers: [
        DatePipe
    ]
})
export class ServicesAndFormsPageModule { }
