import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-deaths-form11',
  templateUrl: './deaths-form11.component.html',
  styleUrls: ['./deaths-form11.component.scss']
})
export class DeathsForm11Component implements OnInit {

  title = "Form 11";
  subTitle = "Application to register presumed death";
  loading = true;
  processing = false;
  isLinear = false;
  public maxDate: moment.Moment;
  touchUi = false;
  color: ThemePalette = "primary";
  showDetialsAboutFinder = false;
  showWhereTheIncidentTookPlace = false;

  formParent: FormGroup;
  formDeceased: FormGroup;
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

    this.formDeceased = this.formBuilder.group({
      DeceasedSurname: new FormControl(),
      DeceasedGivenName: new FormControl(),
      DeceasedOtherName: new FormControl(),
      DeceasedDateOfBirth: new FormControl(),
      DeceasedNIN: new FormControl(),
      DeceasedCardNumber: new FormControl(),
      RelationshipWithTheDeceased: new FormControl(),        
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
