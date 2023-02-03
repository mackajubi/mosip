import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationOfChange, Spouse } from 'src/app/pages/services-and-forms/services-and-forms.model';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-rop-form1-notification-of-change',
  templateUrl: './rop-form1-notification-of-change.component.html',
  styleUrls: ['./rop-form1-notification-of-change.component.scss']
})
export class RopForm1NotificationOfChangeComponent implements OnInit {

  processing = false;
  form: FormGroup;
  status = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public item: { row: NotificationOfChange },
    private dialogRef: MatDialogRef<RopForm1NotificationOfChangeComponent>,
    private formBuilder: FormBuilder,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      SpouseSurname: new FormControl(),
      SpouseGivenName: new FormControl(),
      SpouseOtherName: new FormControl(),
      SpouseMaidenName: new FormControl(),
      SpousePreviousName: new FormControl(),   
      SpouseNationalIDNumberOrApplicationID: new FormControl(),  
      SpouseCitizenshipType: new FormControl(),      
      SpouseCitizenshipCertificateNumber: new FormControl(),      
      SpouseStateOtherCitizenShip: new FormControl(),                
      PlaceOfMarriage: new FormControl(),                
      DateOfMarriage: new FormControl(),                
      TypeOfMarraige: new FormControl(),                                      
    });    
    

    // if (this.spouse) {
    //   this.updateForm();
    // }   
    
    // this._getIDsOfNewOptions();
  }

  onCloseDialog(): void {
    this.dialogRef.close({
      status: this.status,
      row: this.item ? this.item.row : null
    });
  }  

  // private getFormData(): any {
    
  //   const data = {
  //     CaseTitle: this.form.get('CaseTitle').value,
  //     CivilSuitNo: this.form.get('CivilSuitNo').value + ' of ' + this.form.get('CivilSuitYear').value,
  //     UNRAFileNumber: this.form.get('UNRAFileNumber').value,
  //     HearingJudgeID: this.selectedIds.HearingJudgeID,
  //     HearingCourtID: this.selectedIds.HearingCourtID,
  //     PlaintiffID: this.selectedIds.PlaintiffID,
  //     OpposingCounselID: this.selectedIds.OpposingCounselID,
  //     DefendantID: this.selectedIds.DefendantID,
  //     LeadCounselID: this.selectedIds.LeadCounselID,
  //     CaseFileID: this.caseFile ? this.caseFile.row.CaseFileID.toString() : 0,
  //   }

  //   return data;
  // }  

  onSave(): void {
    this.processing = true;

    setTimeout(() => {
      this.status = true;

      this.onCloseDialog();

      this.form.reset();
    }, 1000);
  }

  onSaveChanges(): void {
    this.processing = true;

    setTimeout(() => {
      this.status = true;

      this.form.reset();
    }, 1000);
  }
}

