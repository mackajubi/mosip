import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-anouncement-dialog',
  templateUrl: './anouncement-dialog.component.html',
  styleUrls: ['./anouncement-dialog.component.scss']
})
export class AnouncementDialogComponent implements OnInit {

  processing = false;
  httpSubscription: Subscription;
  form: FormGroup;

  OrganisationID = 0;

  constructor(
    private dialogRef: MatDialogRef<AnouncementDialogComponent>,    
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder,
    private endpoints: ApiEndpointsService,
    private changeDetector: ChangeDetectorRef
  ) {
    
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      NIN: new FormControl('', [
        Validators.required,
        Validators.maxLength(14),
        // Validators.pattern(/^(C|R|N|P)(M|F|X)[0-9a-zA-Z]{12}$/)
        Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(M|F|X)[0-9a-zA-Z]{12}$/)
      ]),      
      TIN: new FormControl('', [
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]{10}$/)
      ]),
    });
  
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  getNINErrorMessage() {
    return this.form.get('NIN').hasError('required') ? 'Please enter a value' :
    this.form.get('NIN').hasError('maxlength')
    || this.form.get('NIN').hasError('pattern') ? 'Not a valid' : '';
  }

  onSubmit(): void {
    // console.log('save the submission');
  }

  ngOnDestroy(): void {
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }  
}

