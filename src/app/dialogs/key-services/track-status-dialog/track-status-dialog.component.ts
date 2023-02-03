import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ApiPayload } from 'src/app/services/api.model';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-track-status-dialog',
  templateUrl: './track-status-dialog.component.html',
  styleUrls: ['./track-status-dialog.component.scss']
})
export class TrackStatusDialogComponent implements OnInit {

  processing = false;
  isLinear = true;
  httpSubscription: Subscription;
  applicationIDSub: Subscription;
  formOne: FormGroup;
  formTwo: FormGroup;
  isValid = false;
  ApplicationID = null;
  ApplicationStatus: { ApplicantID: string; ApplicantName: string; ApplicantStatus: string; District: string } | null;
  recaptcha2SiteKey = '6LckeV0dAAAAAFK_G0aV8BVlhFyyNS7yhDYm_Q0j';
  recaptcha2Size = 'Normal';
  recaptcha2Lang = 'en';
  recaptcha2Theme = 'Light';
  recaptcha2Type = 'Image';
  renderRecapture = true;

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  constructor(
    private dialogRef: MatDialogRef<TrackStatusDialogComponent>,    
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder,
    private endpoints: ApiEndpointsService,
  ) {

  }

  ngOnInit(): void {
    this.formOne = this.formBuilder.group({
      ApplicationID: new FormControl('', [
        Validators.required,
        Validators.maxLength(13),
        Validators.pattern(/^[0-9]{7}[0-9a-zA-Z]{6}$/)
      ]),
      recaptchaReactive: new FormControl('', [
        Validators.required
      ]),     
    });

    this.formTwo = this.formBuilder.group({
      DigitOne: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)
      ]),
      DigitTwo: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)        
      ]),
      DigitThree: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)        
      ]),
      DigitFour: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)
      ]),
      DigitFive: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)        
      ]),
      DigitSix: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)        
      ]),
    });   
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  getApplicationIDErrorMessage() {
    return this.formOne.get('ApplicationID').hasError('required') ? 'Please enter a value' :
    this.formOne.get('ApplicationID').hasError('maxlength')
    || this.formOne.get('ApplicationID').hasError('pattern') ? 'Not a valid' : '';
  }

  // getTelephoneNumberErrorMessage() {
  //   return this.formOne.get('PhoneNumber').hasError('required') ? 'Please enter your phone number' :
  //   this.formOne.get('PhoneNumber').hasError('minlength')
  //   || this.formOne.get('PhoneNumber').hasError('maxlength')
  //   || this.formOne.get('PhoneNumber').hasError('pattern') ? 'Not a valid mobile number' : '';
  // }

  onCheckApplicationIDNumber(): void {
    this.processing = true;

    const data = {
      ApplicationID: this.formOne.get('ApplicationID').value.toLocaleUpperCase(),
      PhoneNo: '256' + (this.formOne.get('PhoneNumber').value),
    }
    
    this.http.post<ApiPayload>(this.endpoints.get_otp, data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      if (response.code === 200 ) {
        this.formOne.get('apiOTP').patchValue(response.data.OTP);
  
        this.ApplicationID = response.data.ApplicationID;
        
        this.stepper.next();
      } else {
        this.service.openSnackBar(response.message, 'error-lg');
      }

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    }); 
  }

  handleExpire(): void {
    // console.log('expired');
  }

  resolved(captchaResponse: string) { 
    this.formOne.patchValue({
      recaptchaReactive: captchaResponse
    });
  }    

  onPreviousStep(): void {
    this.renderRecapture = false;
    this.formOne.reset();
    this.ApplicationStatus = null;

    setTimeout(() => {
      this.renderRecapture = true;
    }, 200);
  }

  onCheckStatus(): void {
    this.processing = true;

    // const otp = this.formTwo.get('DigitOne').value + this.formTwo.get('DigitTwo').value +
    // this.formTwo.get('DigitThree').value + this.formTwo.get('DigitFour').value +
    // this.formTwo.get('DigitFive').value + this.formTwo.get('DigitSix').value

    // this.isValid = this.formOne.get('apiOTP').value === parseInt(otp, 10);

    // if(this.isValid) {
      
    const data = {
      ApplicationID: this.formOne.get('ApplicationID').value.toLocaleUpperCase(),
      recaptcha: this.formOne.get('recaptchaReactive').value,
    }

    // console.log('onCheckStatus:', data);

    this.http.post<ApiPayload>(this.endpoints.get_application_status, data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      // console.log('response:', response);

      if (response.code === 200) {

        this.ApplicationStatus = response.data;
        
        this.processing = false;
  
        this.stepper.next();

      } else {
        // console.log('show the error message here..,', response.message);
        this.service.openSnackBar(response.message, 'error-lg');
      }
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });     

    // } else {
    //   this.processing = false;

    //   this.service.openSnackBar('Invalid. Please enter a valid OTP.', 'error-lg');
    // }
  }

  ngOnDestroy(): void {
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
    if (this.applicationIDSub) { this.applicationIDSub.unsubscribe(); }
  }  
}

