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
import { PageBannerComponent } from '../components/page-banner/page-banner.component';
import { CurrencyDirective } from '../directives/currency.directive';
import { LowercaseDirective } from '../directives/lowercase.directive';
import { RemoveSpacesDirective } from '../directives/remove-spaces.directive';
import { NumbersOnlyDirective } from '../directives/numbers-only.directive';
import { InlineMatSpinnerComponent } from '../components/inline-mat-spinner/inline-mat-spinner.component';
import { AutoMoveToNextInputDirective } from '../directives/autoMoveToNextInput';
import { UppercaseDirective } from '../directives/uppercase.directive';

@NgModule({
    declarations: [
        SnackbarComponent,
        ResourceSanitizerPipe,
        TextShortnerPipe,
        TelephoneFormaterDirective,
        PageBannerComponent,
        CurrencyDirective,
        LowercaseDirective,
        UppercaseDirective,
        RemoveSpacesDirective,
        InlineMatSpinnerComponent,
        AutoMoveToNextInputDirective,
        NumbersOnlyDirective,
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
        PageBannerComponent,
        CurrencyDirective,
        LowercaseDirective,
        UppercaseDirective,
        RemoveSpacesDirective,   
        NumbersOnlyDirective,
        InlineMatSpinnerComponent,     
        AutoMoveToNextInputDirective,
    ],
    entryComponents: [
        SnackbarComponent,
    ],
    providers: [
        ResourceSanitizerPipe,
        CurrencyPipe,
    ]
})
export class SharedModule {}
