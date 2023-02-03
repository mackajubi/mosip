import { AfterContentInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { DatePipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ApiPayload, Organisation } from 'src/app/services/api.model';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { catchError, endWith, map, startWith } from 'rxjs/operators';
import * as html2pdf from 'html2pdf.js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirmation-of-information-dialog',
  templateUrl: './confirmation-of-information-dialog.component.html',
  styleUrls: ['./confirmation-of-information-dialog.component.scss']
})
export class ConfirmationOfInformationDialogComponent implements OnInit {

  processing = false;
  isLinear = true;
  httpSubscription: Subscription;
  isValid = false;
  showPreview = false;
  downloadLetter = false;
  printReceipt = false;
  organisations: Organisation[] = [];
  filteredOrganisations: Observable<Organisation[]>;
  today =  new Date();
  selectedIndex = 0;
  found = false;
  NINDetails: { NIN: string; Name: string, IsValid: boolean, DOB: string } | null;
  PRNDetails: { PRN: number; Amount: number, Currency: string, ExpiryDate: string } | null;
  PRNErrorMessage = null;
  referenceNumber = null;
  QRCodeData = null;

  formNIN: FormGroup;
  formPRN: FormGroup;
  formTwo: FormGroup;
  formThree: FormGroup;

  OrganisationID = 0;

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationOfInformationDialogComponent>,
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder,
    private endpoints: ApiEndpointsService,
    private datePipe: DatePipe,
    private changeDetector: ChangeDetectorRef
  ) {
    // this.referenceNumber = 'CL/04/07/22/2605'
    // this.QRCodeData = 'http://localhost:4200/home?service=coi&data=' + this.referenceNumber;      
  }

  ngOnInit(): void {
    this.formNIN = this.formBuilder.group({
      NIN: new FormControl('', [
        Validators.required,
        Validators.maxLength(14),
        Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(M|F|X)[0-9a-zA-Z]{12}$/)
      ]),      
      TIN: new FormControl('', [
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]{10}$/)
      ]),
    });

    this.formPRN = this.formBuilder.group({
      PRN: new FormControl('', [
        Validators.required,
        Validators.maxLength(13),
        Validators.pattern(/^[0-9]{13}$/)
      ]),
    });

    this.formThree = this.formBuilder.group({
      Organisation: new FormControl('', [
        Validators.required,
      ]),
      OtherOrganisation: new FormControl('', [
        Validators.maxLength(50)     
      ]),
      Office: new FormControl('', [
        Validators.required,   
        Validators.maxLength(50)     
      ]),
      Person: new FormControl('', [
        // Validators.required,    
      ]),
      Location: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)     
      ]),
    });   
    
    this.onFetch();

    // Detect Changes on the NIN Field.
    this.formNIN.get('NIN').valueChanges.subscribe((value) => {
      this.NINDetails = null;
      this.PRNErrorMessage = null;
    });

    // Detect when the print event is finished.
    window.addEventListener('afterprint', (e) => {
      this.selectedIndex = this.printReceipt ? 1 : this.selectedIndex;
      this.printReceipt = false;
    });

    this.formThree.get('Organisation').valueChanges.subscribe((value) => {
      this.OrganisationID = 0;
    });       
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  getNINErrorMessage() {
    return this.formNIN.get('NIN').hasError('required') ? 'Please enter a value' :
    this.formNIN.get('NIN').hasError('maxlength')
    || this.formNIN.get('NIN').hasError('pattern') ? 'Not a valid' : '';
  }

  getTINErrorMessage() {
    return this.formNIN.get('TIN').hasError('required') ? 'Please enter a value' :
    this.formNIN.get('TIN').hasError('maxlength')
    || this.formNIN.get('TIN').hasError('pattern') ? 'Not a valid' : '';
  }

  getPRNErrorMessage() {
    return this.formPRN.get('PRN').hasError('required') ? 'Please enter a value' :
    this.formPRN.get('PRN').hasError('maxlength')
    || this.formPRN.get('PRN').hasError('pattern') ? 'Not a valid' : '';
  }

  getOtherOrganisationErrorMessage() {
    return this.formThree.get('Organisation').hasError('required') ? 'Please enter a value' :
    this.formThree.get('Organisation').hasError('maxlength')  ? 'Not a valid' : '';
  }

  getLocationErrorMessage() {
    return this.formThree.get('Location').hasError('required') ? 'Please enter a value' :
    this.formThree.get('Location').hasError('maxlength') ? 'Not a valid' : '';
  }

  getOfficeErrorMessage() {
    return this.formThree.get('Office').hasError('required') ? 'Please enter a value' :
    this.formThree.get('Office').hasError('maxlength') ? 'Not a valid' : '';
  }

  private _filterOrganisations(value: string): Organisation[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.organisations.filter(option => option.OrganisationName.toLowerCase().includes(filterValue));
  }  

  private onFetch(): void {
    this.processing = true;

    this.http.get<ApiPayload>(this.endpoints.get_all_organisations)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      this.organisations = response.data;

      this.filteredOrganisations = this.formThree.get('Organisation').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterOrganisations(value))
      );  
      
      this.processing = false;

    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });          
  }

  onSelectingOrganisation(organisation: Organisation): void {
    this.formThree.patchValue({
      Office: organisation.Office,
      Person: organisation.Person,
      Location: organisation.Location,
    });

    this.changeDetector.detectChanges();
  }

  getDateSuperscript(): string {
    return this.service.getDateSuperscript(this.today);
  }

  onCheckNIN(): void {
    this.processing = true;

    const data = {
      NIN: this.formNIN.get('NIN').value
    }

    this.processing = true;

    this.http.post<ApiPayload>(this.endpoints.check_nin, data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {      
      this.NINDetails = response.data;

      if (response.code !== 200) {
        this.service.openSnackBar(response.message, 'error-lg');
      }
      
      this.processing = false;

    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });        
  }

  onGeneratePRN(): void {

    const data = {
      TaxHeadCode: "NIRAFEES",
      Name: this.NINDetails.Name,
      NIN: this.NINDetails.NIN,
      TIN: this.formNIN.get('TIN').value
    }

    this.processing = true;
    this.http.post<ApiPayload>(this.endpoints.get_prn, data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      this.PRNDetails = {
        PRN: response.data.PRN,
        Amount: response.data.Amount,
        Currency: response.data.Currency,
        ExpiryDate: response.data.ExpiryDate
      }
      
      this.processing = false;

    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });        
  }

  onCopyToClipBoard(): void {
    document.execCommand("copy");
  }

  onCheckPRNStatus(): void {
    this.PRNErrorMessage = null;

    const data = {
      PRN: this.formPRN.get('PRN').value,
      NIN: this.NINDetails.NIN
    }

    this.processing = true;

    this.http.post<ApiPayload>(this.endpoints.check_prn_status, data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      if (response.code === 200) {

        this.found  = true;
        
        this.stepper.next();
        
      } else {
        this.found  = false;

        this.PRNErrorMessage = response.message;

        this.changeDetector.detectChanges();
      }

      this.processing = false;

    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });        
  }

  onPreview(): void {
    this.showPreview = true;    
  }

  onClosePreview(): void {
    this.selectedIndex = 2;
    this.downloadLetter = false;
    this.showPreview = false;
    this.printReceipt = false;
  }

  onPrintReceipt(): void {
    this.printReceipt = true;

    setTimeout(() =>{
      window.print();
    }, 500);
  }

  onDownloadLetter(): void {
    const data = {
      PRN: this.formPRN.get('PRN').value,
      NIN: this.NINDetails.NIN,
      OrganisationID: this.formThree.get('Organisation').value ? this.OrganisationID : 0,
      OtherOrganisation: this.formThree.get('OtherOrganisation').value,
      Office: this.formThree.get('Office').value,
      Location: this.formThree.get('Location').value,
    }

    this.processing = true;
    this.http.post<ApiPayload>(this.endpoints.download_confirmation_of_info_document, data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      if (response.code === 200) {

        this.referenceNumber = response.data['RefNo'];

        this.downloadLetter = true;

        this.QRCodeData = environment.baseURL + 'home/coi/' + this.referenceNumber + '/' + this.NINDetails.NIN;

        setTimeout(() => {
          this.service.openSnackBar('Downloading. Please wait.', 'nuetral');
    
          const options = {
            filename: (this.found ? '' : 'No' ) + ' Confirmation Of Information.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              backgroundColor: null,
            },
            jspdf: {
              unit: 'in',
              format: 'letter',
              orientation: 'portrait'
            },
            margin: 1,
          };
      
          const content: Element = document.getElementById('letterBodyContainer');
      
          html2pdf()
          .from(content)
          .set(options)
          .save()
          .then((onFulfilled) => {
     
            setTimeout(() => {
              this.downloadLetter = false;
              this.selectedIndex = 0;
              
              this.formNIN.reset();
              this.formPRN.reset();
              this.formTwo.reset();
              this.formThree.reset();
              
              this.service.openSnackBar('Downloaded. Please check in your downloads.', 'success-lg');
              this.changeDetector.detectChanges();
            }, 1000);
    
          }); 
        }, 1000);

      } else {

        this.changeDetector.detectChanges();
      }

      this.processing = false;

    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });  
  }

  ngOnDestroy(): void {
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }  
}

