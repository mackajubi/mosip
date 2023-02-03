import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Child } from 'src/app/pages/services-and-forms/services-and-forms.model';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-rop-form3-child-details-dialog',
  templateUrl: './rop-form3-child-details-dialog.component.html',
  styleUrls: ['./rop-form3-child-details-dialog.component.scss']
})
export class RopForm3ChildDetailsDialogComponent implements OnInit {

  processing = false;
  form: FormGroup;
  status = false;
  _child: Child;
  today = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public child: { row: Child },
    private dialogRef: MatDialogRef<RopForm3ChildDetailsDialogComponent>,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      ChildApplicationID: new FormControl('CKJE890943M'),  
      ChildSurname: new FormControl('Kajubi'),
      ChildGivenName: new FormControl('Mark'),
      ChildOtherName: new FormControl(''),
      ChildMaidenName: new FormControl(),
      ChildPreviousName: new FormControl(),   
      Sex: new FormControl('Male'),      
      DateOfBirth: new FormControl('2021-04-18'),                
      PlaceOfBirth: new FormControl('Abroad'),                                   
    });    

    if (this.child) {
      this.updateForm();
    }   
  }

  onCloseDialog(): void {
    this.dialogRef.close({
      status: this.status,
      row: this._child
    });
  }  

  private updateForm(): void {
    this.form.patchValue({
      ChildApplicationID: this.child.row.ApplicationID,
      ChildSurname:  this.child.row.Surname,
      ChildGivenName: this.child.row.GivenName,
      ChildOtherName: this.child.row.OtherName,
      ChildMaidenName: this.child.row.MaidenName,
      ChildPreviousName: this.child.row.PreviousName,
      Sex: this.child.row.Sex,
      DateOfBirth: this.child.row.DateOfBirth,
      PlaceOfBirth: this.child.row.PlaceOfBirth,
    });
  }  

  private getFormData(): any {
    
    this._child = {
      ApplicationID: this.form.get('ChildApplicationID').value,
      Surname: this.form.get('ChildSurname').value,
      GivenName: this.form.get('ChildGivenName').value,
      OtherName: this.form.get('ChildOtherName').value,
      MaidenName: this.form.get('ChildMaidenName').value,
      PreviousName: this.form.get('ChildPreviousName').value,
      Sex: this.form.get('Sex').value,
      DateOfBirth: this.form.get('DateOfBirth').value,
      PlaceOfBirth: this.form.get('PlaceOfBirth').value
    }
  }  

  onSave(): void {
    this.processing = true;

    this.getFormData();

    setTimeout(() => {
      this.status = true;

      this.form.reset();

      this.onCloseDialog();
      
      this.processing = false;
    }, 1000);
  }
}
