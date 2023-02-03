import { NgModule } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
import { QRCodeModule } from 'angularx-qrcode';
import { RecaptchaModule } from 'ng-recaptcha';

import { MaterialModule } from 'src/app/modules/material.module';
import { SharedModule } from 'src/app/modules/shared-module.module';
import { HomePageRoutingModule } from './home-page-routing.module';

import { HomePageComponent } from './home-page.component';
import { CarouselComponent } from './carousel/carousel.component';
import { KeyServicesComponent } from './key-services/key-services.component';
import { TendersComponent } from './tenders/tenders.component';
import { TwitterComponent } from './twitter/twitter.component';
import { MissionVisionValuesComponent } from './mission-vision-values/mission-vision-values.component';
import { ServiceBlockComponent } from './key-services/service-block/service-block.component';
import { TrackStatusDialogComponent } from 'src/app/dialogs/key-services/track-status-dialog/track-status-dialog.component';
import { ConfirmationOfInformationDialogComponent } from 'src/app/dialogs/key-services/confirmation-of-information-dialog/confirmation-of-information-dialog.component';
import { VerifyNiraDocumentsDialogComponent } from 'src/app/dialogs/key-services/verify-nira-documents-dialog/verify-nira-documents-dialog.component';
import { PrintNinSlipDialogComponent } from 'src/app/dialogs/key-services/print-nin-slip-dialog/print-nin-slip-dialog.component';

@NgModule({
    declarations: [
        HomePageComponent,
        CarouselComponent,
        KeyServicesComponent,
        TendersComponent,
        TwitterComponent,
        MissionVisionValuesComponent,
        ServiceBlockComponent,
        TrackStatusDialogComponent,
        ConfirmationOfInformationDialogComponent,
        VerifyNiraDocumentsDialogComponent,
        PrintNinSlipDialogComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        HomePageRoutingModule,
        SlickCarouselModule,
        HttpClientModule,
        NgxTwitterTimelineModule,
        QRCodeModule,
        RecaptchaModule
    ],
    entryComponents: [
        TrackStatusDialogComponent,
        ConfirmationOfInformationDialogComponent,
        VerifyNiraDocumentsDialogComponent,
        PrintNinSlipDialogComponent,
    ],
    providers: [
        DatePipe
    ]
})
export class HomePageModule { }
