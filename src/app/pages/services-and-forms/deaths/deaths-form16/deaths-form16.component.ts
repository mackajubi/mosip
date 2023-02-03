import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-deaths-form16',
  templateUrl: './deaths-form16.component.html',
  styleUrls: ['./deaths-form16.component.scss']
})
export class DeathsForm16Component implements OnInit {

  title = "Form 16";
  subTitle = "Application to Inspect Register Obtain a Copy of Entry In Register";
  loading = true;
  processing = false;
  isLinear = false;
  maxDate = new Date();

  formCertification: FormGroup;
  formChildOrDeceased: FormGroup;
  formResidence: FormGroup;

  DraftReferenceNumber = new FormControl();

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder,
  ) {
    this.service.updatePageTitle(this.title + '-' + this.subTitle);    
  }

  ngOnInit(): void {
    this.formCertification = this.formBuilder.group({
      TypeOfCertification: new FormControl()
    });

    this.formChildOrDeceased = this.formBuilder.group({
      ChildOrDeceasedSurname: new FormControl(),
      ChildOrDeceasedGivenName: new FormControl(),
      ChildOrDeceasedOtherName: new FormControl(),
      DateOfBirthOrDeath: new FormControl(),
      ChildOrDeceasedNIN: new FormControl(),
      ChildOrDeceasedCardNumber: new FormControl(),       
    }); 

    this.formResidence = this.formBuilder.group({
      DistrictOfResidence: new FormControl(),
      CountyOfResidence: new FormControl(),
      SubCountyOfResidence: new FormControl(),
      ParishOfResidence: new FormControl(),
      VillageOfResidence: new FormControl(),      
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
