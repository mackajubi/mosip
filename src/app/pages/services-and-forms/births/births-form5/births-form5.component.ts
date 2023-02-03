import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-births-form5',
  templateUrl: './births-form5.component.html',
  styleUrls: ['./births-form5.component.scss']
})
export class BirthsForm5Component implements OnInit {

  title = "Form 5";
  subTitle = "Notice of Intention of Change of Name of Adult";
  loading = true;
  processing = false;
  isLinear = false;

  formPreviousName: FormGroup;
  formNIN: FormGroup;
  formNewName: FormGroup;
  DraftReferenceNumber = new FormControl();

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder,
  ) {
    this.service.updatePageTitle(this.title + '-' + this.subTitle);    
  }

  ngOnInit(): void {
    this.formNIN = this.formBuilder.group({
      NIN: new FormControl(),
      CardNumber: new FormControl(),
    });

    this.formPreviousName = this.formBuilder.group({
      PreviousSurname: new FormControl(),
      PreviousGivenName: new FormControl(),
      PreviousOtherName: new FormControl(),
    });

    this.formNewName = this.formBuilder.group({
      NewSurname: new FormControl(),
      NewGivenName: new FormControl(),
      NewOtherName: new FormControl(),
    });
  }

  onGetSavedDraft(): void {
    console.log('retrieve the saved draft');
  }

  onSaveDraft(): void {
    console.log('save the draft');
    
    this.processing = true;
    setTimeout(() => {
      this.processing = false
    }, 2000);
  }

  onSubmit(): void {
    console.log('save the draft');
    
    this.processing = true;
    setTimeout(() => {
      this.processing = false
    }, 2000);
  }

  ngOnDestroy(): void {
    // this.service.processingBar.next(false);
    // if (this.bottomsheetRef) { this.bottomsheetRef.dismiss(); }
    // if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }  
}
