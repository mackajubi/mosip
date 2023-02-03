import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Spouse } from 'src/app/pages/services-and-forms/services-and-forms.model';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { CitizenshipType, TypeOfMarriage } from 'src/app/services/api.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-rop-form3-spouse-details-dialog',
  templateUrl: './rop-form3-spouse-details-dialog.component.html',
  styleUrls: ['./rop-form3-spouse-details-dialog.component.scss']
})
export class RopForm3SpouseDetailsDialogComponent implements OnInit {

  processing = false;
  form: FormGroup;
  status = false;
  today = new Date();
  citizenshipTypeName = null;
  typeOfMarriageName = null;
  _spouse: Spouse;
  typesOfMarriage: TypeOfMarriage[] = [];
  citizenshipTypes: CitizenshipType[] = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public spouse: { row: Spouse },
    private dialogRef: MatDialogRef<RopForm3SpouseDetailsDialogComponent>,
    private formBuilder: FormBuilder,
    private service: ApiService,
  ) { }

  ngOnInit(): void {
    this.typesOfMarriage = this.service.TypesOfMarriage;
    this.citizenshipTypes = this.service.CitizenshipTypes;

    this.form = this.formBuilder.group({
      SpouseSurname: new FormControl('Kyewalabye'),
      SpouseGivenName: new FormControl('Juliet'),
      SpouseOtherName: new FormControl('Nabanova'),
      SpouseMaidenName: new FormControl(),
      SpousePreviousName: new FormControl(),   
      SpouseNIN: new FormControl('CF89ERKER79ERJ'),  
      SpouseNINCardNumber: new FormControl('23009CJDF'),  
      SpouseApplicationID: new FormControl('CF89ERKER79ERJ'),  
      SpouseCitizenshipType: new FormControl(1),      
      SpouseCitizenshipCertificateNumber: new FormControl('KJCER787DFJ'),      
      SpouseStateOtherCitizenShip: new FormControl(),
      PlaceOfMarriage: new FormControl('Namirembe'),
      DateOfMarriage: new FormControl('2020-05-20'),
      TypeOfMarraige: new FormControl(1),
    });    

    if (this.spouse) {
      this.updateForm();
    }   
  }

  onCloseDialog(): void {
    this.dialogRef.close({
      status: this.status,
      row: this._spouse
    });
  }  

  private updateForm(): void {
    this.form.patchValue({
      SpouseSurname: this.spouse.row.Surname,
      SpouseGivenName:  this.spouse.row.GivenName,
      SpouseOtherName: this.spouse.row.OtherName,
      SpouseMaidenName: this.spouse.row.MaidenName,
      SpousePreviousName: this.spouse.row.PreviousName,
      SpouseNIN: this.spouse.row.NIN,
      SpouseNINCardNumber: this.spouse.row.NINCardNumber,
      ApplicationID: this.spouse.row.ApplicationID,
      SpouseCitizenshipType: this.spouse.row.CitizenshipType,
      SpouseCitizenshipCertificateNumber: this.spouse.row.CitizenshipCertificateNumber,
      SpouseStateOtherCitizenShip: this.spouse.row.OtherCitizenship,
      PlaceOfMarriage: this.spouse.row.PlaceOfMarriage,
      // DateOfMarriage: this.datePipe.transform(this.spouse.row.DateOfMarriage, 'MM/dd/yyyy'),
      DateOfMarriage: this.spouse.row.DateOfMarriage,
      TypeOfMarraige: this.spouse.row.TypeOfMarriage,
    });
  }

  private getFormData(): any {
    
    this._spouse = {
      Surname: this.form.get('SpouseSurname').value,
      GivenName: this.form.get('SpouseGivenName').value,
      OtherName: this.form.get('SpouseOtherName').value,
      MaidenName: this.form.get('SpouseMaidenName').value,
      PreviousName: this.form.get('SpousePreviousName').value,
      NIN: this.form.get('SpouseNIN').value,
      NINCardNumber: this.form.get('SpouseNINCardNumber').value,
      ApplicationID: this.form.get('SpouseApplicationID').value,
      CitizenshipType: this.form.get('SpouseCitizenshipType').value,
      CitizenshipTypeName: this.citizenshipTypeName,
      CitizenshipCertificateNumber: this.form.get('SpouseCitizenshipCertificateNumber').value,
      OtherCitizenship: this.form.get('SpouseStateOtherCitizenShip').value,
      PlaceOfMarriage: this.form.get('PlaceOfMarriage').value,
      DateOfMarriage: this.form.get('DateOfMarriage').value,
      TypeOfMarriage: this.form.get('TypeOfMarraige').value,
      TypeOfMarriageName: this.typeOfMarriageName
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
