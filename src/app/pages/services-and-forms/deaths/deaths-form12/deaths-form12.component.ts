import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiPayload, CauseOfDeath, Country, County, District, HealthFacility, Occupation, Parish, SubCounty, Village } from 'src/app/services/api.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-deaths-form12',
  templateUrl: './deaths-form12.component.html',
  styleUrls: ['./deaths-form12.component.scss']
})
export class DeathsForm12Component implements OnInit {

  title = "Form 12";
  subTitle = "Notification of Death.";
  loading = true;
  processing = false;
  isLinear = true;
  selectedIndex = 0;
  // public maxDate: moment.Moment;
  maxDate = new Date();
  touchUi = false;
  color: ThemePalette = "primary";
  showDetialsAboutFinder = true;
  showWhereTheIncidentTookPlace = false;
  httpSubscription: Subscription;
  lateRegistration = false;

  Countries: Country[] = []; 
  Counties: County[] = [];
  Districts: District[] = [];
  SubCounties: SubCounty[] = [];
  Parishes: Parish[] = [];
  Villages: Village[] = [];
  Occupations: Occupation[] = [];
  healthFacilities: HealthFacility[] = [];
  CausesOfDeath: CauseOfDeath[] = [];
  
  /* Notifier */
  filteredNotifierNationality: Observable<Country[]>;
  filteredNotifierDistrict: Observable<District[]>;
  filteredNotifierCounty: Observable<County[]>;
  filteredNotifierSubCounty: Observable<SubCounty[]>;
  filteredNotifierParish: Observable<Parish[]>;
  filteredNotifierVillage: Observable<Village[]>;  
  
  /* Deceased */
  filteredDeceasedNationality: Observable<Country[]>;
  filteredDeceasedOccupations: Observable<Occupation[]>;

  /* Incident */
  filteredDistrictOfIncident: Observable<District[]>;
  filteredCountyOfIncident: Observable<County[]>;
  filteredSubCountyOfIncident: Observable<SubCounty[]>;
  filteredParishOfIncident: Observable<Parish[]>;
  filteredVillageOfIncident: Observable<Village[]>;    
  filteredIncidentHealthFacility: Observable<HealthFacility[]>;
  filteredCausesOfDeath: Observable<CauseOfDeath[]>;  

  /* Declaration */
  filteredDeclarationOccupation: Observable<Occupation[]>;  

  /* Witness */
  filteredWitnessNationality: Observable<Country[]>;
  filteredWitnessDistrictOfResidence: Observable<District[]>;
  filteredWitnessCountyOfResidence: Observable<County[]>;
  filteredWitnessSubCountyOfResidence: Observable<SubCounty[]>;  
  filteredWitnessParishOfResidence: Observable<Parish[]>;
  filteredWitnessVillageOfResidence: Observable<Village[]>;   

  NotifierNationalityID = 0;
  NotifierDistrictID = 0;
  NotifierCountyID = 0;
  NotifierSubCountyID = 0;
  NotifierParishID = 0;
  NotifierVillageID = 0;
  DeceasedNationalityID = 0;
  DeceasedOccupationID = 0;
  IncidentDistrictID = 0;
  IncidentCountyID = 0;
  IncidentSubCountyID = 0;
  IncidentParishID = 0;
  IncidentVillageID = 0;  
  DeclarationOccupatioID = 0;
  DeclarationHealthFacilityID = 0;
  CauseOfDeathID = 0;
  WitnessNationalityID = 0;
  WitnessDistrictOfResidenceID = 0;
  WitnessCountyOfResidenceID = 0;
  WitnessSubCountyOfResidenceID = 0; 
  WitnessParishOfResidenceID = 0;
  WitnessVillageOfResidenceID = 0; 

  formNotifier: FormGroup;
  formPart1: FormGroup;
  formPart2: FormGroup;
  formPart3: FormGroup;
  formDeclaration: FormGroup;
  DraftReferenceNumber = new FormControl();

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {
    this.service.updatePageTitle(this.title + '-' + this.subTitle);    
  }

  ngOnInit(): void {
    this.formNotifier = this.formBuilder.group({
      NotifierDeclarationCapacity: new FormControl('', [Validators.required]),
      NotifierNationality: new FormControl('', [Validators.required]),
      NotifierNIN: new FormControl('', [
        Validators.maxLength(14),
        Validators.minLength(14),
        // Validators.pattern(/^(C|R|N|P)(M|F|X)[0-9a-zA-Z]{12}$/)
        Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(M|F|X)[0-9a-zA-Z]{12}$/)
      ]),
      NotifierAID: new FormControl(),
      NotifierTypeOfID: new FormControl('', [Validators.required]),
      NotifierIDNumber: new FormControl(),
      NotifierPhoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(20),     
        Validators.pattern(/^[0-9]{3}[ ]{1}[0-9]{3}[ ]{1}[0-9]{3}$/) 
      ]),
      NotifierEmailAddress: new FormControl('', [
        Validators.email
      ]),
      NotifierDistrictOfResidence: new FormControl(),
      NotifierCountyOfResidence: new FormControl(),
      NotifierSubCountyOfResidence: new FormControl(),
      NotifierParishOfResidence: new FormControl(),
      NotifierVillageOfResidence: new FormControl(),       
    });

    this.formPart1 = this.formBuilder.group({
      DeceasedNationality: new FormControl('', [Validators.required]),
      DeceasedTypeOfID: new FormControl('', [Validators.required]),
      DeceasedNIN: new FormControl(),
      DeceasedAID: new FormControl(),
      DeceasedIDNumber: new FormControl(),      
      DeceasedOccupation: new FormControl(),
    });

    this.formPart3 = this.formBuilder.group({   
      DateTimeOfDeath: new FormControl('', [Validators.required]),
      DeathMedicallyCertified: new FormControl('No'),
      CauseOfDeath: new FormControl(),
      Narration: new FormControl(),
      DistrictOfIncident: new FormControl('', [Validators.required]),
      CountyOfIncident: new FormControl('', [Validators.required]),
      SubCountyOfIncident: new FormControl('', [Validators.required]),
      ParishOfIncident: new FormControl('', [Validators.required]),         
      VillageOfIncident: new FormControl('', [Validators.required]),
      HealthFacility: new FormControl(),  
    }); 

    this.formDeclaration = this.formBuilder.group({   
      DeclarationCheckbox: new FormControl('', [Validators.required]),
      DeclarationReasonForLateRegistration: new FormControl(),
      DeclarationMeanOfKowning: new FormControl(''),
      WitnessNationality: new FormControl('', [Validators.required]),
      WitnessNIN: new FormControl('', [
        Validators.maxLength(14),
        Validators.minLength(14),
        // Validators.pattern(/^(C|R|N|P)(M|F|X)[0-9a-zA-Z]{12}$/)    
        Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(M|F|X)[0-9a-zA-Z]{12}$/)
      ]),  
      WitnessAIN: new FormControl(),
      WitnessTypeOfID: new FormControl('', [Validators.required]),
      WitnessIDNumber: new FormControl(),
      WitnessDistrictOfResidence: new FormControl(),
      WitnessCountyOfResidence: new FormControl(),
      WitnessSubCountyOfResidence: new FormControl(),
      WitnessParishOfResidence: new FormControl(),
      WitnessVillageOfResidence: new FormControl(),          
    }); 

    this.httpSubscription = this.fetchMultiple()
    .pipe(catchError(this.service.handleError))
    .subscribe((responseList) => {
      // console.log('responseList:', responseList);

      this.Countries = responseList[0].data;  
      this.Districts = responseList[1].data; 
      this.Occupations = responseList[2].data;
      this.CausesOfDeath = responseList[3].data;

      // Listeners
      this.NotifierFormListeners();
      this.FormListeners();
     
      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });     
    
    this._listenToValueChanges();
  }

  private _listenToValueChanges(): void {
    this.formNotifier.get('NotifierDeclarationCapacity').valueChanges.subscribe((value) => {
      if (value === '1' || value === '2') {
        this.formDeclaration.get('DeclarationMeanOfKowning').clearValidators(); 
      } else {
        this.formDeclaration.get('DeclarationMeanOfKowning').setValidators([Validators.required]);
      }

      this.formDeclaration.controls['DeclarationMeanOfKowning'].updateValueAndValidity();
    });    

    this.formNotifier.get('NotifierNationality').valueChanges.subscribe((value) => {
      if (value === 'Ugandan') {
        this.formNotifier.get('NotifierDistrictOfResidence').clearValidators();
        this.formNotifier.get('NotifierCountyOfResidence').clearValidators();
        this.formNotifier.get('NotifierSubCountyOfResidence').clearValidators();
        this.formNotifier.get('NotifierParishOfResidence').clearValidators();
        this.formNotifier.get('NotifierVillageOfResidence').clearValidators();  
            
        this.formNotifier.get('NotifierIDNumber').clearValidators();

        this.formNotifier.get('NotifierDistrictOfResidence').reset();
        this.formNotifier.get('NotifierCountyOfResidence').reset();
        this.formNotifier.get('NotifierSubCountyOfResidence').reset();
        this.formNotifier.get('NotifierParishOfResidence').reset();
        this.formNotifier.get('NotifierVillageOfResidence').reset();
        this.formNotifier.get('NotifierIDNumber').reset();
      } else {
        this.formNotifier.get('NotifierDistrictOfResidence').setValidators([Validators.required]);
        this.formNotifier.get('NotifierCountyOfResidence').setValidators([Validators.required]);
        this.formNotifier.get('NotifierSubCountyOfResidence').setValidators([Validators.required]);
        this.formNotifier.get('NotifierParishOfResidence').setValidators([Validators.required]);
        this.formNotifier.get('NotifierVillageOfResidence').setValidators([Validators.required]);
       
        this.formNotifier.get('NotifierIDNumber').setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15) 
        ]);        
      }

      this.formNotifier.controls['NotifierDistrictOfResidence'].updateValueAndValidity();
      this.formNotifier.controls['NotifierCountyOfResidence'].updateValueAndValidity();
      this.formNotifier.controls['NotifierSubCountyOfResidence'].updateValueAndValidity();
      this.formNotifier.controls['NotifierParishOfResidence'].updateValueAndValidity();
      this.formNotifier.controls['NotifierVillageOfResidence'].updateValueAndValidity();

      this.formNotifier.controls['NotifierIDNumber'].updateValueAndValidity();
    });    

    this.formNotifier.get('NotifierTypeOfID').valueChanges.subscribe((value) => {

      if (this.formNotifier.get('NotifierNationality').value === 'Ugandan') {
      
        if (value === '1') {  
  
          this.formNotifier.get('NotifierNIN').setValidators([
            Validators.required,
            Validators.maxLength(14),
            Validators.minLength(14),
            // Validators.pattern(/^(C|R|N|P)(M|F|X)[0-9a-zA-Z]{12}$/)
            Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(M|F|X)[0-9a-zA-Z]{12}$/)
          ]);       
  
          this.formNotifier.get('NotifierAID').clearValidators();
          this.formNotifier.get('NotifierAID').reset();
        } else {
  
          this.formNotifier.get('NotifierAID').setValidators([
            Validators.required,
            Validators.maxLength(13),
            Validators.minLength(13),
          ]);    
  
          this.formNotifier.get('NotifierNIN').clearValidators();
          this.formNotifier.get('NotifierNIN').reset();
  
        }

      }      

      this.formNotifier.controls['NotifierNIN'].updateValueAndValidity();
      this.formNotifier.controls['NotifierAID'].updateValueAndValidity();
    });    

    this.formPart1.get('DeceasedNationality').valueChanges.subscribe((value) => {
      if (value === 'Ugandan') {
           
        this.formPart1.get('DeceasedIDNumber').clearValidators();
        this.formPart1.get('DeceasedIDNumber').reset();

      } else {

        this.formPart1.get('DeceasedIDNumber').setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15) 
        ]);
        
      }

      this.formPart1.controls['DeceasedIDNumber'].updateValueAndValidity();
    });    

    this.formPart1.get('DeceasedTypeOfID').valueChanges.subscribe((value) => {

      if (this.formPart1.get('DeceasedNationality').value === 'Ugandan') {

        if (value === '1') {  

          this.formPart1.get('DeceasedNIN').setValidators([
            Validators.required,
            Validators.maxLength(14),
            Validators.minLength(14),
            // Validators.pattern(/^(C|R|N|P)(M|F|X)[0-9a-zA-Z]{12}$/)
            Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(M|F|X)[0-9a-zA-Z]{12}$/)
          ]);       
  
          this.formPart1.get('DeceasedAID').clearValidators();
          this.formPart1.get('DeceasedAID').reset();
        } else {
  
          this.formPart1.get('DeceasedAID').setValidators([
            Validators.required,
            Validators.maxLength(13),
            Validators.minLength(13),
          ]);    
  
          this.formPart1.get('DeceasedNIN').clearValidators();
          this.formPart1.get('DeceasedNIN').reset();
  
        }

      }

      this.formPart1.controls['DeceasedNIN'].updateValueAndValidity();
      this.formPart1.controls['DeceasedAID'].updateValueAndValidity();
    }); 

    this.formPart3.get('DateTimeOfDeath').valueChanges.subscribe((value) => {
      this.lateRegistration = this.service.getNumberOfDays(new Date(value)) >= 90 ? true : false;      

      if (this.lateRegistration) {
        this.formDeclaration.get('DeclarationReasonForLateRegistration').setValidators([Validators.required]);
      } else {
        this.formDeclaration.get('DeclarationReasonForLateRegistration').clearValidators(); 
        this.formDeclaration.get('DeclarationReasonForLateRegistration').reset();
      }

      this.formDeclaration.controls['DeclarationReasonForLateRegistration'].updateValueAndValidity();
    });    

    this.formPart3.get('DeathMedicallyCertified').valueChanges.subscribe((value) => {
      
      if (value === 'Yes') {
        this.formPart3.get('CauseOfDeath').setValidators([Validators.required]);
      } else {
        this.formPart3.get('CauseOfDeath').clearValidators(); 
        this.formPart3.get('CauseOfDeath').reset();
      }

      this.formPart3.controls['CauseOfDeath'].updateValueAndValidity();
    });    

    this.formDeclaration.get('WitnessNationality').valueChanges.subscribe((value) => {
      if (value === 'Ugandan') {
        this.formDeclaration.get('WitnessDistrictOfResidence').clearValidators();
        this.formDeclaration.get('WitnessCountyOfResidence').clearValidators();
        this.formDeclaration.get('WitnessSubCountyOfResidence').clearValidators();
        this.formDeclaration.get('WitnessParishOfResidence').clearValidators();
        this.formDeclaration.get('WitnessVillageOfResidence').clearValidators();  

        this.formDeclaration.get('WitnessIDNumber').clearValidators();          
      } else {
        this.formDeclaration.get('WitnessDistrictOfResidence').setValidators([Validators.required]);
        this.formDeclaration.get('WitnessCountyOfResidence').setValidators([Validators.required]);
        this.formDeclaration.get('WitnessSubCountyOfResidence').setValidators([Validators.required]);
        this.formDeclaration.get('WitnessParishOfResidence').setValidators([Validators.required]);
        this.formDeclaration.get('WitnessVillageOfResidence').setValidators([Validators.required]);

        this.formDeclaration.get('WitnessIDNumber').setValidators([
          Validators.required,
          Validators.maxLength(15)
        ]);          
      }

      this.formDeclaration.controls['WitnessDistrictOfResidence'].updateValueAndValidity();
      this.formDeclaration.controls['WitnessCountyOfResidence'].updateValueAndValidity();
      this.formDeclaration.controls['WitnessSubCountyOfResidence'].updateValueAndValidity();
      this.formDeclaration.controls['WitnessParishOfResidence'].updateValueAndValidity();
      this.formDeclaration.controls['WitnessVillageOfResidence'].updateValueAndValidity();

      this.formDeclaration.controls['WitnessIDNumber'].updateValueAndValidity();            
    }); 
    
    this.formDeclaration.get('WitnessTypeOfID').valueChanges.subscribe((value) => {

      if (this.formDeclaration.get('WitnessNationality').value === 'Ugandan') {

        if (value === '1') {  

          this.formDeclaration.get('WitnessNIN').setValidators([
            Validators.required,
            Validators.maxLength(14),
            Validators.minLength(14),
            // Validators.pattern(/^(C|R|N|P)(M|F|X)[0-9a-zA-Z]{12}$/)
            Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(M|F|X)[0-9a-zA-Z]{12}$/)
          ]);       
  
          this.formDeclaration.get('WitnessAIN').clearValidators();
          this.formDeclaration.get('WitnessAIN').reset();
        } else {
  
          this.formDeclaration.get('WitnessAIN').setValidators([
            Validators.required,
            Validators.maxLength(13),
            Validators.minLength(13),
          ]);    
  
          this.formDeclaration.get('WitnessNIN').clearValidators();
          this.formDeclaration.get('WitnessNIN').reset();
  
        }

      }

      this.formDeclaration.controls['WitnessNIN'].updateValueAndValidity();
      this.formDeclaration.controls['WitnessAIN'].updateValueAndValidity();
    });     
  }

  private NotifierFormListeners(): void {
    this.filteredNotifierNationality = this.formNotifier.get('NotifierNationality').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterCountry(value, this.Countries))
    );  

    this.filteredNotifierDistrict = this.formNotifier.get('NotifierDistrictOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterDistrict(value, this.Districts))
    ); 
  }

  private FormListeners(): void {
    this.filteredDeceasedNationality = this.formPart1.get('DeceasedNationality').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterCountry(value, this.Countries))
    );    

    this.filteredDeceasedOccupations = this.formPart1.get('DeceasedOccupation').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterOccupation(value, this.Occupations))
    );      

    this.filteredIncidentHealthFacility = this.formPart3.get('HealthFacility').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterHealthFacility(value, this.healthFacilities))
    );  

    this.filteredDistrictOfIncident = this.formPart3.get('DistrictOfIncident').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterDistrict(value, this.Districts))
    );       

    this.filteredWitnessNationality = this.formDeclaration.get('WitnessNationality').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterCountry(value, this.Countries))
    );       

    this.filteredWitnessDistrictOfResidence = this.formDeclaration.get('WitnessDistrictOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterDistrict(value, this.Districts))
    );       

    this.filteredCausesOfDeath = this.formPart3.get('CauseOfDeath').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterCauseOfDeath(value, this.CausesOfDeath))
    );       
  }

  private fetchMultiple(): Observable<any[]> {
    this.processing = true;
    this.service.processingBar.next(this.processing);

    const reqCountry = this.http.get(this.endpoints.ref_data_country);
    const reqDistrict = this.http.get(this.endpoints.ref_data_district);
    const reqOccupation = this.http.get(this.endpoints.ref_data_occupation);
    const reqCausesOfDeath = this.http.get(this.endpoints.ref_data_causes_of_death);

    return forkJoin([reqCountry, reqDistrict, reqOccupation, reqCausesOfDeath]);
  }

  onNotifierDistrictOfResidence(DistrictID: number): void {
    this.formNotifier.get('NotifierCountyOfResidence').reset();

    this.onFetchCounties(DistrictID, 'NotifierCountyOfResidence');
  }     

  onDistrictOfIncident(DistrictID: number): void {
    this.formPart3.get('CountyOfIncident').reset();

    this.onFetchHealthFacilities(DistrictID);

    this.onFetchCounties(DistrictID, 'CountyOfIncident');
  }     

  onWitnessDistrictOfResidence(DistrictID: number): void {
    this.formDeclaration.get('WitnessCountyOfResidence').reset();

    this.onFetchCounties(DistrictID, 'WitnessCountyOfResidence');
  }     

  private onFetchCounties(DistrictID: number, field: string):void {
    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.ref_data_county + '?DistrictID=' + DistrictID)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.Counties = response.data;

      if (field === 'NotifierCountyOfResidence') {
        this.filteredNotifierCounty = this.formNotifier.get('NotifierCountyOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterCounty(value, this.Counties))
        );        
      } else if (field === 'CountyOfIncident') {
        this.filteredCountyOfIncident = this.formPart3.get('CountyOfIncident').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterCounty(value, this.Counties))
        );     
      } else if (field === 'WitnessCountyOfResidence') {
        this.filteredWitnessCountyOfResidence = this.formDeclaration.get('WitnessCountyOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterCounty(value, this.Counties))
        );     
      }

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    }); 
  }

  onWitnessCountyOfResidence(CountyID: number): void {
    this.formDeclaration.get('WitnessSubCountyOfResidence').reset();

    this.onFetchSubCounties(CountyID, 'WitnessSubCountyOfResidence');
  }  

  onCountyOfIncident(CountyID: number): void {
    this.formPart3.get('SubCountyOfIncident').reset();

    this.onFetchSubCounties(CountyID, 'SubCountyOfIncident');
  }     

  onNotifierCountyOfResidence(CountyID: number): void {
    this.formNotifier.get('NotifierSubCountyOfResidence').reset();

    this.onFetchSubCounties(CountyID, 'NotifierSubCountyOfResidence');
  }     

  private onFetchSubCounties(CountyID: number, field: string):void {
    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.ref_data_sub_county + '?CountyID=' + CountyID)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.SubCounties = response.data;

      if (field === 'WitnessSubCountyOfResidence') {
        this.filteredWitnessSubCountyOfResidence = this.formDeclaration.get('WitnessSubCountyOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterSubCounty(value, this.SubCounties))
        );     
      } else if (field === 'SubCountyOfIncident') {
        this.filteredSubCountyOfIncident = this.formPart3.get('SubCountyOfIncident').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterSubCounty(value, this.SubCounties))
        );     
      } else if (field === 'NotifierSubCountyOfResidence') {
        this.filteredNotifierSubCounty = this.formNotifier.get('NotifierSubCountyOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterSubCounty(value, this.SubCounties))
        );     
      }

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    }); 
  }

  onNotifierSubCountyOfResidence(SubCountyID: number): void {
    this.formNotifier.get('NotifierParishOfResidence').reset();

    this.onFetchParishes(SubCountyID, 'NotifierParishOfResidence');
  }      
  
  onSubCountyOfIncident(SubCountyID: number): void {
    this.formPart3.get('ParishOfIncident').reset();

    this.onFetchParishes(SubCountyID, 'ParishOfIncident');
  }    
  
  onWitnessSubCountyOfResidence(SubCountyID: number): void {
    this.formDeclaration.get('WitnessParishOfResidence').reset();

    this.onFetchParishes(SubCountyID, 'WitnessParishOfResidence');
  }    
  
  private onFetchParishes(SubCountyID: number, field: string):void {
    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.ref_data_parish + '?SubCountyID=' + SubCountyID)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.Parishes = response.data;

      if (field === 'NotifierParishOfResidence') {
        this.filteredNotifierParish = this.formNotifier.get('NotifierParishOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterParish(value, this.Parishes))
        );        
      } else if (field === 'ParishOfIncident') {
        this.filteredParishOfIncident = this.formPart3.get('ParishOfIncident').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterParish(value, this.Parishes))
        );     
      } else if (field === 'WitnessParishOfResidence') {
        this.filteredWitnessParishOfResidence = this.formDeclaration.get('WitnessParishOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterParish(value, this.Parishes))
        );     
      }

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    }); 
  }
  
  onNotifierParishOfResidence(ParishID: number): void {
    this.formNotifier.get('NotifierVillageOfResidence').reset();

    this.onFetchVillages(ParishID, 'NotifierVillageOfResidence');
  }      

  onParishOfIncident(ParishID: number): void {
    this.formPart3.get('VillageOfIncident').reset();

    this.onFetchVillages(ParishID, 'VillageOfIncident');
  }     

  onWitnessParishOfResidence(ParishID: number): void {
    this.formDeclaration.get('WitnessVillageOfResidence').reset();

    this.onFetchVillages(ParishID, 'WitnessVillageOfResidence');
  }     
  
  private onFetchVillages(ParishID: number, field: string):void {
    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.ref_data_village + '?ParishID=' + ParishID)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.Villages = response.data;

      if (field === 'NotifierVillageOfResidence') {
        this.filteredNotifierVillage = this.formNotifier.get('NotifierVillageOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterVillage(value, this.Villages))
        );        
      } else if (field === 'VillageOfIncident') {
        this.filteredVillageOfIncident = this.formPart3.get('VillageOfIncident').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterVillage(value, this.Villages))
        );     
      } else if (field === 'WitnessVillageOfResidence') {
        this.filteredWitnessVillageOfResidence = this.formDeclaration.get('WitnessVillageOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterVillage(value, this.Villages))
        );     
      }

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    }); 
  }  

  private onFetchHealthFacilities(DistrictID: number):void {
    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.ref_data_health_facility + '?DistrictID=' + DistrictID)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      this.healthFacilities = response.data;

      this.filteredIncidentHealthFacility = this.formPart3.get('HealthFacility').valueChanges
      .pipe(
        startWith(''),
        map(value => this.service._filterHealthFacility(value, this.healthFacilities))
      );  

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    }); 
  }  

  getTelephoneNumberErrorMessage() {
    return this.formNotifier.get('NotifierPhoneNumber').hasError('required') ? 'Please enter your phone number' :
    this.formNotifier.get('NotifierPhoneNumber').hasError('minlength')
    || this.formNotifier.get('NotifierPhoneNumber').hasError('maxlength')
    || this.formNotifier.get('NotifierPhoneNumber').hasError('pattern') ? 'Not a valid mobile number' : '';
  }

  getEmailErrorMessage() {
    return this.formNotifier.get('NotifierEmailAddress').hasError('email') 
    ? 'Not a valid email address.' : '';
  }

  getNINErrorMessage() {
    return this.formNotifier.get('NotifierNIN').hasError('required') 
    || this.formPart1.get('DeceasedNIN').hasError('required') 
    ? 'Please enter a value' :
    this.formNotifier.get('NotifierNIN').hasError('maxlength')
    || this.formNotifier.get('NotifierNIN').hasError('minlength') 
    || this.formNotifier.get('NotifierNIN').hasError('pattern')     
    || this.formPart1.get('DeceasedNIN').hasError('minlength') 
    || this.formPart1.get('DeceasedNIN').hasError('maxlength')
    || this.formPart1.get('DeceasedNIN').hasError('pattern')
    || this.formDeclaration.get('WitnessNIN').hasError('minlength') 
    || this.formDeclaration.get('WitnessNIN').hasError('maxlength')
    || this.formDeclaration.get('WitnessNIN').hasError('pattern')
    ? 'Not a Valid NIN' : '';
  }  

  getAIDErrorMessage() {
    return this.formNotifier.get('NotifierAID').hasError('required')
    || this.formPart1.get('DeceasedAID').hasError('required')
    ? 'Please enter a value' :
    this.formNotifier.get('NotifierAID').hasError('maxlength')
    || this.formNotifier.get('NotifierAID').hasError('minlength')   
    || this.formPart1.get('DeceasedAID').hasError('minlength') 
    || this.formPart1.get('DeceasedAID').hasError('maxlength')
    || this.formDeclaration.get('WitnessNIN').hasError('minlength') 
    || this.formDeclaration.get('WitnessNIN').hasError('maxlength')
    ? 'Not a Valid Application ID Number' : '';
  }  

  getIDNumberErrorMessage() {
    return this.formNotifier.get('NotifierIDNumber').hasError('required') 
    || this.formPart1.get('DeceasedIDNumber').hasError('required') 
    || this.formDeclaration.get('WitnessIDNumber').hasError('required')
    ? 'Please enter a value' :
    this.formNotifier.get('NotifierIDNumber').hasError('maxlength')
    || this.formNotifier.get('NotifierIDNumber').hasError('minlength') 
    || this.formPart1.get('DeceasedIDNumber').hasError('maxlength')
    || this.formPart1.get('DeceasedIDNumber').hasError('minlength') 
    
    || this.formDeclaration.get('WitnessIDNumber').hasError('minlength') 
    || this.formDeclaration.get('WitnessIDNumber').hasError('maxlength') 
    ? 'Not a valid.' : '';
  }

  getSelectErrorMessage() {
    return this.formNotifier.get('NotifierDeclarationCapacity').hasError('required') 
    || this.formNotifier.get('NotifierNationality').hasError('required') 
    || this.formNotifier.get('NotifierTypeOfID').hasError('required')
    || this.formNotifier.get('NotifierDistrictOfResidence').hasError('required') 
    || this.formNotifier.get('NotifierCountyOfResidence').hasError('required') 
    || this.formNotifier.get('NotifierSubCountyOfResidence').hasError('required') 
    || this.formNotifier.get('NotifierParishOfResidence').hasError('required') 
    || this.formNotifier.get('NotifierVillageOfResidence').hasError('required') 
    
    || this.formPart1.get('DeceasedNationality').hasError('required') 
    || this.formPart1.get('DeceasedTypeOfID').hasError('required') 

    || this.formPart3.get('CauseOfDeath').hasError('required') 
    || this.formPart3.get('DistrictOfIncident').hasError('required') 
    || this.formPart3.get('CountyOfIncident').hasError('required') 
    || this.formPart3.get('SubCountyOfIncident').hasError('required') 
    || this.formPart3.get('ParishOfIncident').hasError('required') 
    || this.formPart3.get('VillageOfIncident').hasError('required')
    
    || this.formDeclaration.get('WitnessTypeOfID').hasError('required') 
    || this.formDeclaration.get('WitnessDistrictOfResidence').hasError('required') 
    || this.formDeclaration.get('WitnessCountyOfResidence').hasError('required') 
    || this.formDeclaration.get('WitnessSubCountyOfResidence').hasError('required') 
    || this.formDeclaration.get('WitnessParishOfResidence').hasError('required') 
    || this.formDeclaration.get('WitnessVillageOfResidence').hasError('required')
    ? 'Please choose one.' : '';
  }


  // onGetSavedDraft(): void {
  //   console.log('retrieve the saved draft');
  // }

  private getFormData(): any {
    
    const data = {
      NotifierDeclarationCapacity: this.formNotifier.get('NotifierDeclarationCapacity').value,
      NotifierNationality: this.NotifierNationalityID,
      NotifierNIN: this.formNotifier.get('NotifierNIN').value ? this.formNotifier.get('NotifierNIN').value : 'empty',
      NotifierAID: this.formNotifier.get('NotifierAID').value ? this.formNotifier.get('NotifierAID').value : 'empty',
      NotifierTypeOfID: parseInt(this.formNotifier.get('NotifierTypeOfID').value),
      NotifierIDNumber: this.formNotifier.get('NotifierIDNumber').value ? this.formNotifier.get('NotifierIDNumber').value : 'empty',
      NotifierPhoneNumber: this.formNotifier.get('NotifierPhoneNumber').value,
      NotifierEmailAddress: this.formNotifier.get('NotifierEmailAddress').value ? this.formNotifier.get('NotifierEmailAddress').value : 'empty',
      NotifierDistrictOfResidence: this.formNotifier.get('NotifierDistrictOfResidence').value ? this.NotifierDistrictID : 0,
      NotifierCountyOfResidence: this.formNotifier.get('NotifierCountyOfResidence').value ? this.NotifierCountyID : 0,
      NotifierSubCountyOfResidence: this.formNotifier.get('NotifierSubCountyOfResidence').value ? this.NotifierSubCountyID : 0,
      NotifierParishOfResidence: this.formNotifier.get('NotifierParishOfResidence').value ? this.NotifierParishID : 0,
      NotifierVillageOfResidence: this.formNotifier.get('NotifierVillageOfResidence').value ? this.NotifierVillageID : 0,
      DeceasedNationality: this.DeceasedNationalityID,
      DeceasedTypeOfID: parseInt(this.formPart1.get('DeceasedTypeOfID').value),
      DeceasedNIN: this.formPart1.get('DeceasedNIN').value ? this.formPart1.get('DeceasedNIN').value : 'empty',
      DeceasedAID: this.formPart1.get('DeceasedAID').value ? this.formPart1.get('DeceasedAID').value : 'empty',
      DeceasedIDNumber: this.formPart1.get('DeceasedIDNumber').value ? this.formPart1.get('DeceasedIDNumber').value : 'empty',
      DeceasedOccupation: this.formPart1.get('DeceasedOccupation').value ? this.formPart1.get('DeceasedOccupation').value : 'empty',
      DateTimeOfDeath: this.formPart3.get('DateTimeOfDeath').value,
      DeathMedicallyCertified: this.formPart3.get('DeathMedicallyCertified').value ? this.formPart3.get('DeathMedicallyCertified').value : 'empty',
      CauseOfDeath: this.formPart3.get('CauseOfDeath').value ? this.formPart3.get('CauseOfDeath').value : 'empty',
      Narration: this.formPart3.get('Narration').value ? this.formPart3.get('Narration').value : 'empty',
      DistrictOfIncident: this.formPart3.get('DistrictOfIncident').value ? this.IncidentDistrictID : 0,
      CountyOfIncident: this.formPart3.get('CountyOfIncident').value ? this.IncidentCountyID : 0,
      SubCountyOfIncident: this.formPart3.get('SubCountyOfIncident').value ? this.IncidentSubCountyID : 0,
      ParishOfIncident: this.formPart3.get('ParishOfIncident').value ? this.IncidentParishID : 0,
      VillageOfIncident: this.formPart3.get('VillageOfIncident').value ? this.IncidentVillageID : 0,
      HealthFacility: this.formPart3.get('HealthFacility').value ? this.DeclarationHealthFacilityID : 0,
      DeclarationCheckbox: this.formDeclaration.get('DeclarationCheckbox').value,
      ReasonForLateRegistration: this.formDeclaration.get('DeclarationReasonForLateRegistration').value ? this.formDeclaration.get('DeclarationReasonForLateRegistration').value : 'empty',
      DeclarationMeanOfKowning: this.formDeclaration.get('DeclarationMeanOfKowning').value ? this.formDeclaration.get('DeclarationMeanOfKowning').value : 'empty',
      WitnessNationality: this.WitnessNationalityID,
      WitnessNIN: this.formDeclaration.get('WitnessNIN').value ? this.formDeclaration.get('WitnessNIN').value : 'empty',
      WitnessAIN: this.formDeclaration.get('WitnessAIN').value ? this.formDeclaration.get('WitnessAIN').value : 'empty',
      WitnessTypeOfID: parseInt(this.formDeclaration.get('WitnessTypeOfID').value),      
      WitnessIDNumber: this.formDeclaration.get('WitnessIDNumber').value ? this.formDeclaration.get('WitnessIDNumber').value : 'empty',
      WitnessDistrictOfResidence: this.formDeclaration.get('WitnessDistrictOfResidence').value ? this.WitnessDistrictOfResidenceID : 0,
      WitnessCountyOfResidence: this.formDeclaration.get('WitnessCountyOfResidence').value ? this.WitnessCountyOfResidenceID : 0,
      WitnessSubCountyOfResidence: this.formDeclaration.get('WitnessSubCountyOfResidence').value ? this.WitnessSubCountyOfResidenceID : 0,
      WitnessParishOfResidence: this.formDeclaration.get('WitnessParishOfResidence').value ? this.WitnessParishOfResidenceID : 0,
      WitnessVillageOfResidence: this.formDeclaration.get('WitnessVillageOfResidence').value ? this.WitnessVillageOfResidenceID : 0
    }

    return data;
  }      

  // onSaveDraft(): void {
  //   console.log('save the draft');
    
  //   this.processing = true;
  //   setTimeout(() => {
  //     this.processing = false
  //   }, 2000);
  // }

  onSubmit(): void {
    this.processing = true;

    this.formNotifier.disable();
    this.formPart1.disable();
    this.formPart3.disable();
    this.formDeclaration.disable();

    this.httpSubscription = this.http.post<ApiPayload>(this.endpoints.form_12_death, this.getFormData())
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      
      this.service.openSnackBar(response.message, 'success-lg');

      this.formNotifier.enable();
      this.formNotifier.reset();
      this.formPart1.enable();
      this.formPart1.reset();
      this.formPart3.enable();
      this.formPart3.reset();
      this.formDeclaration.enable();  
      this.formDeclaration.reset();  

      this.selectedIndex = 0;
      this.changeDetector.detectChanges();
      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.formNotifier.enable();
      this.formPart1.enable();
      this.formPart3.enable();
      this.formDeclaration.enable();        
      this.service.determineErrorResponse(error);
    }); 
  }

  ngOnDestroy(): void {
    // this.service.processingBar.next(false);

    // if (this.bottomsheetRef) { this.bottomsheetRef.dismiss(); }
    // if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }  
}
