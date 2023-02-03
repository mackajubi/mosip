import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-deaths-form13',
  templateUrl: './deaths-form13.component.html',
  styleUrls: ['./deaths-form13.component.scss']
})
export class DeathsForm13Component implements OnInit {

  title = "Form 13";
  subTitle = "Certificate of cause of Death";
  loading = true;
  processing = false;
  isLinear = false;
  maxDate = new Date();

  formMedicalOfficer: FormGroup;
  formHospital: FormGroup;
  formDeceased: FormGroup;
  formCauseOfDeath: FormGroup;

  DraftReferenceNumber = new FormControl();

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder,
  ) {
    this.service.updatePageTitle(this.title + '-' + this.subTitle);    
  }

  ngOnInit(): void {
    this.formMedicalOfficer = this.formBuilder.group({
      MedicalOfficerSurname: new FormControl(),
      MedicalOfficerGivenName: new FormControl(),
      MedicalOfficerOtherName: new FormControl(),
      MedicalOfficerNIN: new FormControl(),
      MedicalOfficerCardNumber: new FormControl(),
      MedicalOfficerHospital: new FormControl(),
    });

    this.formHospital = this.formBuilder.group({
      HospitalDistrictOfLocation: new FormControl(),
      HospitalCountyOfLocation: new FormControl(),
      HospitalSubCountyOfLocation: new FormControl(),
      HospitalParishOfLocation: new FormControl(),
      HospitalVillageOfLocation: new FormControl(),      
    }); 

    this.formDeceased = this.formBuilder.group({
      DeceasedSurname: new FormControl(),
      DeceasedGivenName: new FormControl(),
      DeceasedOtherName: new FormControl(),
      DeceasedNIN: new FormControl(),
      DeceasedCardNumber: new FormControl(),     
      StartDate: new FormControl(),     
      DateOfDeath: new FormControl(),     
    });     

    this.formCauseOfDeath = this.formBuilder.group({
      CauseOfDeath: new FormControl(),    
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
