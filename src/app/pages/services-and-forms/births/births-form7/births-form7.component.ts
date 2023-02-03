import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-births-form7',
  templateUrl: './births-form7.component.html',
  styleUrls: ['./births-form7.component.scss']
})
export class BirthsForm7Component implements OnInit {

  title = "Form 7";
  subTitle = "Application to change Name of a Child";
  loading = true;
  processing = false;
  isLinear = false;
  maxDate = new Date();

  formParent: FormGroup;
  formPreviousName: FormGroup;
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

    this.formPreviousName = this.formBuilder.group({
      PreviousSurname: new FormControl(),
      PreviousGivenName: new FormControl(),
      PreviousOtherName: new FormControl(),
      ChildDateOfBirth: new FormControl(),
    });

    this.formNewName = this.formBuilder.group({
      NewSurname: new FormControl(),
      NewGivenName: new FormControl(),
      NewOtherName: new FormControl(),
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
