import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-births-form8',
  templateUrl: './births-form8.component.html',
  styleUrls: ['./births-form8.component.scss']
})
export class BirthsForm8Component implements OnInit {

  title = "Form 8";
  subTitle = "Application to update register after operation of Hermaphrodite";
  loading = true;
  processing = false;
  isLinear = false;
  maxDate = new Date();

  formParent: FormGroup;
  formPrevious: FormGroup;
  formNewName: FormGroup;
  formWitness: FormGroup;
  
  DraftReferenceNumber = new FormControl();

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder,
  ) {
    this.service.updatePageTitle(this.title + '-' + this.subTitle);    
  }

  ngOnInit(): void {
    this.formParent = this.formBuilder.group({
      ParentSurname: new FormControl(),
      ParentGivenName: new FormControl(),
      ParentOtherName: new FormControl(),
      ParentNIN: new FormControl(),
      ParentCardNumber: new FormControl(),
      ParentCountryOfResidence: new FormControl(),
      ParentDistrictOfResidence: new FormControl(),
      ParentCountyOfResidence: new FormControl(),
      ParentSubCountyOfResidence: new FormControl(),
      ParentParishOfResidence: new FormControl(),
      ParentVillageOfResidence: new FormControl(),       
    });

    this.formPrevious = this.formBuilder.group({
      PreviousSurname: new FormControl(),
      PreviousGivenName: new FormControl(),
      PreviousOtherName: new FormControl(),
      PreviousSex: new FormControl(),
      PreviousDateOfBirth: new FormControl(),
      PreviousNIN: new FormControl(),
      PreviousCardNumber: new FormControl(),
    });

    this.formNewName = this.formBuilder.group({
      NewSurname: new FormControl(),
      NewGivenName: new FormControl(),
      NewOtherName: new FormControl(),
      NewSex: new FormControl({value: '', disabled: true}),
    });

    this.formWitness = this.formBuilder.group({
      WitnessSurname: new FormControl(),
      WitnessGivenName: new FormControl(),
      WitnessOtherName: new FormControl(),
      WitnessNIN: new FormControl(),
      WitnessCardNumber: new FormControl(),
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
