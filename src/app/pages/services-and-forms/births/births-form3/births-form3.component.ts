import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiPayload, Country, County, District, HealthFacility, Occupation, Parish, SubCounty, Village } from 'src/app/services/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BirthNotificationRecord } from '../../services-and-forms.model';

@Component({
  selector: 'app-births-form3',
  templateUrl: './births-form3.component.html',
  styleUrls: ['./births-form3.component.scss']
})
export class BirthsForm3Component implements OnInit, OnDestroy {

  title = "Form 3";
  subTitle = "Notice of Birth of a Child.";
  loading = true;
  processing = false;
  processingSection = null;
  isLinear = true;
  selectedIndex = 0;
  // public maxDate: moment.Moment;
  maxDate = new Date();
  touchUi = false;
  color: ThemePalette = "primary";
  httpSubscription: Subscription;
  lateRegistration = false;
  dialogRef;

  Countries: Country[] = []; 
  Counties: County[] = [];
  Districts: District[] = [];
  SubCounties: SubCounty[] = [];
  Parishes: Parish[] = [];
  Villages: Village[] = [];
  healthFacilities: HealthFacility[] = [];
  Occupations: Occupation[] = [];
  NotificationLetter: BirthNotificationRecord | null;

  /* Notifier */
  filteredNotifierOccupation: Observable<Occupation[]>;  
  filteredNotifierNationality: Observable<Country[]>;
  filteredNotifierDistrict: Observable<District[]>;
  filteredNotifierCounty: Observable<County[]>;
  filteredNotifierSubCounty: Observable<SubCounty[]>;
  filteredNotifierParish: Observable<Parish[]>;
  filteredNotifierVillage: Observable<Village[]>;

  /* Child */
  filteredChildDistrict: Observable<District[]>;
  filteredChildCounty: Observable<County[]>;
  filteredChildSubCounty: Observable<SubCounty[]>;
  filteredChildParish: Observable<Parish[]>;
  filteredChildVillage: Observable<Village[]>;  
  filteredChildHealthFacility: Observable<HealthFacility[]>;
  
  /* Mother */
  filteredMotherNationality: Observable<Country[]>;
  filteredMotherCountryOfResidence: Observable<Country[]>;
  filteredMotherDistrictOfResidence: Observable<District[]>;
  filteredMotherCountyOfResidence: Observable<County[]>;
  filteredMotherSubCountyOfResidence: Observable<SubCounty[]>;
  filteredMotherParish: Observable<Parish[]>;
  filteredMotherVillage: Observable<Village[]>;    
  filteredMotherOccupation: Observable<Occupation[]>;
  
  /* Father */
  filteredFatherNationality: Observable<Country[]>;
  filteredFatherCountryOfResidence: Observable<Country[]>;
  filteredFatherDistrictOfResidence: Observable<District[]>;
  filteredFatherCountyOfResidence: Observable<County[]>;
  filteredFatherSubCountyOfResidence: Observable<SubCounty[]>;
  filteredFatherParish: Observable<Parish[]>;
  filteredFatherVillage: Observable<Village[]>; 
  filteredFatherOccupation: Observable<Occupation[]>;
  
  /* Witness */
  filteredWitnessNationality: Observable<Country[]>;
  filteredWitnessDistrictOfResidence: Observable<District[]>;
  filteredWitnessCountyOfResidence: Observable<County[]>;
  filteredWitnessSubCountyOfResidence: Observable<SubCounty[]>;  
  filteredWitnessParishOfResidence: Observable<Parish[]>;
  filteredWitnessVillageOfResidence: Observable<Village[]>; 

  NotifierOccupationID = 0;
  NotifierNationalityID = 0;
  NotifierDistrictID = 0;
  NotifierCountyID = 0;
  NotifierSubCountyID = 0;
  NotifierParishID = 0;
  NotifierVillageID = 0;
  ChildDistrictID = 0;
  ChildCountyID = 0;
  ChildSubCountyID = 0;
  ChildParishID = 0;
  ChildVillageID = 0;
  ChildHealthFacilityID = 0;
  MotherzNationalityID = 0;
  MotherzCountryOfResidenceID = 0;
  MotherzDistrictOfResidenceID = 0;
  MotherzCountyOfResidenceID = 0;
  MotherzSubCountyOfResidenceID = 0;
  MotherzParishOfResidenceID = 0;
  MotherzVillageOfResidenceID = 0;
  MotherzOccupationID = 0;
  FatherzNationalityID = 0;
  FatherzCountryOfResidenceID = 0;
  FatherzDistrictOfResidenceID = 0;
  FatherzCountyOfResidenceID = 0;
  FatherzSubCountyOfResidenceID = 0;
  FatherzParishOfResidenceID = 0;
  FatherzVillageOfResidenceID = 0;
  FatherzOccupationID = 0;
  DeclarantDistrictOfResidenceDistrictID = 0;
  DeclarantCountyOfResidenceCountyID = 0;
  DeclarantSubCountyOfResidenceSubCountyID = 0;  
  WitnessNationalityID = 0;
  WitnessDistrictOfResidenceID = 0;
  WitnessCountyOfResidenceID = 0;
  WitnessSubCountyOfResidenceID = 0; 
  WitnessParishOfResidenceID = 0;
  WitnessVillageOfResidenceID = 0; 
  
  formNotifier: FormGroup;
  formChild: FormGroup;
  formFather: FormGroup;
  formMother: FormGroup;
  formDeclaration: FormGroup;
  // DraftReferenceNumber = new FormControl('DRN3-4QJDMHKGRC');
  DraftReferenceNumber = new FormControl();

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder,
    private endpoints: ApiEndpointsService,
    private datePipe: DatePipe,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
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
      NotifierIDNumber: new FormControl('', [Validators.maxLength(15)]),
      NotifierOccupation: new FormControl('', [Validators.required]),
      NotifierPhoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(20),     
        Validators.pattern(/^[0-9]{3}[ ]{1}[0-9]{3}[ ]{1}[0-9]{3}$/) 
      ]),
      NotifierEmailAddress: new FormControl('', [Validators.email]),
      NotifierDistrictOfResidence: new FormControl(),
      NotifierCountyOfResidence: new FormControl(),
      NotifierSubCountyOfResidence: new FormControl(),
      NotifierParishOfResidence: new FormControl(),
      NotifierVillageOfResidence: new FormControl(),    
    });

    this.formChild = this.formBuilder.group({
      SurnameOfChild: new FormControl('', [Validators.required]),
      GivenNameOfChild: new FormControl(''),
      OtherNameOfChild: new FormControl(''),
      DatetimeOfBirth: new FormControl('', [Validators.required]),
      SexOfChild: new FormControl('', [Validators.required]),
      WeightOfChild: new FormControl('', [
        Validators.required,
        Validators.maxLength(8)
      ]),
      MotherzParity: new FormControl('', [Validators.required]),
      GaveBirthFromHealthFacility: new FormControl(''),
      District: new FormControl('', [Validators.required]),
      County: new FormControl('', [Validators.required]),
      Municipality: new FormControl('', [Validators.required]),
      Parish: new FormControl('', [Validators.required]),
      Village: new FormControl('', [Validators.required]),
      HealthFacility: new FormControl(''),
    });

    this.formMother = this.formBuilder.group({
      MothersLivingStatus: new FormControl('Alive', [Validators.required]),   
      MotherzNationality: new FormControl('', [Validators.required]),
      MotherzNIN: new FormControl('', [
        Validators.maxLength(14),
        Validators.minLength(14),
        // Validators.pattern(/^(CF)[0-9a-zA-Z]{12}$/)
        Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(F|X)[0-9a-zA-Z]{12}$/)
      ]),
      MotherzAIN: new FormControl(),
      MotherzTypeOfID: new FormControl('', [Validators.required]),        
      MotherzIDNumber: new FormControl('', [Validators.maxLength(15)]),                
      MotherzOccupation: new FormControl('', [Validators.required]), 
      MotherzPhoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(20),     
        Validators.pattern(/^[0-9]{3}[ ]{1}[0-9]{3}[ ]{1}[0-9]{3}$/) 
      ]),      
      MotherzEmailAddress: new FormControl('', [Validators.email]),        
      MotherzCountryOfResidence: new FormControl(),
      MotherzDistrictOfResidence: new FormControl(),
      MotherzCountyOfResidence: new FormControl(),
      MotherzSubCountyOfResidence: new FormControl(),
      MotherzParishOfResidence: new FormControl(),
      MotherzVillageOfResidence: new FormControl(),
    }); 

    this.formFather = this.formBuilder.group({   
      FatherIsKnown: new FormControl('Yes', [Validators.required]),          
      FathersLivingStatus: new FormControl('Alive'),         
      FatherzNationality: new FormControl(),
      FatherzNIN: new FormControl('', [
        Validators.maxLength(14),
        Validators.minLength(14),
        Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(M|X)[0-9a-zA-Z]{12}$/)
      ]),
      FatherzAIN: new FormControl(),
      FatherzTypeOfID: new FormControl(),         
      FatherzIDNumber: new FormControl(),                  
      FatherzOccupation: new FormControl('', [Validators.required]),    
      FatherzPhoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(20),     
        Validators.pattern(/^[0-9]{3}[ ]{1}[0-9]{3}[ ]{1}[0-9]{3}$/) 
      ]),
      FatherzEmailAddress: new FormControl('', [Validators.email]),
      FatherzCountryOfResidence: new FormControl(),
      FatherzDistrictOfResidence: new FormControl(),
      FatherzCountyOfResidence: new FormControl(),
      FatherzSubCountyOfResidence: new FormControl(),
      FatherzParishOfResidence: new FormControl(),
      FatherzVillageOfResidence: new FormControl(),            
    });

    this.formDeclaration = this.formBuilder.group({   
      DeclarationCheckbox: new FormControl('', [Validators.required]),
      DeclarationLateRegistration: new FormControl(),  
      DeclarationMeanOfKowning: new FormControl(),
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

      // Listeners
      this.NotifierFormListeners();
      this.ChildFormListeners();
      this.MotherFormListeners();
      this.FatherFormListeners();
      this.DeclarantFormListeners();
     
      this.processing = false;
      this.service.processingBar.next(this.processing);
    }, (error) => {
      this.processing = false;
      this.service.processingBar.next(this.processing);
      this.service.determineErrorResponse(error);
    });    
    
    this._listenToValueChanges();
  }

  private _listenToValueChanges(): void {
    this.formNotifier.get('NotifierDeclarationCapacity').valueChanges.subscribe((value) => {
      if (value === '1' || value === '2') {
        this.formDeclaration.get('DeclarationMeanOfKowning').clearValidators(); 
        this.formDeclaration.get('DeclarationMeanOfKowning').reset();
      } else {
        this.formDeclaration.get('DeclarationMeanOfKowning').setValidators([Validators.required]);
      }

      this.formDeclaration.controls['DeclarationMeanOfKowning'].updateValueAndValidity();
    });    

    this.formChild.get('DatetimeOfBirth').valueChanges.subscribe((value) => {
      this.lateRegistration = this.service.getNumberOfDays(new Date(value)) >= 90 ? true : false;      

      if (this.lateRegistration) {
        this.formDeclaration.get('DeclarationLateRegistration').setValidators([Validators.required]);
      } else {
        this.formDeclaration.get('DeclarationLateRegistration').clearValidators(); 
        this.formDeclaration.get('DeclarationLateRegistration').reset();
      }

      this.formDeclaration.controls['DeclarationLateRegistration'].updateValueAndValidity();
    });    

    this.formChild.get('GaveBirthFromHealthFacility').valueChanges.subscribe((value) => {
      if (value && this.formChild.get('Municipality').value) {
        this.onFetchHealthFacilities(this.ChildDistrictID);
      }      
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

      if (value === '1' && this.NotifierNationalityID === 259) {  
        this.formNotifier.get('NotifierNIN').setValidators([
          Validators.required,
          Validators.maxLength(14),
          Validators.minLength(14),
          // Validators.pattern(/^(C|R|N|P)(M|F|X)[0-9a-zA-Z]{12}$/)
          Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(M|F|X)[0-9a-zA-Z]{12}$/)
        ]);       

        this.formNotifier.get('NotifierAID').clearValidators();
        this.formNotifier.get('NotifierAID').reset();
      } else if (this.NotifierNationalityID === 259) { 
        this.formNotifier.get('NotifierAID').setValidators([
          Validators.required,
          Validators.maxLength(13),
          Validators.minLength(13),
        ]);    

        this.formNotifier.get('NotifierNIN').clearValidators();
        this.formNotifier.get('NotifierNIN').reset();
      }

      this.formNotifier.controls['NotifierNIN'].updateValueAndValidity();
      this.formNotifier.controls['NotifierAID'].updateValueAndValidity();
    });  

    this.formMother.get('MotherzNationality').valueChanges.subscribe((value) => {
      
      if (value === 'Ugandan') {
        this.formMother.get('MotherzDistrictOfResidence').clearValidators();
        this.formMother.get('MotherzCountyOfResidence').clearValidators();
        this.formMother.get('MotherzSubCountyOfResidence').clearValidators();
        this.formMother.get('MotherzParishOfResidence').clearValidators();
        this.formMother.get('MotherzVillageOfResidence').clearValidators();  

        this.formMother.get('MotherzIDNumber').clearValidators();

        this.formMother.get('MotherzDistrictOfResidence').reset();
        this.formMother.get('MotherzCountyOfResidence').reset();
        this.formMother.get('MotherzSubCountyOfResidence').reset();
        this.formMother.get('MotherzParishOfResidence').reset();
        this.formMother.get('MotherzVillageOfResidence').reset();
        this.formMother.get('MotherzIDNumber').reset();        
      } else {
        this.formMother.get('MotherzDistrictOfResidence').setValidators([Validators.required]);
        this.formMother.get('MotherzCountyOfResidence').setValidators([Validators.required]);
        this.formMother.get('MotherzSubCountyOfResidence').setValidators([Validators.required]);
        this.formMother.get('MotherzParishOfResidence').setValidators([Validators.required]);
        this.formMother.get('MotherzVillageOfResidence').setValidators([Validators.required]);

        this.formMother.get('MotherzIDNumber').setValidators([
          Validators.required,
          Validators.maxLength(15)
        ]);
      }

      this.formMother.controls['MotherzDistrictOfResidence'].updateValueAndValidity();
      this.formMother.controls['MotherzCountyOfResidence'].updateValueAndValidity();
      this.formMother.controls['MotherzSubCountyOfResidence'].updateValueAndValidity();
      this.formMother.controls['MotherzParishOfResidence'].updateValueAndValidity();
      this.formMother.controls['MotherzVillageOfResidence'].updateValueAndValidity();

      this.formMother.controls['MotherzIDNumber'].updateValueAndValidity();
    });    

    this.formMother.get('MotherzTypeOfID').valueChanges.subscribe((value) => {

      if (value === '1' && this.MotherzNationalityID === 259) {  
        this.formMother.get('MotherzNIN').setValidators([
          Validators.required,
          Validators.maxLength(14),
          Validators.minLength(14),
          Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(F|X)[0-9a-zA-Z]{12}$/)
        ]);       

        this.formMother.get('MotherzAIN').clearValidators();
        this.formMother.get('MotherzAIN').reset();
      } else if (this.MotherzNationalityID === 259) { 
        this.formMother.get('MotherzAIN').setValidators([
          Validators.required,
          Validators.maxLength(13),
          Validators.minLength(13),
        ]);    

        this.formMother.get('MotherzNIN').clearValidators();
        this.formMother.get('MotherzNIN').reset();
      }

      this.formMother.controls['MotherzNIN'].updateValueAndValidity();
      this.formMother.controls['MotherzAIN'].updateValueAndValidity();
    });  

    this.formFather.get('FatherzNationality').valueChanges.subscribe((value) => {
      if (value === 'Ugandan') {
        this.formFather.get('FatherzDistrictOfResidence').clearValidators();
        this.formFather.get('FatherzCountyOfResidence').clearValidators();
        this.formFather.get('FatherzSubCountyOfResidence').clearValidators();
        this.formFather.get('FatherzParishOfResidence').clearValidators();
        this.formFather.get('FatherzVillageOfResidence').clearValidators(); 
        
        this.formFather.get('FatherzIDNumber').clearValidators();  
        
        this.formFather.get('FatherzDistrictOfResidence').reset();
        this.formFather.get('FatherzCountyOfResidence').reset();
        this.formFather.get('FatherzSubCountyOfResidence').reset();
        this.formFather.get('FatherzParishOfResidence').reset();
        this.formFather.get('FatherzVillageOfResidence').reset();
        this.formFather.get('FatherzIDNumber').reset();         
      } else {
        this.formFather.get('FatherzDistrictOfResidence').setValidators([Validators.required]);
        this.formFather.get('FatherzCountyOfResidence').setValidators([Validators.required]);
        this.formFather.get('FatherzSubCountyOfResidence').setValidators([Validators.required]);
        this.formFather.get('FatherzParishOfResidence').setValidators([Validators.required]);
        this.formFather.get('FatherzVillageOfResidence').setValidators([Validators.required]);

        this.formFather.get('FatherzIDNumber').setValidators([
          Validators.required,
          Validators.maxLength(15)
        ]);        
      }

      this.formFather.controls['FatherzDistrictOfResidence'].updateValueAndValidity();
      this.formFather.controls['FatherzCountyOfResidence'].updateValueAndValidity();
      this.formFather.controls['FatherzSubCountyOfResidence'].updateValueAndValidity();
      this.formFather.controls['FatherzParishOfResidence'].updateValueAndValidity();
      this.formFather.controls['FatherzVillageOfResidence'].updateValueAndValidity();

      this.formFather.controls['FatherzIDNumber'].updateValueAndValidity();      
    });    

    this.formDeclaration.get('WitnessNationality').valueChanges.subscribe((value) => {
      if (value === 'Ugandan') {
        this.formDeclaration.get('WitnessDistrictOfResidence').clearValidators();
        this.formDeclaration.get('WitnessCountyOfResidence').clearValidators();
        this.formDeclaration.get('WitnessSubCountyOfResidence').clearValidators();
        this.formDeclaration.get('WitnessParishOfResidence').clearValidators();
        this.formDeclaration.get('WitnessVillageOfResidence').clearValidators();  

        this.formDeclaration.get('WitnessIDNumber').clearValidators();   
        
        this.formDeclaration.get('WitnessDistrictOfResidence').reset();
        this.formDeclaration.get('WitnessCountyOfResidence').reset();
        this.formDeclaration.get('WitnessSubCountyOfResidence').reset();
        this.formDeclaration.get('WitnessParishOfResidence').reset();
        this.formDeclaration.get('WitnessVillageOfResidence').reset();
        this.formDeclaration.get('WitnessIDNumber').reset();           
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
    this.filteredNotifierOccupation = this.formNotifier.get('NotifierOccupation').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterOccupation(value, this.Occupations))
    );  

    this.filteredNotifierNationality = this.formNotifier.get('NotifierNationality').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterCountry(value, this.Countries))
    );  

    this.filteredNotifierDistrict = this.formNotifier.get('NotifierDistrictOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterDistrict(value, this.Districts))
    )
  }

  private ChildFormListeners(): void {
    this.filteredChildDistrict = this.formChild.get('District').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterDistrict(value, this.Districts))
    );     
  }

  private MotherFormListeners(): void {
    this.filteredMotherNationality = this.formMother.get('MotherzNationality').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterCountry(value, this.Countries))
    );

    this.filteredMotherCountryOfResidence = this.formMother.get('MotherzCountryOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterCountry(value, this.Countries))
    );   

    this.filteredMotherDistrictOfResidence = this.formMother.get('MotherzDistrictOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterDistrict(value, this.Districts))
    );   

    this.filteredMotherOccupation = this.formMother.get('MotherzOccupation').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterOccupation(value, this.Occupations))
    );      
  }
  
  private FatherFormListeners(): void {
    this.filteredFatherNationality = this.formFather.get('FatherzNationality').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterCountry(value, this.Countries))
    );   

    this.filteredFatherDistrictOfResidence = this.formFather.get('FatherzDistrictOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterDistrict(value, this.Districts))
    );   

    this.filteredFatherOccupation = this.formFather.get('FatherzOccupation').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterOccupation(value, this.Occupations))
    );    
  }      

  private DeclarantFormListeners(): void {
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

    this.filteredWitnessCountyOfResidence = this.formDeclaration.get('WitnessCountyOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this.service._filterCounty(value, this.Counties))
    );    
  }  

  private fetchMultiple(): Observable<any[]> {
    this.processing = true;
    this.service.processingBar.next(this.processing);

    const reqCountry = this.http.get(this.endpoints.ref_data_country);
    const reqDistrict = this.http.get(this.endpoints.ref_data_district);
    const reqOccupation = this.http.get(this.endpoints.ref_data_occupation);

    return forkJoin([reqCountry, reqDistrict, reqOccupation]);
  }

  onNotifierDistrictOfResidence(DistrictID: number): void {
    this.formNotifier.get('NotifierCountyOfResidence').reset();

    this.onFetchCounties(DistrictID, 'NotifierCountyOfResidence');
  }     

  onChildDistrictOfBirth(DistrictID: number): void {
    this.formChild.get('County').reset();

    if (this.formChild.get('GaveBirthFromHealthFacility').value) {
      this.onFetchHealthFacilities(DistrictID);
    }

    this.onFetchCounties(DistrictID, 'County');
  }     

  onMotherzDistrictOfResidence(DistrictID: number): void {
    this.formMother.get('MotherzCountyOfResidence').reset();

    this.onFetchCounties(DistrictID, 'MotherzCountyOfResidence');
  }     

  onFatherzDistrictOfResidence(DistrictID: number): void {
    this.formFather.get('FatherzCountyOfResidence').reset();

    this.onFetchCounties(DistrictID, 'FatherzCountyOfResidence');
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
      } else if (field === 'County') {
        this.filteredChildCounty = this.formChild.get('County').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterCounty(value, this.Counties))
        );     
      } else if (field === 'MotherzCountyOfResidence') {
        this.filteredMotherCountyOfResidence = this.formMother.get('MotherzCountyOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterCounty(value, this.Counties))
        );     
      } else if (field === 'FatherzCountyOfResidence') {
        this.filteredFatherCountyOfResidence = this.formFather.get('FatherzCountyOfResidence').valueChanges
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

  onNotifierCountyOfResidence(CountyID: number): void {
    this.formNotifier.get('NotifierSubCountyOfResidence').reset();

    this.onFetchSubCounties(CountyID, 'NotifierSubCountyOfResidence');
  }     

  onChildCounty(CountyID: number): void {
    this.formChild.get('Municipality').reset();

    this.onFetchSubCounties(CountyID, 'Municipality');
  }  

  onMotherzCountyOfResidence(CountyID: number): void {
    this.formMother.get('MotherzSubCountyOfResidence').reset();

    this.onFetchSubCounties(CountyID, 'MotherzSubCountyOfResidence');
  }  

  onFatherzCountyOfResidence(CountyID: number): void {
    this.formFather.get('FatherzSubCountyOfResidence').reset();

    this.onFetchSubCounties(CountyID, 'FatherzSubCountyOfResidence');
  }  

  onWitnessCountyOfResidence(CountyID: number): void {
    this.formDeclaration.get('WitnessSubCountyOfResidence').reset();

    this.onFetchSubCounties(CountyID, 'WitnessSubCountyOfResidence');
  }  

  private onFetchSubCounties(CountyID: number, field: string):void {
    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.ref_data_sub_county + '?CountyID=' + CountyID)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.SubCounties = response.data;

      if (field === 'Municipality') {
        this.filteredChildSubCounty = this.formChild.get('Municipality').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterSubCounty(value, this.SubCounties))
        );     
      }else if (field === 'FatherzSubCountyOfResidence') {
        this.filteredFatherSubCountyOfResidence = this.formFather.get('FatherzSubCountyOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterSubCounty(value, this.SubCounties))
        );        
      } else if (field === 'MotherzSubCountyOfResidence') {
        this.filteredMotherSubCountyOfResidence = this.formMother.get('MotherzSubCountyOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterSubCounty(value, this.SubCounties))
        );     
      } else if (field === 'WitnessSubCountyOfResidence') {
        this.filteredWitnessSubCountyOfResidence = this.formDeclaration.get('WitnessSubCountyOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterSubCounty(value, this.SubCounties))
        );     
      }  else if (field === 'NotifierSubCountyOfResidence') {
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

  onChildSubCountyOfBirth(SubCountyID: number): void {
    this.formChild.get('Parish').reset();

    this.onFetchParishes(SubCountyID, 'Parish');
  }     

  onMotherzSubCountyOfResidence(SubCountyID: number): void {
    this.formMother.get('MotherzParishOfResidence').reset();

    this.onFetchParishes(SubCountyID, 'MotherzParishOfResidence');
  }     

  onFatherzSubCountyOfResidence(SubCountyID: number): void {
    this.formFather.get('FatherzParishOfResidence').reset();

    this.onFetchParishes(SubCountyID, 'FatherzParishOfResidence');
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
      } else if (field === 'Parish') {
        this.filteredChildParish = this.formChild.get('Parish').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterParish(value, this.Parishes))
        );     
      } else if (field === 'MotherzParishOfResidence') {
        this.filteredMotherParish = this.formMother.get('MotherzParishOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterParish(value, this.Parishes))
        );     
      } else if (field === 'FatherzParishOfResidence') {
        this.filteredFatherParish = this.formFather.get('FatherzParishOfResidence').valueChanges
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

  onChildParishOfBirth(ParishID: number): void {
    this.formChild.get('Village').reset();

    this.onFetchVillages(ParishID, 'Village');
  }     

  onMotherzParishOfResidence(ParishID: number): void {
    this.formMother.get('MotherzVillageOfResidence').reset();

    this.onFetchVillages(ParishID, 'MotherzVillageOfResidence');
  }     

  onFatherzParishOfResidence(ParishID: number): void {
    this.formFather.get('FatherzVillageOfResidence').reset();

    this.onFetchVillages(ParishID, 'FatherzVillageOfResidence');
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
      } else if (field === 'Village') {
        this.filteredChildVillage = this.formChild.get('Village').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterVillage(value, this.Villages))
        );     
      } else if (field === 'MotherzVillageOfResidence') {
        this.filteredMotherVillage = this.formMother.get('MotherzVillageOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterVillage(value, this.Villages))
        );     
      } else if (field === 'FatherzVillageOfResidence') {
        this.filteredFatherVillage = this.formFather.get('FatherzVillageOfResidence').valueChanges
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

      this.filteredChildHealthFacility = this.formChild.get('HealthFacility').valueChanges
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
  
  getNINErrorMessage() {
    return this.formNotifier.get('NotifierNIN').hasError('required') ? 'Please enter a value' :
    this.formNotifier.get('NotifierNIN').hasError('maxlength')
    || this.formNotifier.get('NotifierNIN').hasError('minlength') 
    || this.formNotifier.get('NotifierNIN').hasError('pattern') 
    || this.formMother.get('MotherzNIN').hasError('minlength') 
    || this.formMother.get('MotherzNIN').hasError('maxlength') 
    || this.formMother.get('MotherzNIN').hasError('pattern') 
    || this.formFather.get('FatherzNIN').hasError('minlength') 
    || this.formFather.get('FatherzNIN').hasError('maxlength')
    || this.formFather.get('FatherzNIN').hasError('pattern')
    || this.formDeclaration.get('WitnessNIN').hasError('minlength') 
    || this.formDeclaration.get('WitnessNIN').hasError('maxlength')
    || this.formDeclaration.get('WitnessNIN').hasError('pattern') ? 'Not a valid NIN' : '';
  }
  
  getIDNumberErrorMessage() {
    return this.formNotifier.get('NotifierIDNumber').hasError('required')
    || this.formDeclaration.get('WitnessIDNumber').hasError('required')
    ? 'Please enter a value' :
    this.formNotifier.get('NotifierIDNumber').hasError('maxlength')
    || this.formNotifier.get('NotifierIDNumber').hasError('minlength') 
    || this.formMother.get('MotherzIDNumber').hasError('required')
    || this.formMother.get('MotherzIDNumber').hasError('minlength') 
    || this.formMother.get('MotherzIDNumber').hasError('maxlength') 
    || this.formFather.get('FatherzIDNumber').hasError('required')
    || this.formFather.get('FatherzIDNumber').hasError('minlength') 
    || this.formFather.get('FatherzIDNumber').hasError('maxlength')
    || this.formDeclaration.get('WitnessIDNumber').hasError('minlength') 
    || this.formDeclaration.get('WitnessIDNumber').hasError('maxlength') 
    ? 'Not a valid NIN' : '';
  }

  getWeightAtBrithErrorMessage() {
    return this.formChild.get('WeightOfChild').hasError('required') ? 'Please enter a value' :
    this.formChild.get('WeightOfChild').hasError('maxlength') ? 'You have reached the maximum' : '';
  }

  getEmailErrorMessage() {
    return this.formNotifier.get('NotifierEmailAddress').hasError('email') 
    || this.formMother.get('MotherzEmailAddress').hasError('email') 
    || this.formFather.get('FatherzEmailAddress').hasError('email') 
    ? 'Not a valid email address.' : '';
  }

  getSelectErrorMessage() {
    return this.formNotifier.get('NotifierDeclarationCapacity').hasError('required') 
    || this.formNotifier.get('NotifierNationality').hasError('required') 
    || this.formNotifier.get('NotifierTypeOfID').hasError('required') 
    || this.formNotifier.get('NotifierOccupation').hasError('required') 
    || this.formNotifier.get('NotifierDistrictOfResidence').hasError('required') 
    || this.formNotifier.get('NotifierCountyOfResidence').hasError('required') 
    || this.formNotifier.get('NotifierSubCountyOfResidence').hasError('required') 
    || this.formNotifier.get('NotifierParishOfResidence').hasError('required') 
    || this.formNotifier.get('NotifierVillageOfResidence').hasError('required') 
    || this.formChild.get('SexOfChild').hasError('required') 
    || this.formChild.get('MotherzParity').hasError('required') 
    || this.formChild.get('District').hasError('required') 
    || this.formChild.get('County').hasError('required') 
    || this.formChild.get('Municipality').hasError('required') 
    || this.formChild.get('Parish').hasError('required') 
    || this.formChild.get('Village').hasError('required')
    || this.formMother.get('MotherzNationality').hasError('required') 
    || this.formMother.get('MotherzTypeOfID').hasError('required') 
    || this.formMother.get('MotherzOccupation').hasError('required') 
    || this.formMother.get('MotherzDistrictOfResidence').hasError('required') 
    || this.formMother.get('MotherzCountyOfResidence').hasError('required') 
    || this.formMother.get('MotherzSubCountyOfResidence').hasError('required') 
    || this.formMother.get('MotherzParishOfResidence').hasError('required') 
    || this.formMother.get('MotherzVillageOfResidence').hasError('required')
    || this.formFather.get('FatherzNationality').hasError('required') 
    || this.formFather.get('FatherzTypeOfID').hasError('required') 
    || this.formFather.get('FatherzOccupation').hasError('required') 
    || this.formFather.get('FatherzDistrictOfResidence').hasError('required') 
    || this.formFather.get('FatherzCountyOfResidence').hasError('required') 
    || this.formFather.get('FatherzSubCountyOfResidence').hasError('required') 
    || this.formFather.get('FatherzParishOfResidence').hasError('required') 
    || this.formFather.get('FatherzVillageOfResidence').hasError('required')
    || this.formDeclaration.get('WitnessNationality').hasError('required') 
    || this.formDeclaration.get('WitnessTypeOfID').hasError('required') 
    || this.formDeclaration.get('WitnessDistrictOfResidence').hasError('required') 
    || this.formDeclaration.get('WitnessCountyOfResidence').hasError('required') 
    || this.formDeclaration.get('WitnessSubCountyOfResidence').hasError('required') 
    || this.formDeclaration.get('WitnessParishOfResidence').hasError('required') 
    || this.formDeclaration.get('WitnessVillageOfResidence').hasError('required')
    ? 'Please choose one.' : '';
  }

  getErrorMessage() {
    return this.formChild.get('SurnameOfChild').hasError('required') 
    || this.formNotifier.get('NotifierNationality').hasError('required') 
    || this.formNotifier.get('NotifierTypeOfID').hasError('required') 
    ? 'Please enter a value.' : '';
  }

  onGetSavedDraft(): void {
    this.DraftReferenceNumber.disable();
    this.processing = true;  
    
    const data = '?DraftReferenceNumber=' + this.DraftReferenceNumber.value;

    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.form_3_child + data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      this.formChild.patchValue({
        DatetimeOfBirth: new Date(response.data.DateTimeOfBirth),
        HealthFacility: response.data.HealthFacility,
        District: response.data.PlaceOfBirthDistrict,
        County: response.data.PlaceOfBirthCounty,
        Municipality: response.data.PlaceOfBirthSubcounty,
        Parish: response.data.PlaceOfBirthParish,
        Village: response.data.PlaceOfBirthVillage,
        NameOfChild: response.data.NameOfChild,
        SexOfChild: response.data.SexOfChild,
        WeightOfChild: response.data.ChildsWeight
      });   
      
      this.formFather.patchValue({  
        FatherzSurname: response.data.FathersSurname,
        FatherzGivenName: response.data.FathersGivenName,
        FatherzOtherName: response.data.FathersOtherName,
        FatherzNationality: response.data.FathersNationality,
        FatherzNIN: response.data.FathersNIN,
        FatherzCardNumber: response.data.FathersCardNumber,
        FatherzAIN: response.data.FathersAIN,
        FatherzOccupation: response.data.FathersOccupation,      
        FatherzCountryOfResidence: response.data.FatherPlaceOfResidenceCountry,
        FatherzDistrictOfResidence: response.data.FatherPlaceOfResidenceDistrict,
        FatherzCountyOfResidence: response.data.FatherPlaceOfResidenceCounty,
        FatherzSubCountyOfResidence: response.data.FatherPlaceOfResidenceSubcounty,
        FatherzParishOfResidence: response.data.FatherPlaceOfResidenceParish,
        FatherzVillageOfResidence: response.data.FatherPlaceOfResidenceVillage, 
      });      
      
      this.formMother.patchValue({  
        MotherzSurname: response.data.MothersSurname,
        MotherzGivenName: response.data.MothersGivenName,
        MotherzOtherName: response.data.FathersOtherName,
        MotherzNationality: response.data.MothersNationality,
        MotherzNIN: response.data.MothersNIN,
        MotherzCardNumber: response.data.MothersCardNumber,
        MotherzAIN: response.data.MothersAIN,
        MotherzParity: response.data.MothersParity,
        MotherzOccupation: response.data.MothersOccupation,      
        MotherzCountryOfResidence: response.data.MotherPlaceOfResidenceCountry,
        MotherzDistrictOfResidence: response.data.MotherPlaceOfResidenceDistrict,
        MotherzCountyOfResidence: response.data.MotherPlaceOfResidenceCounty,
        MotherzSubCountyOfResidence: response.data.MotherPlaceOfResidenceSubcounty,
        MotherzParishOfResidence: response.data.MotherPlaceOfResidenceParish,
        MotherzVillageOfResidence: response.data.MotherPlaceOfResidenceVillage, 
      });      
      
      this.formDeclaration.patchValue({  
        DeclarationCheckbox: response.data.DeclarationBox,
        DeclarationLateRegistration: response.data.ReasonForLateRegistration,
        DeclarationOccupation: response.data.DeclarantsOccupation,
        DeclarationMeanOfKowning: response.data.DeclarantsMeansOfKowning,
        WitnessDistrictOfResidence: response.data.WitnessPlaceOfResidenceDistrict,
        WitnessCountyOfResidence: response.data.WitnessPlaceOfResidenceCounty,
        WitnessSubCountyOfResidence: response.data.WitnessPlaceOfResidenceSubcounty,
        WitnessParishOfResidence: response.data.WitnessPlaceOfResidenceParish,
        WitnessVillageOfResidence: response.data.WitnessPlaceOfResidenceVillage,
        DateTimeOfDeclaration: response.data.DateTimeOfDeclaration,
      });      

      this.DraftReferenceNumber.enable();
      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });      
  }

  private getFormData(): any {
    
    const data = {
      NotifierDeclarationCapacity: this.formNotifier.get('NotifierDeclarationCapacity').value,
      NotifierNationality: this.NotifierNationalityID,
      NotifierNationalityValue: this.formNotifier.get('NotifierNationality').value,
      NotifierNIN: this.formNotifier.get('NotifierNIN').value ? (this.formNotifier.get('NotifierNIN').value).toUpperCase() : 'empty',
      NotifierAID: this.formNotifier.get('NotifierAID').value ? (this.formNotifier.get('NotifierAID').value).toUpperCase() : 'empty',
      NotifierTypeOfID: parseInt(this.formNotifier.get('NotifierTypeOfID').value),
      NotifierIDNumber: this.formNotifier.get('NotifierIDNumber').value ? this.formNotifier.get('NotifierIDNumber').value : 'empty',
      NotifierOccupation: this.formNotifier.get('NotifierOccupation').value,
      NotifierPhoneNumber: this.formNotifier.get('NotifierPhoneNumber').value,
      NotifierEmailAddress: this.formNotifier.get('NotifierEmailAddress').value ? this.formNotifier.get('NotifierEmailAddress').value : 'empty',
      NotifierDistrictOfResidence: this.formNotifier.get('NotifierDistrictOfResidence').value ? this.NotifierDistrictID : 0,
      NotifierCountyOfResidence: this.formNotifier.get('NotifierCountyOfResidence').value ? this.NotifierCountyID : 0,
      NotifierSubCountyOfResidence: this.formNotifier.get('NotifierSubCountyOfResidence').value ? this.NotifierSubCountyID : 0,
      NotifierParishOfResidence: this.formNotifier.get('NotifierParishOfResidence').value ? this.NotifierParishID : 0,
      NotifierVillageOfResidence: this.formNotifier.get('NotifierVillageOfResidence').value ? this.NotifierVillageID : 0,
      DateTimeOfBirth: this.formChild.get('DatetimeOfBirth').value,
      SurnameOfChild: this.formChild.get('SurnameOfChild').value,
      GivenNameOfChild: this.formChild.get('GivenNameOfChild').value ? this.formChild.get('GivenNameOfChild').value : 'empty',
      OtherNameOfChild: this.formChild.get('OtherNameOfChild').value ? this.formChild.get('OtherNameOfChild').value : 'empty',
      SexOfChild: this.formChild.get('SexOfChild').value,
      ChildsWeight: this.formChild.get('WeightOfChild').value,
      MotherzParity: this.formChild.get('MotherzParity').value,
      PlaceOfBirthDistrict: this.formChild.get('District').value ? this.ChildDistrictID : 0,
      PlaceOfBirthCounty: this.formChild.get('County').value ? this.ChildCountyID: 0,
      PlaceOfBirthSubcounty: this.formChild.get('Municipality').value ? this.ChildSubCountyID: 0,
      PlaceOfBirthParish: this.formChild.get('Parish').value ? this.ChildParishID : 0,
      PlaceOfBirthVillage: this.formChild.get('Village').value ? this.ChildVillageID : 0,
      HealthFacility: this.formChild.get('HealthFacility').value ? this.ChildHealthFacilityID : 0,
      MothersLivingStatus: this.formMother.get('MothersLivingStatus').value ? this.formMother.get('MothersLivingStatus').value : 'empty',
      MotherzNationality: this.formMother.get('MotherzNationality').value ? this.MotherzNationalityID : 0,
      MotherzNationalityValue: this.formMother.get('MotherzNationality').value ? this.formMother.get('MotherzNationality').value : 'empty',
      MotherzNIN: this.formMother.get('MotherzNIN').value ? (this.formMother.get('MotherzNIN').value).toUpperCase() : 'empty',
      MotherzAIN: this.formMother.get('MotherzAIN').value ? (this.formMother.get('MotherzAIN').value).toUpperCase() : 'empty',
      MotherzTypeOfID: this.formMother.get('MotherzTypeOfID').value ? parseInt(this.formMother.get('MotherzTypeOfID').value) : 0,
      MotherzIDNumber: this.formMother.get('MotherzIDNumber').value ? this.formMother.get('MotherzIDNumber').value : 'empty',
      MotherzOccupation: this.formMother.get('MotherzOccupation').value ? this.formMother.get('MotherzOccupation').value : 'empty',
      MotherzPhoneNumber: this.formMother.get('MotherzPhoneNumber').value ? this.formMother.get('MotherzPhoneNumber').value : 'empty',
      MotherzEmailAddress: this.formMother.get('MotherzEmailAddress').value ? this.formMother.get('MotherzEmailAddress').value : 'empty',
      MotherzCountryOfResidence: this.formMother.get('MotherzCountryOfResidence').value ? parseInt(this.formMother.get('MotherzCountryOfResidence').value) : 0,
      MotherzDistrictOfResidence: this.formMother.get('MotherzDistrictOfResidence').value ? this.MotherzDistrictOfResidenceID : 0,
      MotherzCountyOfResidence: this.formMother.get('MotherzCountyOfResidence').value ? this.MotherzCountyOfResidenceID : 0,
      MotherzSubCountyOfResidence: this.formMother.get('MotherzSubCountyOfResidence').value ? this.MotherzSubCountyOfResidenceID : 0,
      MotherzParishOfResidence: this.formMother.get('MotherzParishOfResidence').value ? this.MotherzParishOfResidenceID : 0,
      MotherzVillageOfResidence: this.formMother.get('MotherzVillageOfResidence').value ? this.MotherzVillageOfResidenceID : 0,
      FatherIsKnown: this.formFather.get('FatherIsKnown').value ? this.formFather.get('FatherIsKnown').value : 'No',
      FathersLivingStatus: this.formFather.get('FathersLivingStatus').value ? this.formFather.get('FathersLivingStatus').value : 'empty',
      FatherzNationality: this.formFather.get('FatherzNationality').value ? this.FatherzNationalityID : 0,
      FatherzNationalityValue: this.formFather.get('FatherzNationality').value ? this.formFather.get('FatherzNationality').value : 'empty',
      FatherzNIN: this.formFather.get('FatherzNIN').value ? (this.formFather.get('FatherzNIN').value).toUpperCase() : 'empty',
      FatherzAIN: this.formFather.get('FatherzAIN').value ? (this.formFather.get('FatherzAIN').value).toUpperCase() : 'empty',
      FatherzTypeOfID: this.formFather.get('FatherzTypeOfID').value ? parseInt(this.formFather.get('FatherzTypeOfID').value) : 0,
      FatherzIDNumber: this.formFather.get('FatherzIDNumber').value ? this.formFather.get('FatherzIDNumber').value : 'empty',
      FatherzOccupation: this.formFather.get('FatherzOccupation').value ? this.formFather.get('FatherzOccupation').value : 'empty',
      FatherzPhoneNumber: this.formFather.get('FatherzPhoneNumber').value ? this.formFather.get('FatherzPhoneNumber').value : 'Empty',
      FatherzEmailAddress: this.formFather.get('FatherzEmailAddress').value ? this.formFather.get('FatherzEmailAddress').value : 'empty',
      FatherzCountryOfResidence: this.formFather.get('FatherzCountryOfResidence').value ? parseInt(this.formFather.get('FatherzCountryOfResidence').value) : 0,
      FatherzDistrictOfResidence: this.formFather.get('FatherzDistrictOfResidence').value ? this.FatherzDistrictOfResidenceID : 0,
      FatherzCountyOfResidence: this.formFather.get('FatherzCountyOfResidence').value ? this.FatherzCountyOfResidenceID : 0,
      FatherzSubCountyOfResidence: this.formFather.get('FatherzSubCountyOfResidence').value ? this.FatherzSubCountyOfResidenceID : 0,
      FatherzParishOfResidence: this.formFather.get('FatherzParishOfResidence').value ? this.FatherzParishOfResidenceID : 0,
      FatherzVillageOfResidence: this.formFather.get('FatherzVillageOfResidence').value ? this.FatherzVillageOfResidenceID : 0,
      DeclarationCheckbox: this.formDeclaration.get('DeclarationCheckbox').value,
      ReasonForLateRegistration: this.formDeclaration.get('DeclarationLateRegistration').value ? this.formDeclaration.get('DeclarationLateRegistration').value : 'empty',
      WitnessNationality: this.WitnessNationalityID,
      WitnessNIN: this.formDeclaration.get('WitnessNIN').value ? (this.formDeclaration.get('WitnessNIN').value).toUpperCase() : 'empty',
      WitnessAIN: this.formDeclaration.get('WitnessAIN').value ? (this.formDeclaration.get('WitnessAIN').value).toUpperCase() : 'empty',
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

  getTelephoneNumberErrorMessage() {
    return this.formNotifier.get('NotifierPhoneNumber').hasError('required') ? 'Please enter your phone number' :
    this.formNotifier.get('NotifierPhoneNumber').hasError('minlength')
    || this.formNotifier.get('NotifierPhoneNumber').hasError('maxlength')
    || this.formNotifier.get('NotifierPhoneNumber').hasError('pattern') ? 'Not a valid mobile number' : '';
  }

  getMotherzTelephoneNumberErrorMessage() {
    return this.formMother.get('MotherzPhoneNumber').hasError('required') ? 'Please enter your phone number' :
    this.formMother.get('MotherzPhoneNumber').hasError('minlength')
    || this.formMother.get('MotherzPhoneNumber').hasError('maxlength')
    || this.formMother.get('MotherzPhoneNumber').hasError('pattern') ? 'Not a valid mobile number' : '';
  }

  getFatherzTelephoneNumberErrorMessage() {
    return this.formFather.get('FatherzPhoneNumber').hasError('required') ? 'Please enter your phone number' :
    this.formFather.get('FatherzPhoneNumber').hasError('minlength')
    || this.formFather.get('FatherzPhoneNumber').hasError('maxlength')
    || this.formFather.get('FatherzPhoneNumber').hasError('pattern') ? 'Not a valid mobile number' : '';
  }

  onSaveDraft(): void {    
    this.processing = true;

    this.formChild.disable();
    this.formFather.disable();
    this.formMother.disable();
    this.formDeclaration.disable();

    this.httpSubscription = this.http.put<ApiPayload>(this.endpoints.form_3_child, this.getFormData())
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.service.openSnackBar(response.message + 'Draft Reference Number:' + response.data, 'success-lg');

      this.formChild.enable();
      this.formFather.enable();
      this.formMother.enable();
      this.formDeclaration.enable();  

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.formChild.enable();
      this.formFather.enable();
      this.formMother.enable();
      this.formDeclaration.enable();        
      this.service.determineErrorResponse(error);
    });       
  }
  
  onSubmit(): void {    
    this.processing = true;

    this.formNotifier.disable();
    this.formChild.disable();
    this.formFather.disable();
    this.formMother.disable();
    this.formDeclaration.disable();

    this.httpSubscription = this.http.post<ApiPayload>(this.endpoints.form_3_child, this.getFormData())
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      this.NotificationLetter = response.data;

      // Get the Mother's Nationality
      if (this.formMother.get('MotherzNationality').value) {
        this.NotificationLetter.MotherNationality = this.formMother.get('MotherzNationality').value;
      } else if (this.formNotifier.get('NotifierDeclarationCapacity').value === '1') {
        this.NotificationLetter.MotherNationality = this.formNotifier.get('NotifierNationality').value;
      }

      // Get the Father's Nationality
      if (this.formFather.get('FatherzNationality').value) {
        this.NotificationLetter.FatherNationality = this.formFather.get('FatherzNationality').value;
      } else if (this.formNotifier.get('NotifierDeclarationCapacity').value === '2') {
        this.NotificationLetter.FatherNationality = this.formNotifier.get('NotifierNationality').value;
      }
      
      this.service.openSnackBar(response.message, 'success-lg');

      this.formNotifier.enable();
      this.formNotifier.reset();
      this.formChild.enable();
      this.formChild.reset();
      this.formMother.enable();
      this.formMother.reset();
      this.formFather.enable();
      this.formFather.reset();
      this.formDeclaration.enable();  
      this.formDeclaration.reset();  

      this.selectedIndex = 0;
      this.changeDetector.detectChanges();    

      this.onGenerateBirthNotificationRecord();      

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.formNotifier.enable();
      this.formChild.enable();
      this.formFather.enable();
      this.formMother.enable();
      this.formDeclaration.enable();        
      this.service.determineErrorResponse(error);
    }); 
  }

  onGenerateBirthNotificationRecord(): void {
    // this.dialogRef = this.dialog.open(BirthNotificationRecordDialogComponent, {
    //   panelClass: ['confirmation-of-information-dialog', 'dialogs', 'scrollbar'],
    //   disableClose: true,
    //   data: {
    //     row: this.NotificationLetter
    //   }
    // });    

    // this.dialogRef.afterClosed().subscribe(() => {
    //   this.NotificationLetter = null;
    // });
  }
  
  ngOnDestroy(): void {
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
    if (this.dialogRef) { this.dialogRef.close(); }
  }  
}
