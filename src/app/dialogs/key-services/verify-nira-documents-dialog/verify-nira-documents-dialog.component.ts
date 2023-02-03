import { AfterContentInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { DatePipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ApiPayload, KeyServiceDocument } from 'src/app/services/api.model';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { catchError, endWith, map, startWith } from 'rxjs/operators';
import * as html2pdf from 'html2pdf.js';

export interface KeyServiceDocumentDetail {
  ClientName?: string;
  Service?: string;
  DateOfService?: Date;
  Organisation?: string;
  Office?: string;
  Location?: string;
  Surname?: string;
  GivenName?: string;
  OtherName?: string;
  DateOfBirth?: Date;
  DateOfDeath?: Date;
  Status?: string;
}

@Component({
  selector: 'app-verify-nira-documents-dialog',
  templateUrl: './verify-nira-documents-dialog.component.html',
  styleUrls: ['./verify-nira-documents-dialog.component.scss']
})
export class VerifyNiraDocumentsDialogComponent implements OnInit, AfterContentInit {

  processing = false;
  isLinear = true;
  selectedIndex = 0;
  completed = false;
  httpSubscription: Subscription;
  isValid = false;
  ErrorMessage = null;
  documents: KeyServiceDocument[] = [];
  filteredDocuments: Observable<KeyServiceDocument[]>;
  DocumentID = 0;
  DocumentCode = null;
  documentInformation: KeyServiceDocumentDetail | null;

  form: FormGroup;

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { verify: boolean; ReferenceNo: string; NIN: string; Service: string; },
    private dialogRef: MatDialogRef<VerifyNiraDocumentsDialogComponent>,    
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder,
    private endpoints: ApiEndpointsService,
    private changeDetector: ChangeDetectorRef,
    private datePipe: DatePipe,
  ) {
    // console.log('nin:', data);
    this.selectedIndex = this.data ? 1 : 0;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      Document: new FormControl('', [
        Validators.required,
      ]),
      TrackingNumber: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]+$/)
      ]),
      NIN: new FormControl('', [
        Validators.maxLength(14),
        Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(M|F|X)[0-9a-zA-Z]{12}$/),
        // Validators.pattern(/^(C|R|N|P)(M|F|X)[0-9a-zA-Z]{12}$/)
      ]),
      Surname: new FormControl('', [
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z]+$/)
      ]),
      Date: new FormControl(''),
    });   
    
    this.form.get('Document').valueChanges.subscribe((value) => {
      this.DocumentID = null;

      setTimeout(() => {
        /* Clear all unwanted validations */
        this.clearValidation();

        if (this.DocumentID === 1) {

          console.log('confirmation of information document selected....');

          /* Set the wanted Validation */
          this.form.get('TrackingNumber').setValidators([
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]+$/)            
          ]);

          this.form.get('NIN').setValidators([
            Validators.required,
            Validators.maxLength(14),
            Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(M|F|X)[0-9a-zA-Z]{12}$/),
          ]);

        }else if (this.DocumentID === 2 || this.DocumentID === 3) {
          console.log('birth or death certificate selected');

          /* Set the wanted Validation */
          this.form.get('TrackingNumber').setValidators([
            Validators.required,
            Validators.maxLength(15),
            Validators.pattern(/^[0-9]{8}[\-]{1}[0-9]{2,6}$/)            
          ]);

          this.form.get('Surname').setValidators([
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z]+$/)
          ]);   

          this.form.get('Date').setValidators([
            Validators.required,
          ]);    

        } else {
          this.form.reset();
        }

        this.updateValidity();

      });
    });    
  }

  ngAfterContentInit(): void {
    this.onFetch(); 

    if (this.data) {
      this.selectedIndex = 1;
      this.isLinear = false;
            
      let documentName = null;

      this.documents.filter((item) => {
        documentName = item.DocumentCode === this.data.Service ? item.Document : documentName;
      });

      this.form.disable();

      this.form.patchValue({
        'Document': documentName,
        'TrackingNumber': this.data.ReferenceNo,
        'NIN': this.data.NIN
      });
      this.onCheckDocument();
    } 

  }

  clearValidation(): void {
    this.form.get('TrackingNumber').clearValidators(); 
    this.form.get('TrackingNumber').reset();    
    this.form.get('NIN').clearValidators(); 
    this.form.get('NIN').reset();
    this.form.get('Surname').clearValidators(); 
    this.form.get('Surname').reset();
    this.form.get('Date').clearValidators(); 
    this.form.get('Date').reset();
  }

  updateValidity():void {
    this.form.controls['TrackingNumber'].updateValueAndValidity();
    this.form.controls['NIN'].updateValueAndValidity();
    this.form.controls['Surname'].updateValueAndValidity();
    this.form.controls['Date'].updateValueAndValidity();
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  getDocumentErrorMessage() {
    return this.form.get('Document').hasError('required') ? 'Please enter a value' :
    this.form.get('Document').hasError('maxlength')
    || this.form.get('Document').hasError('pattern') ? 'Not a valid' : '';
  }

  getTrackingNumberErrorMessage() {
    return this.form.get('TrackingNumber').hasError('required') ? 'Please enter a value' :
    this.form.get('TrackingNumber').hasError('maxlength')
    || this.form.get('TrackingNumber').hasError('pattern') ? 'Not a valid' : '';
  }

  getNINErrorMessage() {
    return this.form.get('NIN').hasError('required') ? 'Please enter a value' :
    this.form.get('NIN').hasError('maxlength')
    || this.form.get('NIN').hasError('pattern') ? 'Not a valid' : '';
  }  

  getSurnameErrorMessage() {
    return this.form.get('Surname').hasError('required') ? 'Please enter a value' :
    this.form.get('Surname').hasError('maxlength')
    || this.form.get('Surname').hasError('pattern') ? 'Not a valid' : '';
  }  

  private _filterDocuments(value: string): KeyServiceDocument[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.documents.filter(option => option.Document.toLowerCase().includes(filterValue));
  }  

  private onFetch(): void {
    this.documents = [
      {
        DocumentID: 1,
        DocumentCode: 'coi',
        Document: 'Confirmation of Information',
      },
      {
        DocumentID: 2,
        DocumentCode: 'bcert',
        Document: 'Birth Certificate',
      },
      {
        DocumentID: 3,
        DocumentCode: 'dcert',
        Document: 'Death Certificate',
      },
      // {
      //   DocumentID: 4,
      //   DocumentCode: 'ninslip',
      //   Document: 'NIN Slip',
      // },
    ];

    this.filteredDocuments = this.form.get('Document').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterDocuments(value))
    );       
  }

  onCheckDocument(): void {
    
    if (this.DocumentID === 1 || this.data) {
      this.onVerifyConfirmationOfInformation();
    } else if (this.DocumentID === 2) {
      this.onVerifyBirthCertificate();
    } else if (this.DocumentID === 3) {
      this.onVerifyDeathCertificate();
    }

  }

  private onVerifyConfirmationOfInformation(): void {
    this.processing = true;

    const data = {
      DocumentID: this.data ? 1: this.DocumentID,
      DocumentCode: this.data ? this.data.Service : this.DocumentCode,
      RefNo: this.data ? this.data.ReferenceNo : this.form.get('TrackingNumber').value,
      NIN: this.data && this.data.NIN ? this.data.NIN : this.form.get('NIN').value
    }

    this.http.post<ApiPayload>(this.endpoints.check_document_status, data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      if (response.code === 200) {
        
        this.isValid = response.data.IsValid;
  
        this.documentInformation = {
          ClientName: response.data.ClientName,
          Organisation: response.data.Organisation,
          Office: response.data.Office,
          Location: response.data.Location,
          DateOfService: response.data.DateOfService,
        }

      } else {
        this.isValid = false;
        this.documentInformation = null;
      }

      if (!this.data) {
        this.stepper.next();
      }

      this.processing = false;
      this.changeDetector.markForCheck();

    }, (error) => {
      this.processing = false;
      
      this.isValid = false;

      this.documentInformation = null;

      this.changeDetector.detectChanges();

      this.service.determineErrorResponse(error);
    });   
  }

  private onVerifyBirthCertificate(): void {
    this.processing = true;

    const data = {
      RefNo: this.form.get('TrackingNumber').value,
      Surname: this.form.get('Surname').value,
      Date: this.datePipe.transform(this.form.get('Date').value, 'yyyy-MM-dd'),
    }

    this.http.post<ApiPayload>(this.endpoints.check_birth_certificate_status, data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      if (response.code === 200) {
        
        this.isValid = true;
  
        this.documentInformation = {
          Surname: response.data.surname,
          GivenName: response.data.given_name,
          OtherName: response.data.other_names,
          Service: 'Birth Certificate',
          DateOfBirth: new Date(response.data.date_of_birth),
          Status: response.data.status
        }

      } else {
        this.isValid = false;
        this.documentInformation = null;
      }

      this.stepper.next();
      this.processing = false;
      this.changeDetector.markForCheck();

    }, (error) => {
      this.processing = false;
      
      this.isValid = false;

      this.documentInformation = null;

      this.stepper.next();

      this.changeDetector.detectChanges();
    });   
  }

  private onVerifyDeathCertificate(): void {
    this.processing = true;

    const data = {
      RefNo: this.form.get('TrackingNumber').value,
      Surname: this.form.get('Surname').value,
      Date: this.datePipe.transform(this.form.get('Date').value, 'yyyy-MM-dd'),
    }

    this.http.post<ApiPayload>(this.endpoints.check_death_certificate_status, data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      if (response.code === 200) {
        
        this.isValid = true;
  
        this.documentInformation = {
          Surname: response.data.surname,
          GivenName: response.data.given_name,
          OtherName: response.data.other_names,
          Service: 'Death Certificate',
          DateOfDeath: new Date(response.data.date_of_death),
          Status: response.data.status
        }
      } else {
        this.isValid = false;
        this.documentInformation = null;
      }

      this.stepper.next();
      this.processing = false;
      this.changeDetector.markForCheck();

    }, (error) => {
      this.processing = false;
      
      this.isValid = false;

      this.documentInformation = null;

      this.stepper.next();

      this.changeDetector.detectChanges();
    });   
  }

  getDateSuperscript(date: Date): string {
    return this.service.getDateSuperscript(date);
  }

  ngOnDestroy(): void {
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }  
}

