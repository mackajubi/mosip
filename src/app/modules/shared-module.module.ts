import { NgModule } from '@angular/core';

import { MaterialModule } from './material.module';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { ResourceSanitizerPipe } from '../pipes/resource-sanitizer.pipe';
import { TextShortnerPipe } from '../pipes/text-shortner.pipe';
import { TelephoneFormaterDirective } from '../directives/telephone-formater.directive';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { PageCarouselComponent } from '../components/page-carousel/page-carousel.component';
import { PdfReaderComponent } from '../components/pdf-reader/pdf-reader.component';
import { PageBannerComponent } from '../components/page-banner/page-banner.component';
import { CurrencyDirective } from '../directives/currency.directive';
import { LowercaseDirective } from '../directives/lowercase.directive';
import { RemoveSpacesDirective } from '../directives/remove-spaces.directive';
import { NumbersOnlyDirective } from '../directives/numbers-only.directive';
import { InlineMatSpinnerComponent } from '../components/inline-mat-spinner/inline-mat-spinner.component';
import { AutoMoveToNextInputDirective } from '../directives/autoMoveToNextInput';
import { UppercaseDirective } from '../directives/uppercase.directive';
import { UploadDocumentDialogComponent } from '../dialogs/upload-document-dialog/upload-document-dialog.component';
import { AnouncementDialogComponent } from '../dialogs/anouncement-dialog/anouncement-dialog.component';
import { BirthSongDialogComponent } from '../dialogs/key-services/birth-song-dialog/birth-song-dialog.component';

@NgModule({
    declarations: [
        SnackbarComponent,
        ResourceSanitizerPipe,
        TextShortnerPipe,
        TelephoneFormaterDirective,
        PageCarouselComponent,
        PdfReaderComponent,
        PageBannerComponent,
        CurrencyDirective,
        LowercaseDirective,
        UppercaseDirective,
        RemoveSpacesDirective,
        InlineMatSpinnerComponent,
        AutoMoveToNextInputDirective,
        NumbersOnlyDirective,
        UploadDocumentDialogComponent,
        AnouncementDialogComponent,
        BirthSongDialogComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        PdfViewerModule,
        SlickCarouselModule,
    ],
    exports: [
        ResourceSanitizerPipe,
        TextShortnerPipe,
        TelephoneFormaterDirective,
        PageCarouselComponent,
        PdfReaderComponent,
        PageBannerComponent,
        CurrencyDirective,
        LowercaseDirective,
        UppercaseDirective,
        RemoveSpacesDirective,   
        NumbersOnlyDirective,
        InlineMatSpinnerComponent,     
        AutoMoveToNextInputDirective,
        AnouncementDialogComponent,
        BirthSongDialogComponent,
    ],
    entryComponents: [
        SnackbarComponent,
        UploadDocumentDialogComponent
    ],
    providers: [
        ResourceSanitizerPipe,
        CurrencyPipe,
    ]
})
export class SharedModule {}
