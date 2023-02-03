import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';

export interface Fee {
  SubCategory: string;
  SubCategoryDetails: SubCategoryDetail[]
}

export interface SubCategoryDetail {
  TaxHead?: string;
  Fee?: string;
  Currency?: string;  
  
}

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  title = "Contact Us";
  loading = true;

  form: FormGroup;

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.service.updatePageTitle(this.title);    
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z ]+$/)
      ]),
      subject: new FormControl('', [
        Validators.required,
        Validators.maxLength(100)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      message: new FormControl('', [Validators.required])
    });
  }

  getNameErrorMessage() {
    return this.form.get('name').hasError('required') ? 'Please enter your name' :
      this.form.get('name').hasError('pattern') ? 'Not a valid name' : '';
  }

  getSubjectErrorMessage() {
    return this.form.get('subject').hasError('required') ? 'Please type a subject' :
      this.form.get('subject').hasError('maxlength') ? 'Not a valid subject' : '';
  }

  getEmailErrorMessage() {
    return this.form.get('email').hasError('required') ? 'Please enter an email' :
      this.form.get('email').hasError('email') || this.form.get('email').hasError('pattern') ? 'Not a valid email' : '';
  }

  getMessageErrorMessage() {
    return this.form.get('message').hasError('required') ? 'Please type your message' : '';
  }  

  onSend(): void {
    // console.log('submit the form data');
  }

  ngOnDestroy(): void {
    // this.service.processingBar.next(false);

    // if (this.bottomsheetRef) { this.bottomsheetRef.dismiss(); }
    // if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }  
}
