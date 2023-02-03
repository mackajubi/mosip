import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Child, NotificationOfChange, Spouse } from '../../services-and-forms.model';
import { ApiService } from 'src/app/services/api.service';
import { RopForm3ChildDetailsDialogComponent } from 'src/app/dialogs/rop-form3-child-details-dialog/rop-form3-child-details-dialog.component';
import { RopForm3SpouseDetailsDialogComponent } from 'src/app/dialogs/rop-form3-spouse-details-dialog/rop-form3-spouse-details-dialog.component';

@Component({
  selector: 'app-rop-form11',
  templateUrl: './rop-form11.component.html',
  styleUrls: ['./rop-form11.component.scss']
})
export class RopForm11Component implements OnInit {

  title = "Form 11";
  subTitle = "Application for Replacement of Lost, Defaced Or Damaged National ID Card";
  loading = true;
  processing = false;
  isLinear = false;
  maxDate = new Date();
  dialogRef;

  selectedItem: NotificationOfChange = null;
  showPlaceOfResidence = false;
  showPlaceOfBirth = false;
  showPlaceOfOrigin = false;
  showPassportInformation = false;
  showFathersDetails = true;
  showFatherzPlaceOfOrigin = false;
  showMotherzDetails = false;
  showMotherzPlaceOfOrigin = false;
  showContemporaryDescendants = false;

  selectedSpouse: Spouse = null;
  spouseDisplayedColumns: string[] = [
    'Count', 'Name', 'PreviousName', 'NIN',
    'CitizenshipType', 'CitizenshipCertificateNumber', 'OtherCitizenship',
    'PlaceOfMarriage', 'DateOfMarriage', 'TypeOfMarriage', 'Actions'
  ];
  childrenDisplayedColumns: string[] = [
    'Count', 'Name', 'ApplicationID', 'PreviousName', 
    'Sex', 'DateOfBirth', 'PlaceOfBirth', 'Actions'
  ];

  spouseDataSource: MatTableDataSource<Spouse>;  
  childrenDataSource: MatTableDataSource<Child>;  

  formPart1: FormGroup;
  formPart2: FormGroup;
  formDeclaration: FormGroup;
  
  DraftReferenceNumber = new FormControl();

  Spouses: Spouse[] = [
    {
      Surname: 'Jane',
      GivenName: 'Doe',
      NIN: 'FM234539237NK33J2',
      CitizenshipType: 1,
      CitizenshipTypeName: 'By Birth',
      CitizenshipCertificateNumber: '007934',
      PlaceOfMarriage: 'St. Augustine',
      DateOfMarriage: new Date('2021-06-26'),
      TypeOfMarriage: 2,
      TypeOfMarriageName: 'Religious'
    }
  ];

  Children: Child[] = [
    {
      ApplicationID: 'CH899343',
      Surname: 'Kabunga',
      GivenName: 'Willy',
      Sex: 'Boy',
      DateOfBirth: new Date('2021-06-26'),
      PlaceOfBirth: 'Nakasero Hospital'
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
      TypeOfRequest: new FormControl(), 
      NIN: new FormControl(),
      CardNumber: new FormControl(),           
      Surname: new FormControl(),
      GivenName: new FormControl(),
      OtherName: new FormControl(),
      PreviousName: new FormControl(),
      MaidenName: new FormControl(),
      SexOfApplicant: new FormControl(),
      BloodGroupOfApplicant: new FormControl(),
      DateOfBirth: new FormControl(),
      IndigenousCommunityOrTribe: new FormControl(),      
      Clan: new FormControl(),          
      HighestLevelOfEducation: new FormControl(),          
      TaxIdentificationNumber: new FormControl(),          
      DrivingLicenseNumber: new FormControl(),       
      Profession: new FormControl(),          
      Occupation: new FormControl(),          
      MaritalStatus: new FormControl(),     
      CountryOfBirth: new FormControl(),
      DistrictOfBirth: new FormControl(),
      CountyOfBirth: new FormControl(),
      SubCountyOfBirth: new FormControl(),
      ParishOfBirth: new FormControl(),
      VillageOfBirth: new FormControl(),  
      HeightOfApplicant: new FormControl(),  
      ColorOfEyes: new FormControl(),  
      ColorOfHair: new FormControl(),  
      CountryOfOrigin: new FormControl(),
      DistrictOfOrigin: new FormControl(),
      CountyOfOrigin: new FormControl(),
      SubCountyOfOrigin: new FormControl(),
      ParishOfOrigin: new FormControl(),
      VillageOfOrigin: new FormControl(), 
      CountryOfResidence: new FormControl(),
      DistrictOfResidence: new FormControl(),
      CountyOfResidence: new FormControl(),
      SubCountyOfResidence: new FormControl(),
      ParishOfResidence: new FormControl(),
      VillageOfResidence: new FormControl(),  
      PostalAddress: new FormControl(),     
      PassportNumber: new FormControl(),      
      PassportPlaceOfIssue: new FormControl(),       
      PassportDateOfIssue: new FormControl(),       
      PassportIssuingAuthority: new FormControl(),   
      
      FirstDescendantSurname: new FormControl(),
      FirstDescendantGivenName: new FormControl(),
      FirstDescendantOtherName: new FormControl(),
      SecondDescendantSurname: new FormControl(),
      SecondDescendantGivenName: new FormControl(),
      SecondDescendantOtherName: new FormControl(),
    });    

    this.formPart2 = this.formBuilder.group({
        FatherzSurname: new FormControl(),
        FatherzGivenName: new FormControl(),
        FatherzOtherName: new FormControl(),
        FatherzNIN: new FormControl(),
        FatherzCardNumber: new FormControl(),
        FatherzClan: new FormControl(),
        FatherzCountryOfOrigin: new FormControl(),
        FatherzDistrictOfOrigin: new FormControl(),
        FatherzCountyOfOrigin: new FormControl(),
        FatherzSubCountyOfOrigin: new FormControl(),
        FatherzParishOfOrigin: new FormControl(),
        FatherzVillageOfOrigin: new FormControl(),           
        MotherzSurname: new FormControl(),
        MotherzGivenName: new FormControl(),
        MotherzOtherName: new FormControl(),
        MotherzNIN: new FormControl(),
        MotherzCardNumber: new FormControl(),
        MotherzClan: new FormControl(),
        MotherzCountryOfOrigin: new FormControl(),
        MotherzDistrictOfOrigin: new FormControl(),
        MotherzCountyOfOrigin: new FormControl(),
        MotherzSubCountyOfOrigin: new FormControl(),
        MotherzParishOfOrigin: new FormControl(),
        MotherzVillageOfOrigin: new FormControl(),     
      });    

    this.formDeclaration = this.formBuilder.group({   
      DeclarationCheckbox: new FormControl(),
    });       

    this.spouseDataSource = new MatTableDataSource(this.Spouses);
    this.childrenDataSource = new MatTableDataSource(this.Children);

    setTimeout(() => {
      this.spouseDataSource.paginator = this.paginator;
      this.spouseDataSource.sort = this.sort;
      this.childrenDataSource.paginator = this.paginator;
      this.childrenDataSource.sort = this.sort;
    });
  }

  onGetSavedDraft(): void {
    console.log('retrieve the saved draft');
  }

  onAddASpouse(): void {
    this.dialogRef = this.dialog.open(RopForm3SpouseDetailsDialogComponent, {
      panelClass: ['rop-form3-Spouse-details-dialog', 'dialogs'],
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe((result: { status: boolean, row: Spouse }) => {
      if (result.status) {
        // Update the Spouses object variable
        this.Spouses.push(result.row);
      }
    });      
  }

  onChangeSpouseInformation(row: Spouse): void {
    console.log('make changes:', row);
  }

  onRemoveSpouse(row: Spouse): void {
    console.log('remove a Spouse:', row);
  }

  onAddAChild(): void {
    this.dialogRef = this.dialog.open(RopForm3ChildDetailsDialogComponent, {
      panelClass: ['rop-form3-child-details-dialog', 'dialogs'],
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe((result: { status: boolean, row: Spouse }) => {
      if (result.status) {
        // Update the Spouses object variable
        this.Spouses.push(result.row);
      }
    });      
  }

  onChangeChildInformation(row: Spouse): void {
    console.log('make changes:', row);
  }

  onRemoveChild(row: Spouse): void {
    console.log('remove a Spouse:', row);
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
