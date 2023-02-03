import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { Subscription } from 'rxjs';
import { ApiPayload } from 'src/app/services/api.model';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-birth-song-dialog',
  templateUrl: './birth-song-dialog.component.html',
  styleUrls: ['./birth-song-dialog.component.scss']
})
export class BirthSongDialogComponent implements OnInit {

  processing = false;
  isLinear = true;
  httpSubscription: Subscription;

  termsAndCondition = new FormControl('', [Validators.required]);
  formRegistration: FormGroup;

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  constructor(
    private dialogRef: MatDialogRef<BirthSongDialogComponent>,    
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder,
    private endpoints: ApiEndpointsService,
  ) {
    
  }

  ngOnInit(): void {
    this.formRegistration = this.formBuilder.group({
      RegisterAs: new FormControl('', [Validators.required]),      
      Name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      AgeCategory: new FormControl('', [Validators.required]),      
      CompetitionCategory: new FormControl('', [Validators.required]),      
    });       
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  getNameErrorMessage() {
    return this.formRegistration.get('Name').hasError('required') ? 'Please enter a value.' :
    this.formRegistration.get('Name').hasError('maxlength') ? 'You have reached the maximum.' : '';
  }

  getSelectErrorMessage() {
    return this.formRegistration.get('CompetitionCategory').hasError('required') 
    || this.formRegistration.get('RegisterAs').hasError('required') 
    || this.formRegistration.get('AgeCategory').hasError('required') 
    ? 'Please choose one.' : '';
  }

  private getFormData(): any {

    const data = {
      RegisteredAs: this.formRegistration.get('RegisterAs').value,
      Name: this.formRegistration.get('Name').value,
      AgeCategory: this.formRegistration.get('AgeCategory').value,
      CompetitionCategory: this.formRegistration.get('CompetitionCategory').value,
    }

    return data;
  }

  onSubmit(): void {
    this.processing = true;

    this.httpSubscription = this.http.post<ApiPayload>(this.endpoints.birth_song_competition, this.getFormData())
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.service.openSnackBar(response.message, 'success-lg');

      this.processing = false;

      this.termsAndCondition.reset();
      this.formRegistration.reset();

    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });      
  }

  ngOnDestroy(): void {
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }  
}

