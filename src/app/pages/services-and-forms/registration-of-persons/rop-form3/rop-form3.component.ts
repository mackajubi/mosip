import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { RopForm3ChildDetailsDialogComponent } from 'src/app/dialogs/rop-form3-child-details-dialog/rop-form3-child-details-dialog.component';
import { RopForm3SpouseDetailsDialogComponent } from 'src/app/dialogs/rop-form3-spouse-details-dialog/rop-form3-spouse-details-dialog.component';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiPayload, Country, County, Disability, District, SubCounty } from 'src/app/services/api.model';
import { ApiService } from 'src/app/services/api.service';
import { Child, Spouse } from '../../services-and-forms.model';

@Component({
  selector: 'app-rop-form3',
  templateUrl: './rop-form3.component.html',
  styleUrls: ['./rop-form3.component.scss']
})
export class RopForm3Component implements OnInit {

  title = "Form 3";
  subTitle = "Application for Registration & National Identification Card.";
  loading = true;
  processing = false;
  isLinear = false;
  maxDate = new Date();
  estimatedDOB = false;
  AgeIsEstimated = false;
  httpSubscription: Subscription;

  Countries: Country[] = []; 
  Counties: County[] = [] ;
  Disabilities: Disability[] = [];
  Districts: District[] = [];
  SubCounties: SubCounty[] = [];

  /* Applicant */
  filteredCountryOfResidence: Observable<Country[]>;
  filteredDistrictOfResidence: Observable<District[]>;
  filteredCountyOfResidence: Observable<County[]>;
  filteredPreviousDistrictOfResidence: Observable<District[]>;
  filteredSubCountyOfResidence: Observable<SubCounty[]>;
  filteredCountryOfBirth: Observable<Country[]>;
  filteredDistrictOfBirth: Observable<District[]>;
  filteredCountyOfBirth: Observable<County[]>;
  filteredSubCountyOfBirth: Observable<SubCounty[]>;
  filteredCountryOfOrigin: Observable<Country[]>;
  filteredDistrictOfOrigin: Observable<District[]>;
  filteredCountyOfOrigin: Observable<County[]>;
  filteredSubCountyOfOrigin: Observable<SubCounty[]>;
  
  /* Father */
  filteredFatherCountryOfResidence: Observable<Country[]>;
  filteredFatherDistrictOfResidence: Observable<District[]>;
  filteredFatherCountyOfResidence: Observable<County[]>;
  filteredFatherSubCountyOfResidence: Observable<SubCounty[]>;
  filteredFatherCountryOfOrigin: Observable<Country[]>;
  filteredFatherDistrictOfOrigin: Observable<District[]>;
  filteredFatherCountyOfOrigin: Observable<County[]>;
  filteredFatherSubCountyOfOrigin: Observable<SubCounty[]>;
  
  /* Mother */
  filteredMotherCountryOfResidence: Observable<Country[]>;
  filteredMotherDistrictOfResidence: Observable<District[]>;
  filteredMotherCountyOfResidence: Observable<County[]>;
  filteredMotherSubCountyOfResidence: Observable<SubCounty[]>;
  filteredMotherCountryOfOrigin: Observable<Country[]>;
  filteredMotherDistrictOfOrigin: Observable<District[]>;
  filteredMotherCountyOfOrigin: Observable<County[]>;
  filteredMotherSubCountyOfOrigin: Observable<SubCounty[]>;
  
  /* Guardian */
  filteredGuardianCountryOfResidence: Observable<Country[]>;
  filteredGuardianDistrictOfResidence: Observable<District[]>;
  filteredGuardianCountyOfResidence: Observable<County[]>;
  filteredGuardianSubCountyOfResidence: Observable<SubCounty[]>;

  CountryOfOriginCountryID = 0;
  DistrictOfOriginDistrictID = 0;
  CountyOfOriginCountyID = 0;
  SubCountyOfOriginSubCountyID = 0;
  ApplicantPlaceOfResidenceCountryCountryID = 0;
  ApplicantPlaceOfResidenceDistrictDistrictID = 0;
  ApplicantPlaceOfResidenceCountyCountyID = 0;
  ApplicantPlaceOfResidenceSubcountySubCountyID = 0;
  CountryOfBirthCountryID = 0;
  DistrictOfBirthDistrictID = 0;
  CountyOfBirthCountyID = 0;
  SubCountyOfBirthSubCountyID = 0;
  FatherzCountryOfResidenceCountryID = 0;
  FatherzDistrictOfResidenceDistrictID = 0;
  FatherzCountyOfResidenceCountyID = 0;
  FatherzSubCountyOfResidenceSubCountyID = 0;
  FatherzCountryOfOriginCountryID = 0;
  FatherzDistrictOfOriginDistrictID = 0;
  FatherzCountyOfOriginCountyID = 0;
  FatherzSubCountyOfOriginSubCountyID = 0;
  MotherzCountryOfResidenceCountryID = 0;
  MotherzDistrictOfResidenceDistrictID = 0;
  MotherzCountyOfResidenceCountyID = 0;
  MotherzSubCountyOfResidenceSubCountyID = 0;
  MotherzCountryOfOriginCountryID = 0;
  MotherzDistrictOfOriginDistrictID = 0;
  MotherzCountyOfOriginCountyID = 0;
  MotherzSubCountyOfOriginSubCountyID = 0;
  GuardianzCountryOfResidenceCountryID = 0;
  GuardianzDistrictOfResidenceDistrictID = 0;
  GuardianzCountyOfResidenceCountyID = 0;
  GuardianzSubCountyOfResidenceSubCountyID = 0;

  showPlaceOfResidence = false;
  showPlaceOfBirth = false;
  showPlaceOfOrigin = false;
  showPassportInformation = false;
  showSpouseDetails = true;
  showFathersDetails = true;
  showFatherzPlaceOfResidence = false;
  showFatherzPlaceOfOrigin = false;
  showMotherzDetails = false;
  showMotherzPlaceOfResidence = false;
  showMotherzPlaceOfOrigin = false;
  showGuardianzDetails = false;
  showGuardianzPlaceOfResidence = false;
  showChildRegistrationDetails = false;
  showApplicantzPersonalInformation = true;

  selectedSpouse: Spouse = null;
  dialogRef;
  spouseDisplayedColumns: string[] = [
    'Count', 'Name', 'PreviousName', 'NIN',
    'CitizenshipTypeName', 'CitizenshipCertificateNumber', 'OtherCitizenship',
    'PlaceOfMarriage', 'DateOfMarriage', 'TypeOfMarriageName', 'Actions'
  ];
  childrenDisplayedColumns: string[] = [
    'Count', 'Name', 'ApplicationID', 'PreviousName', 
    'Sex', 'DateOfBirth', 'PlaceOfBirth', 'Actions'
  ];

  spouseDataSource: MatTableDataSource<Spouse>;  
  childrenDataSource: MatTableDataSource<Child>;  

  formPartA: FormGroup;
  formPartB: FormGroup;
  formPartC: FormGroup;
  formPartE: FormGroup;
  DraftReferenceNumber = new FormControl();

  Spouses: Spouse[] = [];
  Children: Child[] = [];

  @ViewChild("spousesPaginator", { static: false }) spousesPaginator: MatPaginator;
  @ViewChild("childrenPaginator", { static: false }) childrenPaginator: MatPaginator;
  @ViewChild("spousesMatSort", { static: false }) spousesMatSort: MatSort;  
  @ViewChild("childrenMatSort", { static: false }) childrenMatSort: MatSort;  

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private datePipe: DatePipe,
  ) {
    this.service.updatePageTitle(this.title + '-' + this.subTitle);    
  }

  ngOnInit(): void {
    this.formPartA = this.formBuilder.group({
      ApplicantSurname: new FormControl('', [Validators.required]),
      ApplicantGivenName: new FormControl('', [Validators.required]),
      ApplicantOtherNames: new FormControl(),
      ApplicantMaidenName: new FormControl(),
      ApplicantPreviousName: new FormControl(),
      SexOfApplicant: new FormControl('', [Validators.required]),
      DateOfBirth: new FormControl('', [Validators.required]),
      AgeIsEstimated: new FormControl(),
      EMail: new FormControl(),
      Phone1: new FormControl(),
      Phone2: new FormControl(),
      HighestLevelOfEducation: new FormControl(),
      Profession: new FormControl(),
      Occupation: new FormControl(),
      Religion: new FormControl(),
      Disabilities: new FormControl(),
      ApplicantPlaceOfResidenceCountry: new FormControl(),
      ApplicantPlaceOfResidenceDistrict: new FormControl(),
      ApplicantPlaceOfResidenceCounty: new FormControl(),
      ApplicantPlaceOfResidenceSubcounty: new FormControl(),
      ParishOfResidence: new FormControl(),
      VillageOfResidence: new FormControl(),
      StreetOfResidence: new FormControl(),
      PlotOfResidence: new FormControl(),
      NumberOfYearsAtAddress: new FormControl(),
      PreviousDistrictOfResidence: new FormControl(),
      PostalAddress: new FormControl(),
      CountryOfBirth: new FormControl(),
      DistrictOfBirth: new FormControl(),
      CountyOfBirth: new FormControl(),
      SubCountyOfBirth: new FormControl(),
      ParishOfBirth: new FormControl(),
      VillageOfBirth: new FormControl(),
      CityOfBirth: new FormControl(),
      HealthFacility: new FormControl(),
      WeightAtBirth: new FormControl(),
      TimeOfBirth: new FormControl(),
      ParityOfChild: new FormControl(),
      CountryOfOrigin: new FormControl(''),
      DistrictOfOrigin: new FormControl(),
      CountyOfOrigin: new FormControl(),
      SubCountyOfOrigin: new FormControl('', [Validators.required]),
      ParishOfOrigin: new FormControl(),
      VillageOfOrigin: new FormControl(),      
      // InOfOrigin: new FormControl(),      
      IndigenousCommunityOrTribe: new FormControl(),      
      Clan: new FormControl(),      
      CitizenshipType: new FormControl(),      
      CitizenshipCertificateNumber: new FormControl(),      
      StateOtherCitizenShip: new FormControl(),  
      PassportNumber: new FormControl(),      
      PassportFileNumber: new FormControl(),                  
    });

    this.formPartB = this.formBuilder.group({  
      PreferredPollingStation: new FormControl(),      
      PollingStationName: new FormControl(),      
      MaritalStatus: new FormControl(),                  
    });

    this.formPartC = this.formBuilder.group({
      FatherzSurname: new FormControl(),
      FatherzGivenName: new FormControl(),
      FatherzOtherName: new FormControl(),
      FatherzMaidenName: new FormControl(),
      FatherzPreviousName: new FormControl(),
      FatherzNIN: new FormControl(),
      FatherzCardNumber: new FormControl(),
      FatherzCitizenshipType: new FormControl(),      
      FatherzCitizenshipCertificateNumber: new FormControl(),      
      FatherzStateOtherCitizenShip: new FormControl(),    
      FatherzLivingStatus: new FormControl(), 
      FatherzOccupation: new FormControl(),   
      FatherzCountryOfResidence: new FormControl(),
      FatherzDistrictOfResidence: new FormControl(),
      FatherzCountyOfResidence: new FormControl(),
      FatherzSubCountyOfResidence: new FormControl(),
      FatherzParishOfResidence: new FormControl(),
      FatherzVillageOfResidence: new FormControl(), 
      FatherzStreetOfResidence: new FormControl(),   
      FatherzHouseNoOfResidence: new FormControl(),
      FatherzCountryOfOrigin: new FormControl(),
      FatherzDistrictOfOrigin: new FormControl(),
      FatherzCountyOfOrigin: new FormControl(),
      FatherzSubCountyOfOrigin: new FormControl(),
      FatherzParishOfOrigin: new FormControl(),
      FatherzVillageOfOrigin: new FormControl(), 
      FatherzStreetOfOrigin: new FormControl(),   
      FatherzHouseNoOfOrigin: new FormControl(),           
      MotherzSurname: new FormControl(),
      MotherzGivenName: new FormControl(),
      MotherzOtherName: new FormControl(),
      MotherzMaidenName: new FormControl(),
      MotherzPreviousName: new FormControl(),
      MotherzNIN: new FormControl(),
      MotherzCardNumber: new FormControl(),
      MotherzCitizenshipType: new FormControl(),      
      MotherzCitizenshipCertificateNumber: new FormControl(),      
      MotherzStateOtherCitizenShip: new FormControl(),    
      MotherzLivingStatus: new FormControl(), 
      MotherzOccupation: new FormControl(),   
      MotherzCountryOfResidence: new FormControl(),
      MotherzDistrictOfResidence: new FormControl(),
      MotherzCountyOfResidence: new FormControl(),
      MotherzSubCountyOfResidence: new FormControl(),
      MotherzParishOfResidence: new FormControl(),
      MotherzVillageOfResidence: new FormControl(), 
      MotherzStreetOfResidence: new FormControl(),   
      MotherzHouseNoOfResidence: new FormControl(),
      MotherzCountryOfOrigin: new FormControl(),
      MotherzDistrictOfOrigin: new FormControl(),
      MotherzCountyOfOrigin: new FormControl(),
      MotherzSubCountyOfOrigin: new FormControl(),
      MotherzParishOfOrigin: new FormControl(),
      MotherzVillageOfOrigin: new FormControl(), 
      MotherzStreetOfOrigin: new FormControl(),   
      MotherzHouseNoOfOrigin: new FormControl(),     
      GuardianzSurname: new FormControl(),
      GuardianzGivenName: new FormControl(),
      GuardianzOtherName: new FormControl(),
      GuardianzOccupation: new FormControl(),   
      GuardianzPassportNumber: new FormControl(),
      GuardianzNIN: new FormControl(),
      GuardianzAIN: new FormControl(),
      GuardianzCardNumber: new FormControl(),
      GuardianzCitizenshipType: new FormControl(),      
      GuardianzCitizenshipCertificateNumber: new FormControl(),      
      GuardianzStateOtherCitizenShip: new FormControl(),
      GuardianzCountryOfResidence: new FormControl(),
      GuardianzDistrictOfResidence: new FormControl(),
      GuardianzCountyOfResidence: new FormControl(),
      GuardianzSubCountyOfResidence: new FormControl(),
      GuardianzParishOfResidence: new FormControl(),
      GuardianzVillageOfResidence: new FormControl(), 
      GuardianzStreetOfResidence: new FormControl(),   
      GuardianzHouseNoOfResidence: new FormControl(),      
    });    

    this.formPartE = this.formBuilder.group({
      DeclarationCheckbox: new FormControl(),
      DeclarationName: new FormControl(),
      DeclarationDate: new FormControl(),
      ApplicantSurname: new FormControl(),
      ApplicantGivenName: new FormControl(),
      ApplicantOtherName: new FormControl(),
      ApplicantMaidenName: new FormControl(),
      ApplicantPreviousName: new FormControl(),
      ApplicantNationality: new FormControl(),
      ApplicantResidenceStatus: new FormControl(),
      ApplicantSupportDocuments: new FormControl(),
      ApplicantNIN: new FormControl(),
      ApplicantAIN: new FormControl(),
      ApplicantSex: new FormControl(),
      ApplicantDateOfBirth: new FormControl(),
      ApplicantRole: new FormControl(),
      ApplicantRoleOtherSpecify: new FormControl(),
      ApplicantSchoolName: new FormControl(),
    });    

    this.spouseDataSource = new MatTableDataSource(this.Spouses);
    this.childrenDataSource = new MatTableDataSource(this.Children);

    setTimeout(() => {
      this.spouseDataSource.paginator = this.spousesPaginator;
      this.spouseDataSource.sort = this.spousesMatSort;
      this.childrenDataSource.paginator = this.childrenPaginator;
      this.childrenDataSource.sort = this.childrenMatSort;
    });

    this.httpSubscription = this.fetchMultiple()
    .pipe(catchError(this.service.handleError))
    .subscribe((responseList) => {
      console.log('responseList:', responseList);

      this.Countries = responseList[0].data;  
      this.Counties = responseList[1].data; 
      this.Disabilities = responseList[2].data; 
      this.Districts = responseList[3].data; 

      // Listeners
      this.PartAFormListeners();
      this.PartCFormListeners();
     
      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });    
  }

  private PartAFormListeners(): void {
    /* Applicant Place of residence */
    this.filteredCountryOfResidence = this.formPartA.get('ApplicantPlaceOfResidenceCountry').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCountry(value))
    );   

    this.filteredDistrictOfResidence = this.formPartA.get('ApplicantPlaceOfResidenceDistrict').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterDistrict(value))
    );   

    this.filteredPreviousDistrictOfResidence = this.formPartA.get('PreviousDistrictOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterDistrict(value))
    );   

    this.filteredCountyOfResidence = this.formPartA.get('ApplicantPlaceOfResidenceCounty').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCounty(value))
    );   

    /* Applicant Place of Birth */
    this.filteredCountryOfBirth = this.formPartA.get('CountryOfBirth').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCountry(value))
    );   

    this.filteredDistrictOfBirth = this.formPartA.get('DistrictOfBirth').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterDistrict(value))
    );   

    this.filteredCountyOfBirth = this.formPartA.get('CountyOfBirth').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCounty(value))
    );  

    /* Applicant Place of Origin */
    this.filteredCountryOfOrigin = this.formPartA.get('CountryOfOrigin').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCountry(value))
    );   

    this.filteredDistrictOfOrigin = this.formPartA.get('DistrictOfOrigin').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterDistrict(value))
    );   

    this.filteredCountyOfOrigin = this.formPartA.get('CountyOfOrigin').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCounty(value))
    );  
  }

  private PartCFormListeners(): void {
    /* Father's Place of Residence */
    this.filteredFatherCountryOfResidence = this.formPartC.get('FatherzCountryOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCountry(value))
    );   

    this.filteredFatherDistrictOfResidence = this.formPartC.get('FatherzDistrictOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterDistrict(value))
    );   

    this.filteredFatherCountyOfResidence = this.formPartC.get('FatherzCountyOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCounty(value))
    );

    this.filteredFatherCountryOfOrigin = this.formPartC.get('FatherzCountryOfOrigin').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCountry(value))
    );   

    this.filteredFatherDistrictOfOrigin = this.formPartC.get('FatherzDistrictOfOrigin').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterDistrict(value))
    );   

    this.filteredFatherCountyOfOrigin = this.formPartC.get('FatherzCountyOfOrigin').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCounty(value))
    );  

    /* Mother's Place of Residence */
    this.filteredMotherCountryOfResidence = this.formPartC.get('MotherzCountryOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCountry(value))
    );   

    this.filteredMotherDistrictOfResidence = this.formPartC.get('MotherzDistrictOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterDistrict(value))
    );   

    this.filteredMotherCountyOfResidence = this.formPartC.get('MotherzCountyOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCounty(value))
    );

    this.filteredMotherCountryOfOrigin = this.formPartC.get('MotherzCountryOfOrigin').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCountry(value))
    );   

    this.filteredMotherDistrictOfOrigin = this.formPartC.get('MotherzDistrictOfOrigin').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterDistrict(value))
    );   

    this.filteredMotherCountyOfOrigin = this.formPartC.get('MotherzCountyOfOrigin').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCounty(value))
    );  

    /* Guardian's Place of Residence */
    this.filteredGuardianCountryOfResidence = this.formPartC.get('GuardianzCountryOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCountry(value))
    );   

    this.filteredGuardianDistrictOfResidence = this.formPartC.get('GuardianzDistrictOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterDistrict(value))
    );   

    this.filteredGuardianCountyOfResidence = this.formPartC.get('GuardianzCountyOfResidence').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCounty(value))
    );    
  }

  private _filterCountry(value: string): Country[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.Countries.filter(option => option.CountryName.toLowerCase().includes(filterValue));
  }  

  private _filterDistrict(value: string): District[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.Districts.filter(option => option.DistrictName.toLowerCase().includes(filterValue));
  }  

  private _filterCounty(value: string): County[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.Counties.filter(option => option.CountyName.toLowerCase().includes(filterValue));
  }  

  private _filterSubCounty(value: string): SubCounty[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.SubCounties.filter(option => option.SubCountyName.toLowerCase().includes(filterValue));
  }  

  private fetchMultiple(): Observable<any[]> {
    this.processing = true;

    const reqCountry = this.http.get(this.endpoints.ref_data_country);
    const reqCounty = this.http.get(this.endpoints.ref_data_county);
    const reqDisability = this.http.get(this.endpoints.ref_data_disability);
    const reqDistrict = this.http.get(this.endpoints.ref_data_district);

    return forkJoin([reqCountry, reqCounty, reqDisability, reqDistrict]);
  }

  onApplicantPlaceOfResidenceCounty(CountyID: number): void {
    this.formPartA.get('ApplicantPlaceOfResidenceSubcounty').reset();

    this.onFetchSubCountyID(CountyID, 'ApplicantPlaceOfResidenceSubcounty');
  }

  onCountyOfBirth(CountyID: number): void {
    this.formPartA.get('SubCountyOfBirth').reset();

    this.onFetchSubCountyID(CountyID, 'SubCountyOfBirth');
  }

  onCountyOfOrigin(CountyID: number): void {
    this.formPartA.get('SubCountyOfOrigin').reset();

    this.onFetchSubCountyID(CountyID, 'SubCountyOfOrigin');
  }

  onFatherzCountyOfResidence(CountyID: number): void {
    this.formPartC.get('FatherzSubCountyOfResidence').reset();

    this.onFetchSubCountyID(CountyID, 'FatherzSubCountyOfResidence');
  }

  onFatherzCountyOfOrigin(CountyID: number): void {
    this.formPartC.get('FatherzSubCountyOfOrigin').reset();

    this.onFetchSubCountyID(CountyID, 'FatherzSubCountyOfOrigin');
  }

  onMotherzCountyOfResidence(CountyID: number): void {
    this.formPartC.get('MotherzSubCountyOfResidence').reset();

    this.onFetchSubCountyID(CountyID, 'MotherzSubCountyOfResidence');
  }

  onMotherzCountyOfOrigin(CountyID: number): void {
    this.formPartC.get('MotherzSubCountyOfOrigin').reset();

    this.onFetchSubCountyID(CountyID, 'MotherzSubCountyOfOrigin');
  }

  onGuardianzCountyOfResidence(CountyID: number): void {
    this.formPartC.get('GuardianzSubCountyOfResidence').reset();

    this.onFetchSubCountyID(CountyID, 'GuardianzSubCountyOfResidence');
  }

  private onFetchSubCountyID(CountyID: number, field: string):void {
    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.ref_data_sub_county + '?CountyID=' + CountyID)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.SubCounties = response.data;

      if (field === 'ApplicantPlaceOfResidenceSubcounty') {
        this.filteredSubCountyOfResidence = this.formPartA.get('ApplicantPlaceOfResidenceSubcounty').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterSubCounty(value))
        );     
      } else if (field === 'SubCountyOfBirth') {
        this.filteredSubCountyOfBirth = this.formPartA.get('SubCountyOfBirth').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterSubCounty(value))
        );     
      } else if (field === 'SubCountyOfOrigin') {
        this.filteredSubCountyOfOrigin = this.formPartA.get('SubCountyOfOrigin').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterSubCounty(value))
        );     
      } else if (field === 'FatherzSubCountyOfResidence') {
        this.filteredFatherSubCountyOfResidence = this.formPartC.get('FatherzSubCountyOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterSubCounty(value))
        );     
      } else if (field === 'FatherzSubCountyOfOrigin') {
        this.filteredFatherSubCountyOfOrigin = this.formPartC.get('FatherzSubCountyOfOrigin').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterSubCounty(value))
        );     
      } else if (field === 'MotherzSubCountyOfResidence') {
        this.filteredMotherSubCountyOfResidence = this.formPartC.get('MotherzSubCountyOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterSubCounty(value))
        );     
      } else if (field === 'MotherzSubCountyOfOrigin') {
        this.filteredMotherSubCountyOfOrigin = this.formPartC.get('MotherzSubCountyOfOrigin').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterSubCounty(value))
        );     
      } else if (field === 'GuardianzSubCountyOfResidence') {
        this.filteredGuardianSubCountyOfResidence = this.formPartC.get('GuardianzSubCountyOfResidence').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterSubCounty(value))
        );     
      }

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    }); 
  }

  onGetSavedDraft(): void {
    this.DraftReferenceNumber.disable();
    this.processing = true;  
    
    const data = '?DraftReferenceNumber=' + this.DraftReferenceNumber.value;

    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.form_3_nin + data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      this.formPartA.patchValue({
        ApplicantSurname: response.data.ApplicantSurname,
        ApplicantGivenName: response.data.ApplicantGivenName,
        ApplicantOtherNames: response.data.ApplicantOtherNames,
        ApplicantMaidenName: response.data.ApplicantMaidenName,
        ApplicantPreviousName: response.data.ApplicantPreviousName,
        SexOfApplicant: response.data.SexOfApplicant,
        DateOfBirth: new Date(response.data.DateOfBirth),
        AgeIsEstimated: response.data.AgeIsEstimated,
        EMail: response.data.EMail,
        Phone1: response.data.Phone1,
        Phone2: response.data.Phone2,
        HighestLevelOfEducation: response.data.HighestLevelOfEducation,
        Profession: response.data.Profession,
        Occupation: response.data.Occupation,
        Religion: response.data.Religion,
        // Disabilities: response.data.Disabilities,
        ApplicantPlaceOfResidenceCountry: response.data.PlaceOfResidenceCountry,
        ApplicantPlaceOfResidenceDistrict: response.data.PlaceOfResidenceDistrict,
        ApplicantPlaceOfResidenceCounty: response.data.PlaceOfResidenceCounty,
        ApplicantPlaceOfResidenceSubcounty: response.data.PlaceOfResidenceSubcounty,
        ParishOfResidence: response.data.PlaceOfResidenceParish,
        VillageOfResidence: response.data.PlaceOfResidenceVillage,
        StreetOfResidence: response.data.PlaceOfResidenceStreet,
        PlotOfResidence: response.data.PlaceOfResidencePlot,
        NumberOfYearsAtAddress: response.data.NumberOfYearsAtResidence,
        PreviousDistrictOfResidence: response.data.DistrictOfPreviousResidence,
        PostalAddress: response.data.PostalAddress,
        CountryOfBirth: response.data.PlaceOfBirthCountry,
        DistrictOfBirth: response.data.PlaceOfBirthDistrict,
        CountyOfBirth: response.data.PlaceOfBirthCounty,
        SubCountyOfBirth: response.data.PlaceOfBirthSubcounty,
        ParishOfBirth: response.data.PlaceOfBirthParish,
        VillageOfBirth: response.data.PlaceOfBirthVillage,
        CityOfBirth: response.data.PlaceOfBirthCity,
        HealthFacility: response.data.HealthFacility,
        WeightAtBirth: response.data.WeightAtBirth,
        TimeOfBirth: response.data.TimeOfBirth,
        ParityOfChild: response.data.ParityOfChild,
        CountryOfOrigin: response.data.PlaceOfOriginCountry,
        DistrictOfOrigin: response.data.PlaceOfOriginDistrict,
        CountyOfOrigin: response.data.PlaceOfOriginCounty,
        SubCountyOfOrigin: response.data.PlaceOfOriginSubcounty,
        ParishOfOrigin: response.data.PlaceOfOriginParish,
        VillageOfOrigin: response.data.PlaceOfOriginVillage,     
        IndigenousCommunityOrTribe: response.data.TribeOrIndigenousCommunity,      
        Clan: response.data.ClanOfApplicant,      
        CitizenshipType: response.data.CitizenshipType,      
        CitizenshipCertificateNumber: response.data.CitizenshipCertificateNumber,      
        StateOtherCitizenShip: response.data.IfCitizenTypeIsDual,  
        PassportNumber: response.data.PassportNumber,      
        PassportFileNumber: response.data.PassportFileNumber,                  
      });   
      
      this.formPartB.patchValue({  
        PreferredPollingStation: response.data.PreferredPollingStation,      
        PollingStationName: response.data.PollingStationName,      
        MaritalStatus: response.data.MaritalStatus,                  
      });      

      this.formPartC.patchValue({
        FatherzSurname: response.data.FathersSurname,
        FatherzGivenName: response.data.FathersGivenName,
        FatherzOtherName: response.data.FathersOtherName,
        FatherzMaidenName: response.data.FathersMaidenName,
        FatherzPreviousName: response.data.FathersPreviousName,
        FatherzNIN: response.data.FathersNIN,
        FatherzCardNumber: response.data.FathersCardNumber,
        FatherzCitizenshipType: response.data.FatherCitizenshipType,      
        FatherzCitizenshipCertificateNumber: response.data.FatherCitizenshipCertificateNumber,      
        FatherzStateOtherCitizenShip: response.data.FatherIfCitizenTypeIsDual,    
        FatherzOccupation: response.data.FathersOccupation,   
        FatherzLivingStatus: response.data.FatherLivingStatus, 
        FatherzCountryOfResidence: response.data.FatherPlaceOfResidenceCountry,
        FatherzDistrictOfResidence: response.data.FatherPlaceOfResidenceDistrict,
        FatherzCountyOfResidence: response.data.FatherPlaceOfResidenceCounty,
        FatherzSubCountyOfResidence: response.data.FatherPlaceOfResidenceSubcounty,
        FatherzParishOfResidence: response.data.FatherPlaceOfResidenceParish,
        FatherzVillageOfResidence: response.data.FatherPlaceOfResidenceVillage, 
        FatherzStreetOfResidence: response.data.FatherPlaceOfResidenceStreet,   
        FatherzHouseNoOfResidence: response.data.FatherPlaceOfResidencePlot,
        FatherzCountryOfOrigin: response.data.FatherPlaceOfOriginCountry,
        FatherzDistrictOfOrigin: response.data.FatherPlaceOfOriginDistrict,
        FatherzCountyOfOrigin: response.data.FatherPlaceOfOriginCounty,
        FatherzSubCountyOfOrigin: response.data.FatherPlaceOfOriginSubcounty,
        FatherzParishOfOrigin: response.data.FatherPlaceOfOriginParish,
        FatherzVillageOfOrigin: response.data.FatherPlaceOfOriginVillage, 
        // FatherzStreetOfOrigin: response.data.ApplicantSurname,   
        // FatherzHouseNoOfOrigin: response.data.ApplicantSurname,           
        MotherzSurname: response.data.MothersSurname,
        MotherzGivenName: response.data.MothersGivenName,
        MotherzOtherName: response.data.MothersOtherName,
        MotherzMaidenName: response.data.MothersMaidenName,
        MotherzPreviousName: response.data.MothersPreviousName,
        MotherzNIN: response.data.MothersNIN,
        MotherzCardNumber: response.data.MothersCardNumber,
        MotherzOccupation: response.data.MothersOccupation,   
        MotherzCitizenshipType: response.data.MotherCitizenshipType,      
        MotherzCitizenshipCertificateNumber: response.data.MotherCitizenshipCertificateNumber,      
        MotherzStateOtherCitizenShip: response.data.MotherIfCitizenTypeIsDual,    
        MotherzLivingStatus: response.data.MotherLivingStatus, 
        MotherzCountryOfResidence: response.data.MotherPlaceOfResidenceCountry,
        MotherzDistrictOfResidence: response.data.MotherPlaceOfResidenceDistrict,
        MotherzCountyOfResidence: response.data.MotherPlaceOfResidenceCounty,
        MotherzSubCountyOfResidence: response.data.MotherPlaceOfResidenceSubcounty,
        MotherzParishOfResidence: response.data.MotherPlaceOfResidenceParish,
        MotherzVillageOfResidence: response.data.MotherPlaceOfResidenceVillage, 
        MotherzStreetOfResidence: response.data.MotherPlaceOfResidenceStreet,   
        MotherzHouseNoOfResidence: response.data.MotherPlaceOfResidencePlot,
        MotherzCountryOfOrigin: response.data.MotherPlaceOfOriginCountry,
        MotherzDistrictOfOrigin: response.data.MotherPlaceOfOriginDistrict,
        MotherzCountyOfOrigin: response.data.MotherPlaceOfOriginCounty,
        MotherzSubCountyOfOrigin: response.data.MotherPlaceOfOriginSubcounty,
        MotherzParishOfOrigin: response.data.MotherPlaceOfOriginParish,
        MotherzVillageOfOrigin: response.data.MotherPlaceOfOriginVillage, 
        // MotherzStreetOfOrigin: response.data.ApplicantSurname,   
        // MotherzHouseNoOfOrigin: response.data.ApplicantSurname,     
        GuardianzSurname: response.data.GuardiansSurname,
        GuardianzGivenName: response.data.GuardiansGivenName,
        GuardianzOtherName: response.data.GuardiansOtherName,
        GuardianzOccupation: response.data.GuardiansOccupation,   
        GuardianzPassportNumber: response.data.GuardiansPassportNumber,
        GuardianzNIN: response.data.GuardiansNIN,
        GuardianzAIN: response.data.GuardiansAIN,
        GuardianzCardNumber: response.data.GuardiansCardNumber,
        GuardianzCitizenshipType: response.data.GuardianCitizenshipType,      
        GuardianzCitizenshipCertificateNumber: response.data.GuardianCitizenshipCertificateNumber,      
        GuardianzStateOtherCitizenShip: response.data.GuardianIfCitizenTypeIsDual,
        GuardianzCountryOfResidence: response.data.GuardianPlaceOfResidenceCountry,
        GuardianzDistrictOfResidence: response.data.GuardianPlaceOfResidenceDistrict,
        GuardianzCountyOfResidence: response.data.GuardianPlaceOfResidenceCounty,
        GuardianzSubCountyOfResidence: response.data.GuardianPlaceOfResidenceSubcounty,
        GuardianzParishOfResidence: response.data.GuardianPlaceOfResidenceParish,
        GuardianzVillageOfResidence: response.data.GuardianPlaceOfResidenceVillage, 
        GuardianzStreetOfResidence: response.data.GuardianPlaceOfResidenceStreet,   
        GuardianzHouseNoOfResidence: response.data.GuardianPlaceOfResidencePlot,      
      });    
  
      this.formPartE.patchValue({
        DeclarationCheckbox: response.data.DeclarationBox,
        DeclarationName: response.data.DeclarantName,
        DeclarationDate: response.data.DateOfDeclaration,
        ApplicantSurname: response.data.DeclarantSurname,
        ApplicantGivenName: response.data.DeclarantGivenName,
        ApplicantOtherName: response.data.DeclarantOtherName,
        ApplicantMaidenName: response.data.DeclarantMaidenName,
        ApplicantPreviousName: response.data.DeclarantPreviousName,
        ApplicantNationality: response.data.DeclarantNationality,
        ApplicantResidenceStatus: response.data.DeclarantResidenceStatus,
        ApplicantSupportDocuments: response.data.ApplicantSupportDocuments,
        ApplicantNIN: response.data.DeclarantNIN,
        ApplicantAIN: response.data.DeclarantAIN,
        ApplicantSex: response.data.DeclarantSex,
        ApplicantDateOfBirth: response.data.DeclarantDateOfBirth,
        ApplicantRole: response.data.DeclarantRole,
        ApplicantRoleOtherSpecify: response.data.DeclarantRoleOtherSpecify,
        ApplicantSchoolName: response.data.DeclarantSchoolName,
      });  
      
      this.Spouses = response.data.Spouses;
      this.Children = response.data.Children;

      this.spouseDataSource = new MatTableDataSource(this.Spouses);
      this.childrenDataSource = new MatTableDataSource(this.Children);
  
      setTimeout(() => {
        this.spouseDataSource.paginator = this.spousesPaginator;
        this.spouseDataSource.sort = this.spousesMatSort;
        this.childrenDataSource.paginator = this.childrenPaginator;
        this.childrenDataSource.sort = this.childrenMatSort;
      });

      this.DraftReferenceNumber.enable();
      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });      
  }

  onAddASpouse(): void {
    this.dialogRef = this.dialog.open(RopForm3SpouseDetailsDialogComponent, {
      panelClass: ['rop-form3-Spouse-details-dialog', 'dialogs'],
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe((result: { status: boolean, row: Spouse }) => {
      if (result.status) {
        console.log('row:', result.row);
          let found = false;
          this.Spouses.filter((spouse) => {
            if ((spouse.NIN === result.row.NIN && result.row.Surname === result.row.Surname && spouse.GivenName === result.row.GivenName)
              || spouse.DateOfMarriage === result.row.DateOfMarriage) {
              found = true;
            }
          });

          if (found) {
            this.service.openSnackBar('Sorry, this record already exists', 'error-lg');
          } else {
            this.Spouses.push(result.row);
          }
        
        this.spouseDataSource = new MatTableDataSource(this.Spouses);
    
        setTimeout(() => {
          this.spouseDataSource.paginator = this.spousesPaginator;
          this.spouseDataSource.sort = this.spousesMatSort;
        });
      }
    });      
  }

  onChangeSpouseInformation(row: Spouse): void {
    this.dialogRef = this.dialog.open(RopForm3SpouseDetailsDialogComponent, {
      panelClass: ['rop-form3-Spouse-details-dialog', 'dialogs'],
      disableClose: true,
      data: { row }
    });

    this.dialogRef.afterClosed().subscribe((result: { status: boolean, row: Spouse }) => {
      if (result.status) {
        this.Spouses[this.Spouses.indexOf(row)] = {
          Surname: result.row.Surname,
          GivenName: result.row.GivenName,
          OtherName: result.row.OtherName,
          MaidenName: result.row.MaidenName,
          PreviousName: result.row.PreviousName,
          NIN: result.row.NIN,
          NINCardNumber: result.row.NINCardNumber,
          ApplicationID: result.row.ApplicationID,
          CitizenshipType: result.row.CitizenshipType,
          CitizenshipTypeName: result.row.CitizenshipTypeName,
          CitizenshipCertificateNumber: result.row.CitizenshipCertificateNumber,
          OtherCitizenship: result.row.OtherCitizenship,
          PlaceOfMarriage: result.row.PlaceOfMarriage,
          DateOfMarriage: result.row.DateOfMarriage,
          TypeOfMarriage: result.row.TypeOfMarriage,
          TypeOfMarriageName: result.row.TypeOfMarriageName
        }

        // this.changeDetector.detectChanges();

        this.spouseDataSource = new MatTableDataSource(this.Spouses);
    
        setTimeout(() => {
          this.spouseDataSource.paginator = this.spousesPaginator;
          this.spouseDataSource.sort = this.spousesMatSort;
        });        
      }
    });  
  }

  onRemoveSpouse(row: Spouse): void {
    this.Spouses.splice(this.Spouses.indexOf(row), 1)
    
    this.spouseDataSource = new MatTableDataSource(this.Spouses);
    
    setTimeout(() => {
      this.spouseDataSource.paginator = this.spousesPaginator;
      this.spouseDataSource.sort = this.spousesMatSort;
    });
  }

  onAddAChild(): void {
    this.dialogRef = this.dialog.open(RopForm3ChildDetailsDialogComponent, {
      panelClass: ['rop-form3-child-details-dialog', 'dialogs'],
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe((result: { status: boolean, row: Child }) => {
      if (result.status) {
        let found = false;
        this.Children.filter((child) => {
          if (child.DateOfBirth === result.row.DateOfBirth && child.GivenName === result.row.GivenName && child.Sex === result.row.Sex){
            found = true;
          }
        });

        if (found) {
          this.service.openSnackBar('Sorry, this record already exists', 'error-lg');
        } else {
          this.Children.push(result.row);
        }

        this.childrenDataSource = new MatTableDataSource(this.Children);
    
        setTimeout(() => {
          this.childrenDataSource.paginator = this.childrenPaginator;
          this.childrenDataSource.sort = this.childrenMatSort;
        });     
      }
    });      
  }

  onChangeChildInformation(row: Child): void {
    this.dialogRef = this.dialog.open(RopForm3ChildDetailsDialogComponent, {
      panelClass: ['rop-form3-Spouse-details-dialog', 'dialogs'],
      disableClose: true,
      data: { row }
    });

    this.dialogRef.afterClosed().subscribe((result: { status: boolean, row: Child }) => {
      if (result.status) {
        this.Children[this.Children.indexOf(row)] = {
          ApplicationID: result.row.Surname,
          Surname: result.row.Surname,
          GivenName: result.row.GivenName,
          OtherName: result.row.OtherName,
          MaidenName: result.row.MaidenName,
          PreviousName: result.row.PreviousName,
          Sex: result.row.Sex,
          DateOfBirth: result.row.DateOfBirth,
          PlaceOfBirth: result.row.PlaceOfBirth,
        }

        this.childrenDataSource = new MatTableDataSource(this.Children);
    
        setTimeout(() => {
          this.childrenDataSource.paginator = this.childrenPaginator;
          this.childrenDataSource.sort = this.childrenMatSort;
        });        
      }
    });
  }

  onRemoveChild(row: Child): void {
    this.Children.splice(this.Children.indexOf(row), 1)
    
    this.childrenDataSource = new MatTableDataSource(this.Children);
    
    setTimeout(() => {
      this.childrenDataSource.paginator = this.childrenPaginator;
      this.childrenDataSource.sort = this.childrenMatSort;
    });  
  }  

  private getFormData(): any {
    
    const data = {
      Spouses: JSON.stringify(this.Spouses),
      Children: JSON.stringify(this.Children),
      DraftReferenceNumber: this.DraftReferenceNumber.value ? this.DraftReferenceNumber.value : 'empty',
      ApplicantSurname: this.formPartA.get('ApplicantSurname').value ? this.formPartA.get('ApplicantSurname').value : 'empty',
      ApplicantGivenName: this.formPartA.get('ApplicantGivenName').value ? this.formPartA.get('ApplicantGivenName').value : 'empty',
      ApplicantOtherNames: this.formPartA.get('ApplicantOtherNames').value ? this.formPartA.get('ApplicantOtherNames').value : 'empty',
      ApplicantMaidenName: this.formPartA.get('ApplicantMaidenName').value ? this.formPartA.get('ApplicantMaidenName').value : 'empty',
      ApplicantPreviousName: this.formPartA.get('ApplicantPreviousName').value ? this.formPartA.get('ApplicantPreviousName').value : 'empty',
      DateOfBirth: this.formPartA.get('DateOfBirth').value ? this.datePipe.transform(this.formPartA.get('DateOfBirth').value, 'yyyy-MM-dd') : 'empty',
      SexOfApplicant: this.formPartA.get('SexOfApplicant').value ? this.formPartA.get('SexOfApplicant').value : 'empty',
      AgeIsEstimated: this.formPartA.get('AgeIsEstimated').value ? true : false,
      EMail: this.formPartA.get('EMail').value ? this.formPartA.get('EMail').value : 'empty',
      Phone1: this.formPartA.get('Phone1').value ? this.formPartA.get('Phone1').value : 'empty',
      Phone2: this.formPartA.get('Phone2').value ? this.formPartA.get('Phone2').value : 'empty',
      HighestLevelOfEducation: this.formPartA.get('HighestLevelOfEducation').value ? this.formPartA.get('HighestLevelOfEducation').value : 0,
      Profession: this.formPartA.get('Profession').value ? this.formPartA.get('Profession').value : 'empty',
      Occupation: this.formPartA.get('Occupation').value ? this.formPartA.get('Occupation').value : 'empty',
      Religion: this.formPartA.get('Religion').value ? this.formPartA.get('Religion').value : 0,
      Disabilities: this.formPartA.get('Disabilities').value ? this.formPartA.get('Disabilities').value : 0,
      PlaceOfResidenceCountry: this.formPartA.get('ApplicantPlaceOfResidenceCountry').value ? this.ApplicantPlaceOfResidenceCountryCountryID : 0,
      PlaceOfResidenceDistrict: this.formPartA.get('ApplicantPlaceOfResidenceDistrict').value ? this.ApplicantPlaceOfResidenceDistrictDistrictID : 0,
      PlaceOfResidenceCounty: this.formPartA.get('ApplicantPlaceOfResidenceCounty').value ? this.ApplicantPlaceOfResidenceCountyCountyID : 0,
      PlaceOfResidenceSubcounty: this.formPartA.get('ApplicantPlaceOfResidenceSubcounty').value ? this.ApplicantPlaceOfResidenceSubcountySubCountyID : 0,
      PlaceOfResidenceParish: this.formPartA.get('ParishOfResidence').value ? this.formPartA.get('ParishOfResidence').value : 'empty',
      PlaceOfResidenceVillage: this.formPartA.get('VillageOfResidence').value ? this.formPartA.get('VillageOfResidence').value : 'empty',
      PlaceOfResidenceStreet: this.formPartA.get('StreetOfResidence').value ? this.formPartA.get('StreetOfResidence').value : 'empty',
      PlaceOfResidencePlot: this.formPartA.get('PlotOfResidence').value ? this.formPartA.get('PlotOfResidence').value : 'empty',
      NumberOfYearsAtResidence: this.formPartA.get('NumberOfYearsAtAddress').value ? this.formPartA.get('NumberOfYearsAtAddress').value : 0,
      DistrictOfPreviousResidence: this.formPartA.get('PreviousDistrictOfResidence').value ? this.formPartA.get('PreviousDistrictOfResidence').value : 0,
      PostalAddress: this.formPartA.get('PostalAddress').value ? this.formPartA.get('PostalAddress').value : 'empty',
      PlaceOfBirthCountry: this.formPartA.get('CountryOfBirth').value ? this.CountryOfBirthCountryID : 0,
      PlaceOfBirthDistrict: this.formPartA.get('DistrictOfBirth').value ? this.DistrictOfBirthDistrictID : 0,
      PlaceOfBirthCounty: this.formPartA.get('CountyOfBirth').value ? this.CountyOfBirthCountyID : 0,
      PlaceOfBirthSubcounty: this.formPartA.get('SubCountyOfBirth').value ? this.SubCountyOfBirthSubCountyID : 0,
      PlaceOfBirthParish: this.formPartA.get('ParishOfBirth').value ? this.formPartA.get('ParishOfBirth').value : 'empty',
      PlaceOfBirthVillage: this.formPartA.get('VillageOfBirth').value ? this.formPartA.get('VillageOfBirth').value : 'empty',
      PlaceOfBirthCity: this.formPartA.get('CityOfBirth').value ? this.formPartA.get('CityOfBirth').value : 'empty',
      HealthFacility: this.formPartA.get('HealthFacility').value ? this.formPartA.get('HealthFacility').value : 'empty',
      WeightAtBirth: this.formPartA.get('WeightAtBirth').value ? this.formPartA.get('WeightAtBirth').value : 'empty',
      TimeOfBirth: this.formPartA.get('TimeOfBirth').value ? this.formPartA.get('TimeOfBirth').value : 'empty',
      ParityOfChild: this.formPartA.get('ParityOfChild').value ? this.formPartA.get('ParityOfChild').value : 'empty',
      PlaceOfOriginCountry: this.formPartA.get('CountryOfOrigin').value ? this.CountryOfOriginCountryID : 0,
      PlaceOfOriginDistrict: this.formPartA.get('DistrictOfOrigin').value ? this.DistrictOfOriginDistrictID : 0,
      PlaceOfOriginCounty: this.formPartA.get('CountyOfOrigin').value ? this.CountyOfOriginCountyID : 0,
      PlaceOfOriginSubcounty: this.formPartA.get('SubCountyOfOrigin').value ? this.SubCountyOfOriginSubCountyID : 0,
      PlaceOfOriginParish: this.formPartA.get('ParishOfOrigin').value ? this.formPartA.get('ParishOfOrigin').value : 'empty',
      PlaceOfOriginVillage: this.formPartA.get('VillageOfOrigin').value ? this.formPartA.get('VillageOfOrigin').value : 'empty',
      TribeOrIndigenousCommunity: this.formPartA.get('IndigenousCommunityOrTribe').value ? this.formPartA.get('IndigenousCommunityOrTribe').value : 0,
      ClanOfApplicant: this.formPartA.get('Clan').value ? this.formPartA.get('Clan').value : 'empty',
      CitizenshipType: this.formPartA.get('CitizenshipType').value ? this.formPartA.get('CitizenshipType').value : 0,
      CitizenshipCertificateNumber: this.formPartA.get('CitizenshipCertificateNumber').value ? this.formPartA.get('CitizenshipCertificateNumber').value : 'empty',
      IfCitizenTypeIsDual: this.formPartA.get('StateOtherCitizenShip').value ? this.formPartA.get('StateOtherCitizenShip').value : 'empty',
      PassportNumber: this.formPartA.get('PassportNumber').value ? this.formPartA.get('PassportNumber').value : 'empty',
      PassportFileNumber: this.formPartA.get('PassportFileNumber').value ? this.formPartA.get('PassportFileNumber').value : 'empty',
      PreferredPollingStation: this.formPartB.get('PreferredPollingStation').value ? this.formPartB.get('PreferredPollingStation').value : 'empty',
      PollingStationName: this.formPartB.get('PollingStationName').value ? this.formPartB.get('PollingStationName').value : 'empty',
      MaritalStatus: this.formPartB.get('MaritalStatus').value ? this.formPartB.get('MaritalStatus').value : 0,
      FathersSurname: this.formPartC.get('FatherzSurname').value ? this.formPartC.get('FatherzSurname').value : 'empty',
      FathersGivenName: this.formPartC.get('FatherzGivenName').value ? this.formPartC.get('FatherzGivenName').value : 'empty',
      FathersOtherName: this.formPartC.get('FatherzOtherName').value ? this.formPartC.get('FatherzOtherName').value : 'empty',
      FathersMaidenName: this.formPartC.get('FatherzMaidenName').value ? this.formPartC.get('FatherzMaidenName').value : 'empty',
      FathersPreviousName: this.formPartC.get('FatherzPreviousName').value ? this.formPartC.get('FatherzPreviousName').value : 'empty',
      FathersNIN: this.formPartC.get('FatherzNIN').value ? this.formPartC.get('FatherzNIN').value : 'empty',
      FathersCardNumber: this.formPartC.get('FatherzCardNumber').value ? this.formPartC.get('FatherzCardNumber').value : 'empty',
      FatherCitizenshipType: this.formPartC.get('FatherzCitizenshipType').value ? this.formPartC.get('FatherzCitizenshipType').value : 0,
      FatherCitizenshipCertificateNumber: this.formPartC.get('FatherzCitizenshipCertificateNumber').value ? this.formPartC.get('FatherzCitizenshipCertificateNumber').value : 'empty',
      FatherIfCitizenTypeIsDual: this.formPartC.get('FatherzStateOtherCitizenShip').value ? this.formPartC.get('FatherzStateOtherCitizenShip').value : 'empty',
      FatherLivingStatus: this.formPartC.get('FatherzLivingStatus').value ? this.formPartC.get('FatherzLivingStatus').value : 0,
      FathersOccupation: this.formPartC.get('FatherzOccupation').value ? this.formPartC.get('FatherzOccupation').value : 'empty',
      FatherPlaceOfResidenceCountry: this.formPartC.get('FatherzCountryOfResidence').value ? this.FatherzCountryOfResidenceCountryID : 0,
      FatherPlaceOfResidenceDistrict: this.formPartC.get('FatherzDistrictOfResidence').value ? this.FatherzDistrictOfResidenceDistrictID : 0,
      FatherPlaceOfResidenceCounty: this.formPartC.get('FatherzCountyOfResidence').value ? this.FatherzCountyOfResidenceCountyID : 0,
      FatherPlaceOfResidenceSubcounty: this.formPartC.get('FatherzSubCountyOfResidence').value ? this.FatherzSubCountyOfResidenceSubCountyID : 0,
      FatherPlaceOfResidenceParish: this.formPartC.get('FatherzParishOfResidence').value ? this.formPartC.get('FatherzParishOfResidence').value : 'empty',
      FatherPlaceOfResidenceVillage: this.formPartC.get('FatherzVillageOfResidence').value ? this.formPartC.get('FatherzVillageOfResidence').value : 'empty',
      FatherPlaceOfResidenceStreet: this.formPartC.get('FatherzStreetOfResidence').value ? this.formPartC.get('FatherzStreetOfResidence').value : 'empty',
      FatherPlaceOfResidencePlot: this.formPartC.get('FatherzHouseNoOfResidence').value ? this.formPartC.get('FatherzHouseNoOfResidence').value : 'empty',
      FatherPlaceOfOriginCountry: this.formPartC.get('FatherzCountryOfOrigin').value ? this.FatherzCountryOfOriginCountryID : 0,
      FatherPlaceOfOriginDistrict: this.formPartC.get('FatherzDistrictOfOrigin').value ? this.FatherzDistrictOfOriginDistrictID : 0,
      FatherPlaceOfOriginCounty: this.formPartC.get('FatherzCountyOfOrigin').value ? this.FatherzCountyOfOriginCountyID : 0,
      FatherPlaceOfOriginSubcounty: this.formPartC.get('FatherzSubCountyOfOrigin').value ? this.FatherzSubCountyOfOriginSubCountyID : 0,
      FatherPlaceOfOriginParish: this.formPartC.get('FatherzParishOfOrigin').value ? this.formPartC.get('FatherzParishOfOrigin').value : 'empty',
      FatherPlaceOfOriginVillage: this.formPartC.get('FatherzVillageOfOrigin').value ? this.formPartC.get('FatherzVillageOfOrigin').value : 'empty',
      MothersSurname: this.formPartC.get('MotherzSurname').value ? this.formPartC.get('MotherzSurname').value : 'empty',
      MothersGivenName: this.formPartC.get('MotherzGivenName').value ? this.formPartC.get('MotherzGivenName').value : 'empty',
      MothersOtherName: this.formPartC.get('MotherzOtherName').value ? this.formPartC.get('MotherzOtherName').value : 'empty',
      MothersMaidenName: this.formPartC.get('MotherzMaidenName').value ? this.formPartC.get('MotherzMaidenName').value : 'empty',
      MothersPreviousName: this.formPartC.get('MotherzPreviousName').value ? this.formPartC.get('MotherzPreviousName').value : 'empty',
      MothersNIN: this.formPartC.get('MotherzNIN').value ? this.formPartC.get('MotherzNIN').value : 'empty',
      MothersCardNumber: this.formPartC.get('MotherzCardNumber').value ? this.formPartC.get('MotherzCardNumber').value : 'empty',
      MotherCitizenshipType: this.formPartC.get('MotherzCitizenshipType').value ? this.formPartC.get('MotherzCitizenshipType').value : 0,
      MotherCitizenshipCertificateNumber: this.formPartC.get('MotherzCitizenshipCertificateNumber').value ? this.formPartC.get('MotherzCitizenshipCertificateNumber').value : 'empty',
      MotherIfCitizenTypeIsDual: this.formPartC.get('MotherzStateOtherCitizenShip').value ? this.formPartC.get('MotherzStateOtherCitizenShip').value : 'empty',
      MotherLivingStatus: this.formPartC.get('MotherzLivingStatus').value ? this.formPartC.get('MotherzLivingStatus').value : 0,
      MothersOccupation: this.formPartC.get('MotherzOccupation').value ? this.formPartC.get('MotherzOccupation').value : 'empty',
      MotherPlaceOfResidenceCountry: this.formPartC.get('MotherzCountryOfResidence').value ? this.MotherzCountryOfResidenceCountryID : 0,
      MotherPlaceOfResidenceDistrict: this.formPartC.get('MotherzDistrictOfResidence').value ? this.MotherzDistrictOfResidenceDistrictID : 0,
      MotherPlaceOfResidenceCounty: this.formPartC.get('MotherzCountyOfResidence').value ? this.MotherzCountyOfResidenceCountyID : 0,
      MotherPlaceOfResidenceSubcounty: this.formPartC.get('MotherzSubCountyOfResidence').value ? this.MotherzSubCountyOfResidenceSubCountyID : 0,
      MotherPlaceOfResidenceParish: this.formPartC.get('MotherzParishOfResidence').value ? this.formPartC.get('MotherzParishOfResidence').value : 'empty',
      MotherPlaceOfResidenceVillage: this.formPartC.get('MotherzVillageOfResidence').value ? this.formPartC.get('MotherzVillageOfResidence').value : 'empty',
      MotherPlaceOfResidenceStreet: this.formPartC.get('MotherzStreetOfResidence').value ? this.formPartC.get('MotherzStreetOfResidence').value : 'empty',
      MotherPlaceOfResidencePlot: this.formPartC.get('MotherzHouseNoOfResidence').value ? this.formPartC.get('MotherzHouseNoOfResidence').value : 'empty',
      MotherPlaceOfOriginCountry: this.formPartC.get('MotherzCountryOfOrigin').value ? this.MotherzCountryOfOriginCountryID : 0,
      MotherPlaceOfOriginDistrict: this.formPartC.get('MotherzDistrictOfOrigin').value ? this.MotherzDistrictOfOriginDistrictID : 0,
      MotherPlaceOfOriginCounty: this.formPartC.get('MotherzCountyOfOrigin').value ? this.MotherzCountyOfOriginCountyID : 0,
      MotherPlaceOfOriginSubcounty: this.formPartC.get('MotherzSubCountyOfOrigin').value ? this.MotherzSubCountyOfOriginSubCountyID : 0,
      MotherPlaceOfOriginParish: this.formPartC.get('MotherzParishOfOrigin').value ? this.formPartC.get('MotherzParishOfOrigin').value : 'empty',
      MotherPlaceOfOriginVillage: this.formPartC.get('MotherzVillageOfOrigin').value ? this.formPartC.get('MotherzVillageOfOrigin').value : 'empty',
      GuardiansSurname: this.formPartC.get('GuardianzSurname').value ? this.formPartC.get('GuardianzSurname').value : 'empty',
      GuardiansGivenName: this.formPartC.get('GuardianzGivenName').value ? this.formPartC.get('GuardianzGivenName').value : 'empty',
      GuardiansOtherName: this.formPartC.get('GuardianzOtherName').value ? this.formPartC.get('GuardianzOtherName').value : 'empty',
      GuardiansOccupation: this.formPartC.get('GuardianzOccupation').value ? this.formPartC.get('GuardianzOccupation').value : 'empty',
      GuardiansPassportNumber: this.formPartC.get('GuardianzPassportNumber').value ? this.formPartC.get('GuardianzPassportNumber').value : 'empty',
      GuardiansNIN: this.formPartC.get('GuardianzNIN').value ? this.formPartC.get('GuardianzNIN').value : 'empty',
      GuardiansAIN: this.formPartC.get('GuardianzAIN').value ? this.formPartC.get('GuardianzAIN').value : 'empty',
      GuardiansCardNumber: this.formPartC.get('GuardianzCardNumber').value ? this.formPartC.get('GuardianzCardNumber').value : 'empty',
      GuardianCitizenshipType: this.formPartC.get('GuardianzCitizenshipType').value ? this.formPartC.get('GuardianzCitizenshipType').value : 0,
      GuardianCitizenshipCertificateNumber: this.formPartC.get('GuardianzCitizenshipCertificateNumber').value ? this.formPartC.get('GuardianzCitizenshipCertificateNumber').value : 'empty',
      GuardianIfCitizenTypeIsDual: this.formPartC.get('GuardianzStateOtherCitizenShip').value ? this.formPartC.get('GuardianzStateOtherCitizenShip').value : 'empty',
      GuardianPlaceOfResidenceCountry: this.formPartC.get('GuardianzCountryOfResidence').value ? this.GuardianzCountryOfResidenceCountryID : 0,
      GuardianPlaceOfResidenceDistrict: this.formPartC.get('GuardianzDistrictOfResidence').value ? this.GuardianzDistrictOfResidenceDistrictID : 0,
      GuardianPlaceOfResidenceCounty: this.formPartC.get('GuardianzCountyOfResidence').value ? this.GuardianzCountyOfResidenceCountyID: 0,
      GuardianPlaceOfResidenceSubcounty: this.formPartC.get('GuardianzSubCountyOfResidence').value ? this.GuardianzSubCountyOfResidenceSubCountyID : 0,
      GuardianPlaceOfResidenceParish: this.formPartC.get('GuardianzParishOfResidence').value ? this.formPartC.get('GuardianzParishOfResidence').value : 'empty',
      GuardianPlaceOfResidenceVillage: this.formPartC.get('GuardianzVillageOfResidence').value ? this.formPartC.get('GuardianzVillageOfResidence').value : 'empty',
      GuardianPlaceOfResidenceStreet: this.formPartC.get('GuardianzStreetOfResidence').value ? this.formPartC.get('GuardianzStreetOfResidence').value : 'empty',
      GuardianPlaceOfResidencePlot: this.formPartC.get('GuardianzHouseNoOfResidence').value ? this.formPartC.get('GuardianzHouseNoOfResidence').value : 'empty',
      DeclarationBox: this.formPartE.get('DeclarationCheckbox').value ? true : false,
      DeclarantName: this.formPartE.get('DeclarationName').value ? this.formPartE.get('DeclarationName').value : 'empty',
      DateOfDeclaration: this.formPartE.get('DeclarationDate').value ? this.formPartE.get('DeclarationDate').value : ' ',
      DeclarantSurname: this.formPartE.get('ApplicantSurname').value ? this.formPartE.get('ApplicantSurname').value : 'empty',
      DeclarantGivenName: this.formPartE.get('ApplicantGivenName').value ? this.formPartE.get('ApplicantGivenName').value : 'empty',
      DeclarantOtherName: this.formPartE.get('ApplicantOtherName').value ? this.formPartE.get('ApplicantOtherName').value : 'empty',
      DeclarantMaidenName: this.formPartE.get('ApplicantMaidenName').value ? this.formPartE.get('ApplicantMaidenName').value : 'empty',
      DeclarantPreviousName: this.formPartE.get('ApplicantPreviousName').value ? this.formPartE.get('ApplicantPreviousName').value : 'empty',
      DeclarantNationality: this.formPartE.get('ApplicantNationality').value ? this.formPartE.get('ApplicantNationality').value : 'empty',
      DeclarantResidenceStatus: this.formPartE.get('ApplicantResidenceStatus').value ? this.formPartE.get('ApplicantResidenceStatus').value : 'empty',
      ApplicantSupportDocuments: this.formPartE.get('ApplicantSupportDocuments').value ? this.formPartE.get('ApplicantSupportDocuments').value : 'empty',
      DeclarantNIN: this.formPartE.get('ApplicantNIN').value ? this.formPartE.get('ApplicantNIN').value : 'empty',
      DeclarantAIN: this.formPartE.get('ApplicantAIN').value ? this.formPartE.get('ApplicantAIN').value : 'empty',
      DeclarantSex: this.formPartE.get('ApplicantSex').value ? this.formPartE.get('ApplicantSex').value : 'empty',
      DeclarantDateOfBirth: this.formPartE.get('ApplicantDateOfBirth').value ? this.formPartE.get('ApplicantDateOfBirth').value : ' ',
      DeclarantRole: this.formPartE.get('ApplicantRole').value ? this.formPartE.get('ApplicantRole').value : 'empty',
      DeclarantRoleOtherSpecify: this.formPartE.get('ApplicantRoleOtherSpecify').value ? this.formPartE.get('ApplicantRoleOtherSpecify').value : 'empty',
      DeclarantSchoolName: this.formPartE.get('ApplicantSchoolName').value ? this.formPartE.get('ApplicantSchoolName').value : 'empty',
    }

    return data;
  }    

  onSaveDraft(): void {    
    this.processing = true;

    this.formPartA.disable();
    this.formPartB.disable();
    this.formPartC.disable();
    this.formPartE.disable();

    this.httpSubscription = this.http.post<ApiPayload>(this.endpoints.form_3_nin, this.getFormData())
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.service.openSnackBar(response.message + 'Draft Reference Number:' + response.data, 'success-lg');

      this.formPartA.enable();
      this.formPartB.enable();
      this.formPartC.enable();
      this.formPartE.enable();

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.formPartA.enable();
      this.formPartB.enable();
      this.formPartC.enable();
      this.formPartE.enable();      
      this.service.determineErrorResponse(error);
    });       
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

    if (this.dialogRef) { this.dialogRef.close(); }
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }  
}
