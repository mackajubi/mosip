import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RopForm1NotificationOfChangeComponent } from 'src/app/dialogs/rop-form1-notification-of-change/rop-form1-notification-of-change.component';
import { NotificationOfChange } from '../../services-and-forms.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-rop-form2',
  templateUrl: './rop-form2.component.html',
  styleUrls: ['./rop-form2.component.scss']
})
export class RopForm2Component implements OnInit {

  title = "Form 2";
  subTitle = "Request to Confirm Information in the Register";
  loading = true;
  processing = false;
  isLinear = false;
  maxDate = new Date();
  dialogRef;

  selectedItem: NotificationOfChange = null;
  showIndividualPlaceOfResidence = true;
  showInstitutionLocation = true;

  displayedColumns: string[] = ['Count', 'Field','Previous', 'New' ,'Actions'];
  dataSource: MatTableDataSource<NotificationOfChange>; 

  formPart1: FormGroup;
  formPart2: FormGroup;
  formPart3: FormGroup;
  formPart4: FormGroup;
  
  DraftReferenceNumber = new FormControl();

  items: NotificationOfChange[] = [
    {
      Field: 'Other Name',
      Previous: 'Doe',
      New: 'Jane',
    }
  ];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;  

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.service.updatePageTitle(this.title + '-' + this.subTitle);    
  }

  ngOnInit(): void {

    this.formPart1 = this.formBuilder.group({
      TypeOfApplicant: new FormControl(),          
    });   

    this.formPart2 = this.formBuilder.group({
      IndividualSurname: new FormControl(),
      IndividualGivenName: new FormControl(),
      IndividualOtherName: new FormControl(),
      IndividualNIN: new FormControl(),
      IndividualCardNumber: new FormControl(),     
      IndividualDistrictOfResidence: new FormControl(),
      IndividualCountyOfResidence: new FormControl(),
      IndividualSubCountyOfResidence: new FormControl(),
      IndividualParishOfResidence: new FormControl(),
      IndividualVillageOfResidence: new FormControl(),            
    });   

    this.formPart3 = this.formBuilder.group({
      InstitutionName: new FormControl(),
      InstitutionTelephoneNumber: new FormControl(),
      InstitutionEmailAddress: new FormControl(),   
      InstitutionDistrictOfAddress: new FormControl(),
      InstitutionCountyOfAddress: new FormControl(),
      InstitutionSubCountyOfAddress: new FormControl(),
      InstitutionParishOfAddress: new FormControl(),
      InstitutionVillageOfAddress: new FormControl(),            
    });   

    this.formPart4 = this.formBuilder.group({
      Name: new FormControl(),
      DateOfBirth: new FormControl(),
      NationalIdentificationNumber: new FormControl(),             
      Reason: new FormControl(),             
    });   

    this.dataSource = new MatTableDataSource(this.items);

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onGetSavedDraft(): void {
    console.log('retrieve the saved draft');
  }

  onAddItem(): void {
    this.dialogRef = this.dialog.open(RopForm1NotificationOfChangeComponent, {
      panelClass: ['rop-form1-notification-of-change-details-dialog', 'dialogs'],
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe((result: { status: boolean, row: NotificationOfChange }) => {
      if (result.status) {
        // Update the Spouses object variable
        this.items.push(result.row);
      }
    });      
  }

  onChangeItem(row: NotificationOfChange): void {
    console.log('make changes:', row);
  }

  onRemoveItem(row: NotificationOfChange): void {
    console.log('remove a item:', row);
  }

  onSaveDraft(): void {
    console.log('save the draft');
    
    this.processing = true;
    setTimeout(() => {
      this.processing = false
    }, 2000);
  }

  onSubmit(): void {
    console.log('save the draft');
    
    this.processing = true;
    setTimeout(() => {
      this.processing = false
    }, 2000);
  }

  ngOnDestroy(): void {
    // this.service.processingBar.next(false);

    if (this.dialogRef) { this.dialogRef.close(); }
    // if (this.bottomsheetRef) { this.bottomsheetRef.dismiss(); }
    // if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }  
}
