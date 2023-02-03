import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ApiPayload } from 'src/app/services/api.model';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { catchError } from 'rxjs/operators';
import * as html2pdf from 'html2pdf.js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-print-nin-slip-dialog',
  templateUrl: './print-nin-slip-dialog.component.html',
  styleUrls: ['./print-nin-slip-dialog.component.scss']
})
export class PrintNinSlipDialogComponent implements OnInit {

  processing = false;
  isLinear = true;
  selectedIndex = 0;
  httpSubscription: Subscription;
  today = new Date();
  form: FormGroup;
  formStatus: FormGroup;
  isValid = false;
  ApplicationID = null;
  ChildBioData = false;
  ApplicationStatus: { 
    ApplicationID: string; 
    NIN: string; 
    Surname: string; 
    Givenname: string; 
    Othername: string; 
    DateOfBirth: Date; 
    FullName: string;
    ReferenceNo: string;
    GeneratedOn?: Date;
  } | null;
  printNIN = false;
  QRCodeData = null;
  errorMessage = null;
  processed = false;

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { verify: boolean, ReferenceNo: string },
    private dialogRef: MatDialogRef<PrintNinSlipDialogComponent>,    
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder,
    private endpoints: ApiEndpointsService,
    private changeDetector: ChangeDetectorRef,
    private datePipe: DatePipe,
  ) {
    // this.ApplicationStatus = {
    //   ApplicationID: '10212012JJK', 
    //   NIN: 'CMERFEKRE8989ER',
    //   Surname: 'Kajubi',
    //   Givenname: 'Mark',
    //   Othername: '',
    //   DateOfBirth: new Date('06/03/1993'),
    //   FullName: 'Mark Kajubi',
    //   TrackingNumber: 'NS/11/23/98912'
    // };

    // this.QRCodeData = 'http://localhost:4200/home?service=ninslip&data=' + this.ApplicationStatus.ApplicationID;    
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      ApplicationID: new FormControl('', [
        Validators.maxLength(13),
        Validators.pattern(/^[0-9]{7}[0-9a-zA-Z]{6}$/)
      ]),
      Surname: new FormControl('', [
        Validators.maxLength(20),     
        Validators.pattern(/^[a-zA-Z]+$/)  
      ]), 
      GivenName: new FormControl('', [
        Validators.maxLength(30),     
        Validators.pattern(/^[a-zA-Z ]+$/)  
      ]), 
      ParentType: new FormControl('',), 
      ParentSurname: new FormControl('', [
        Validators.maxLength(20),     
        Validators.pattern(/^[a-zA-Z]+$/)  
      ]), 
      DateOfBirth: new FormControl({value: '', disabled: true}),       
    });  

    this.formStatus = this.formBuilder.group({
      IsValid: new FormControl('', [Validators.required]),   
    });

    this.form.get('ApplicationID').valueChanges.subscribe((value) => {  
      if (value) {
        this.form.get('Surname').reset();
        this.form.get('GivenName').reset();
        this.form.get('DateOfBirth').reset();
        this.form.get('ParentType').reset();
        this.form.get('ParentSurname').reset();
      }    
    });

    this.form.get('Surname').valueChanges.subscribe(() => {
      this._CheckChildBioData();
    });

    this.form.get('GivenName').valueChanges.subscribe(() => {
      this._CheckChildBioData();
    });

    this.form.get('DateOfBirth').valueChanges.subscribe(() => {
      this._CheckChildBioData();
    });

    this.form.get('ParentType').valueChanges.subscribe(() => {
      this._CheckChildBioData();
    });

    this.form.get('ParentSurname').valueChanges.subscribe(() => {
      this._CheckChildBioData();
    });
  }

  ngAfterContentInit(): void {
    if (this.data) {
      // console.log('verify:', this.data);
      this.printNIN = true;
      this.onCheckUserData();
    }    
  }  

  private _CheckChildBioData(): void {
    this.ChildBioData = (this.form.get('Surname').value && this.form.get('GivenName').value && this.form.get('DateOfBirth').value && this.form.get('ParentType').value && this.form.get('ParentSurname').value) ? true : false;
    
    if (this.form.get('Surname').value 
      || this.form.get('GivenName').value 
      || this.form.get('DateOfBirth').value 
      || this.form.get('ParentType').value 
      || this.form.get('ParentSurname').value) {
      this.form.get('ApplicationID').reset();
    }    
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  getApplicationIDErrorMessage() {
    return this.form.get('ApplicationID').hasError('maxlength')
    || this.form.get('ApplicationID').hasError('pattern') ? 'Not a valid Application ID No.' : '';
  }

  getSurnameErrorMessage() {
    return this.form.get('Surname').hasError('maxlength')
    || this.form.get('Surname').hasError('pattern') ? 'Write a correct Name' : '';
  }

  getGivenNameErrorMessage() {
    return this.form.get('GivenName').hasError('maxlength')
    || this.form.get('GivenName').hasError('pattern') ? 'Write a correct Name' : '';
  }

  getParentSurnameErrorMessage() {
    return this.form.get('ParentSurname').hasError('maxlength')
    || this.form.get('ParentSurname').hasError('pattern') ? 'Write a correct Name' : '';
  }

  getSelectErrorMessage() {
    return this.form.get('ParentType').hasError('required') ? 'Please choose one.' : '';
  }

  onCheckUserData(): void {
    // console.log('here... test');
    this.isValid = false;
    this.processed = false;
    this.errorMessage = null;
    this.processing = true;
    this.form.disable();

    let data = null;

    if (this.data) {
      data = 'ReferenceNo='+ this.data.ReferenceNo;
    } else {
      data = 'ApplicationID='+ (this.form.get('ApplicationID').value ? this.form.get('ApplicationID').value : '')
      + '&Surname=' + (this.form.get('Surname').value ? this.form.get('Surname').value : '')
      + '&GivenNames=' + (this.form.get('GivenName').value ? this.form.get('GivenName').value : '')
      + '&DateOfBirth=' + this.datePipe.transform((this.form.get('DateOfBirth').value ? this.form.get('DateOfBirth').value : new Date()), 'yyyy-MM-dd')
      + '&ParentType=' + (this.form.get('ParentType').value ? this.form.get('ParentType').value : '')
      + '&ParentSurname=' + (this.form.get('ParentSurname').value ? this.form.get('ParentSurname').value : '');
    }

    this.http.get<ApiPayload>((this.data ? this.endpoints.nin_slip_verify : this.endpoints.nin_slip) + '?' + data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      // console.log('response:', response);

      this.processed = true;

      if (response.code === 200) {
        this.isValid = true;
  
        this.ApplicationStatus = response.data;
        
        if (!this.data) {
          this.QRCodeData = environment.baseURL + 'home/ninslip/' + this.ApplicationStatus.ReferenceNo;
          this.formStatus.get('IsValid').patchValue('valid');
          this.stepper.next();
        }

      } else {
        this.isValid = false;

        this.errorMessage = response.message;
      }

      this.processing = false;

      this.form.enable();

    }, (error) => {
      this.processing = false;
      this.form.enable();
      this.service.determineErrorResponse(error);
    });   
  }

  getDateSuperscript(date: Date): string {
    return this.service.getDateSuperscript(date);
  }  

  onPrint(): void {
    this.printNIN = true;

    setTimeout(() => {
      this.service.openSnackBar('Downloading. Please wait.', 'nuetral');

      const options = {
        filename: this.ApplicationStatus.FullName + "'s NIN Slip.pdf",
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
          this.QRCodeData = null;

          this.printNIN = false;

          this.form.reset();

          this.selectedIndex = 0;

          this.service.openSnackBar('Downloaded. Please check in your downloads.', 'success-lg');

          this.changeDetector.detectChanges();
        }, 1000);

      }); 
    }, 1000);
  }  

  ngOnDestroy(): void {
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }  
}

