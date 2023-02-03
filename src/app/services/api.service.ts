import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { TypeOfMarriage, CitizenshipType, UserData, Country, District, County, SubCounty, HealthFacility, CauseOfDeath, Occupation, Parish, Village, ROPForm3Category, ApiPayload, NINDetail, Process } from './api.model';
import { ApiEndpointsService } from './api-endpoints.service';
import { catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  pageTabTitle = new Subject();
  overflow = new Subject();
  loading = new Subject();
  processingBar = new Subject();
  scrollingUp = new Subject();
  isLoggedIn = new Subject();
  processing = new Subject<Process>();

  private ropForm3Categories: ROPForm3Category[] = [
    {
      ID: 1,
      Name: 'Change of Name by Omitting or adopting a New Name',
      Attachments: [
        {
          Required: true,
          Name: 'Notice of Intention to change name in Gazette',
        },        
        {
          Required: true,
          Name: 'Deed Poll certified by URSB',
        },
        {
          Required: true,
          Name: 'Marriage Certificate (BR1)',
        },
        {
          Required: true,
          Name: 'Certificate copy of decree absolute',
        },
      ]
    },
    {
      ID: 2,
      Name: 'Change of Name by adding Name already appearing on Document',
      Attachments: [
        {
          Required: true,
          Name: 'Statutory declaration registered by URSB',
        },
        {
          Required: true,
          Name: 'Birth Certificate issued before 1st January 2016 certified by URSB OR Academic Document Issued before 2014 or Passport issued before 2014',
        },
      ]
    },
    {
      ID: 3,
      Name: 'Complete Change of Name',
      Attachments: [
        {
          Required: true,
          Name: 'Deed Poll certified by URSB',
        },        
        {
          Required: true,
          Name: 'Notice of Intention to change name in Gazette',
        },        
        {
          Required: false,
          Name: 'Academic Document Issued before 2014 or Previous Documents especially academic before 2014 Or Certificate of Good Conduct from Interpol or Police Clearance form',
        },
      ]
    },
    {
      ID: 4,
      Name: 'Change of Name by Dropping Nicknames, Pet Names and/or Titles',
      Attachments: [
        {
          Required: true,
          Name: 'Statutory declaration registered by URSB',
        },
        {
          Required: false,
          Name: 'Academic Document, Birth Certificate',
        },
      ]
    },
    {
      ID: 5,
      Name: 'Inclusion or Deletion of Maiden Name',
      Attachments: [
        {
          Required: true,
          Name: 'Statutory declaration registered by URSB',
        },
        {
          Required: false,
          Name: 'Academic Document or Birth Certificate or Passport',
        },
      ]
    },
    {
      ID: 6,
      Name: 'Change of Order of Names',
      Attachments: [
        {
          Required: true,
          Name: 'Statutory declaration registered by URSB',
        },
        {
          Required: false,
          Name: 'Academic Document or Birth Certificate or Passport',
        },
      ]      
    },
    {
      ID: 7,
      Name: 'Clarification of Initials (add or remove)',
      Attachments: [
        {
          Required: true,
          Name: 'Statutory declaration registered by URSB',
        },
        {
          Required: false,
          Name: 'Academic Document or Birth Certificate or Passport',
        },
      ]      
    },
    {
      ID: 8,
      Name: 'Change of Date or Month of Birth',
      Attachments: [
        {
          Required: true,
          Name: 'Statutory declaration registered by URSB',
        },
        {
          Required: false,
          Name: 'Academic Document Issued before 2014 or Previous Documents especially academic before 2014',
        },
      ]      
    },
    {
      ID: 9,
      Name: 'Change of Place of Birth',
      Attachments: [
        {
          Required: true,
          Name: 'Statutory declaration registered by URSB',
        },
        {
          Required: false,
          Name: 'Academic Document or Birth Certificate or Passport',
        },
      ]      
    },
    {
      ID: 10,
      Name: 'Change of Year of Birth',
      Attachments: [
        {
          Required: true,
          Name: 'Statutory declaration registered by URSB',
        },
        {
          Required: true,
          Name: 'Report from DGAL',
        },
        {
          Required: false,
          Name: 'Academic Document issued OR Birth Certificate Or Baptism Card',
        },
      ]      
    },
    {
      ID: 11,
      Name: 'Change of Sex',
      Attachments: [
        {
          Required: true,
          Name: 'Statutory declaration registered by URSB',
        },
        {
          Required: true,
          Name: 'Certified Medical Doctor',
        },
      ]  
    },
  ];

  teamMgtColors: { backgroundColor: string, textColor: string }[] = [
    {
      backgroundColor: '#fec731',
      textColor: '#3f3f3f'
    },
    {
      backgroundColor: '#5d5e60',
      textColor: '#fff'
    },
    {
      backgroundColor: '#6dbd45',
      textColor: '#fff'  
    },
    {
      backgroundColor: '#e7e7ec',
      textColor: '#5d5e60'  
    },
    {
      backgroundColor: '#e7e7ec',
      textColor: '#5d5e60'
    },
    {
      backgroundColor: '#6dbd45',
      textColor: '#fff'
    },
    {
      backgroundColor: '#5d5e60',
      textColor: '#fff'  
    },
    {
      backgroundColor: '#fec731',
      textColor: '#5d5e60'  
    },
    {
      backgroundColor: '#fec731',
      textColor: '#5d5e60'
    },
    {
      backgroundColor: '#6cbc44',
      textColor: '#fff'  
    },
  ];

  boardOfDirectorsColors: { backgroundColor: string, textColor: string }[] = [
    {
      backgroundColor: '#fec731',
      textColor: '#3f3f3f'
    },
    {
      backgroundColor: '#5d5e60',
      textColor: '#fff'
    },
    {
      backgroundColor: '#6dbd45',
      textColor: '#fff'  
    },
    {
      backgroundColor: '#6dbd45',
      textColor: '#fff'  
    },
    {
      backgroundColor: '#fec731',
      textColor: '#3f3f3f'
    },
    {
      backgroundColor: '#5d5e60',
      textColor: '#fff'
    },
    {
      backgroundColor: '#6dbd45',
      textColor: '#fff'  
    }
  ];

  slideShowClasses = ['blind', 'directionBottom'];

  private typesOfMarriage: TypeOfMarriage[] = [
    {
      TypeOfMarriageID: 1,
      TypeOfMarriageName: 'Civil'
    },
    {
      TypeOfMarriageID: 2,
      TypeOfMarriageName: 'Religious'
    },
    {
      TypeOfMarriageID: 3,
      TypeOfMarriageName: 'Cultural'
    },
    {
      TypeOfMarriageID: 4,
      TypeOfMarriageName: 'Customary'
    },
  ]

  private citizenshipTypes: CitizenshipType[] = [
    {
      CitizenshipTypeID: 1,
      CitizenshipTypeName: 'By Birth'
    },
    {
      CitizenshipTypeID: 2,
      CitizenshipTypeName: 'By Registration'
    },
    {
      CitizenshipTypeID: 3,
      CitizenshipTypeName: 'By Naturalization'
    },
    {
      CitizenshipTypeID: 4,
      CitizenshipTypeName: 'Dual Citizenship'
    },
    {
      CitizenshipTypeID: 4,
      CitizenshipTypeName: 'Citizenship acquired before 1995 Constitution other than the above stated'
    },
  ]

  constructor(
    private router: Router,
    private platform: Platform,
    private snackBar: MatSnackBar,
    private pageTitle: Title,
    private http: HttpClient,
    private endpoints: ApiEndpointsService,
    private datePipe: DatePipe
  ) {
  }

  get TypesOfMarriage(): TypeOfMarriage[] {
    return this.typesOfMarriage;
  }

  get CitizenshipTypes(): CitizenshipType[] {
    return this.citizenshipTypes;
  }

  get ROPForm3Categories(): ROPForm3Category[] {
    return this.ropForm3Categories
  }

  isAndroidOrIOS(): boolean {
    // return this.platform.ANDROID || this.platform.IOS || this.platform.WEBKIT ? true : false;
    return this.platform.ANDROID || this.platform.IOS ? true : false;
  }

  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ? true : false; 
  }

  createConfig(message: string): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.duration = 2000;
    config.panelClass = ['snackBar-cust'];
    config.data = message;
    return config;
  }

  createContributionsConfig(): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.duration = 4000;
    config.panelClass = ['snackBar-cust'];
    return config;
  }

  createErrorConfig(message: string): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.duration = 4000;
    config.panelClass = ['snackBar-err-cust'];
    config.data = message;
    return config;
  }

  createNuetralConfig(message: string): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.duration = 2000;
    config.horizontalPosition = 'right';
    config.panelClass = ['snackBar-nuet-cust'];
    config.data = message;
    return config;
  }

  createProcessingSnackbarConfig(): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.panelClass = ['mat-snack-bar-container-processing'];
    return config;
  }

  createConfigSucWithLong(message: string): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.panelClass = ['snackBar-cust'];
    config.duration = 30000;
    config.data = message;
    return config;
  }

  createConfigErrLong(message: string): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.panelClass = ['snackBar-err-cust'];
    config.duration = 60000;
    config.data = message;
    return config;
  }

  openSnackBar(message: string, type: string): void {
    let config: MatSnackBarConfig<any>;

    if (type === 'success') {
      config = this.createConfig(message);
    } else if (type === 'error') {
      config = this.createErrorConfig(message);
    } else if (type === 'nuetral') {
      config = this.createNuetralConfig(message);
    } else if (type === 'success-lg') {
      config = this.createConfigSucWithLong(message);
    } else if (type === 'error-lg') {
      config = this.createConfigErrLong(message);
    }

    this.snackBar.openFromComponent(SnackbarComponent, config);
  }

  handleError(error: HttpErrorResponse) {    
    return throwError({
      error: error.status >= 500 || error.status > 400 ? 'Server error. Please try again later.' : 
             error.status !== 0 ? error.error : "Please check your internet connection and try again."
    });
  }

  determineErrorResponse(error: {error?: any}, code?: number) {
    if (error === null) {
      this.openSnackBar(error !== null ? error.error : '', 'error');
      this.router.navigate(['/']);
    } else {
      this.openSnackBar(error.error.message ? error.error.message : error.error, 'error-lg');
    }
  }  

  scollToTop(top?: number): void {
    const pageWrapper = document.getElementById("main-content-wrapper") as HTMLElement;

    pageWrapper.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: top ? top : 0
    })
  }

  updatePageTitle(title: string): void {
    this.pageTitle.setTitle(title + ' - National Identification & Registration Authority');
  }

  getSlideShowClass(index: number) {
    const even: number = index % 2;
    return this.slideShowClasses[index % 2 ? 0 : 1];
  }

  getCMSMediaProxy(url: string) {
    const media = url.split('wp-content/uploads');
    const newUrl = environment.cmsMediaProxy + media[1]
    return newUrl;
  }

  _filterCountry(value: string, Countries: Country[]): Country[] {
    const filterValue = value ? value.toLowerCase() : '';
    return Countries.filter(option => option.Nationality.toLowerCase().includes(filterValue));
  }    

  _filterDistrict(value: string, Districts: District[]): District[] {
    const filterValue = value ? value.toLowerCase() : '';
    return Districts.filter(option => option.DistrictName.toLowerCase().includes(filterValue));
  }  

  _filterCounty(value: string, Counties: County[]): County[] {
    const filterValue = value ? value.toLowerCase() : '';
    return Counties.filter(option => option.CountyName.toLowerCase().includes(filterValue));
  }  

  _filterSubCounty(value: string, SubCounties: SubCounty[]): SubCounty[] {
    const filterValue = value ? value.toLowerCase() : '';
    return SubCounties.filter(option => option.SubCountyName.toLowerCase().includes(filterValue));
  }  

  _filterParish(value: string, Parishes: Parish[]): Parish[] {
    const filterValue = value ? value.toLowerCase() : '';
    return Parishes.filter(option => option.ParishName.toLowerCase().includes(filterValue));
  }  

  _filterVillage(value: string, Villages: Village[]): Village[] {
    const filterValue = value ? value.toLowerCase() : '';
    return Villages.filter(option => option.VillageName.toLowerCase().includes(filterValue));
  }    

  _filterHealthFacility(value: string, healthFacilities: HealthFacility[]): HealthFacility[] {
    const filterValue = value ? value.toLowerCase() : '';
    return healthFacilities.filter(option => option.Name.toLowerCase().includes(filterValue));
  }  

  _filterCauseOfDeath(value: string, CausesOfDeath: CauseOfDeath[]): CauseOfDeath[] {
    const filterValue = value ? value.toLowerCase() : '';
    return CausesOfDeath.filter(option => option.Cause.toLowerCase().includes(filterValue));
  }  

  _filterOccupation(value: string, Occupations: Occupation[]): Occupation[] {
    const filterValue = value ? value.toLowerCase() : '';
    return Occupations.filter(option => option.Occupation.toLowerCase().includes(filterValue));
  }     
 
  getNumberOfDays(date: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const today = new Date().getTime();
    const dob = new Date(date).getTime();

    return Math.round(Math.abs((today - dob) / oneDay));       
  }

  onCheckNIN(NIN: string): void {
    this.processing.next({
      state: true,
      data: null
    });

    const data = {
      NIN: NIN
    }

    this.http.post<ApiPayload>(this.endpoints.check_nin, data)
    .pipe(catchError(this.handleError))
    .subscribe((response) => {            
      if (response.code !== 200) {
        this.openSnackBar(response.message, 'error-lg');
      }
      
      this.processing.next({
        state: false,
        data: response.data
      });

    }, (error) => {
      this.processing.next({
        state: false,
        data: null
      });
      this.determineErrorResponse(error);
    }); 
  }

  getDateSuperscript(date: Date): string {
    let day = parseInt(this.datePipe.transform(date, 'd'));

    if (day === 1 || day === 21) {
      return 'st';
    } else if (day === 2 || day === 22) {
      return 'nd';
    } else if (day === 3 || day === 23) {
      return 'rd';
    } else {
      return 'th';
    }
  }  
}
