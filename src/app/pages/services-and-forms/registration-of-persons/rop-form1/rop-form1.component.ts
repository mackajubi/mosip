import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { UploadDocumentDialogComponent } from 'src/app/dialogs/upload-document-dialog/upload-document-dialog.component';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiPayload, County, District, DocumentUpload, NINDetail, Parish, PRN, Process, ROPForm3Category, ROPRequiredAttachment, SubCounty, Village } from 'src/app/services/api.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-rop-form1',
  templateUrl: './rop-form1.component.html',
  styleUrls: ['./rop-form1.component.scss']
})
export class RopForm1Component implements OnInit {

  ServiceName = 'COP01';
  title = "Form 1";
  subTitle = "Notification of Change / Error in Information in the Register";
  loading = true;
  processing = false;
  isLinear = true;
  maxDate = new Date();
  selectedIndex = 0;   
  dialogRef;
  httpSubscription: Subscription;
  processingSub: Subscription;
  displayedColumns: string[] = ['Count', 'Attachment', 'Priority', 'Filename','Actions'];
  dataSource: MatTableDataSource<ROPRequiredAttachment>; 
  ropForm3Categories: ROPForm3Category[] = [];
  selectedCategories: string = '';
  requiredAttachments: ROPRequiredAttachment[] = [];

  changeOfNameByOmitting = false;
  changeOfNameByAdding = false;
  completeChangeOfName = false;
  changeOfNameByDropping = false;
  inclusionOrDeletion = false;
  changeOfOrderOfNames = false;
  clarificationOfInitials = false;
  changeOfDateOrMonth = false;
  changeOfPlaceOfBirth = false;
  changeOfYearOfBirth = false;
  changeOfSex = false;
  showStepAttachemets = false;
  showStepPayments = false;
  allDocumentsAttached = false;

  Districts: District[] = [];
  Counties: County[] = [];
  SubCounties: SubCounty[] = [];
  Parishes: Parish[] = [];
  Villages: Village[] = [];

  DistrictID = 0;
  CountyID = 0;
  SubCountyID = 0;
  ParishID = 0;
  VillageID = 0;

  /* Father */
  filteredDistricts: Observable<District[]>;
  filteredCounties: Observable<County[]>;
  filteredSubCounties: Observable<SubCounty[]>;
  filteredParishes: Observable<Parish[]>;
  filteredVillages: Observable<Village[]>; 

  NINDetails: NINDetail | null;
  PRNDetails: PRN | null;
  PRNErrorMessage = null;
  RecievedMessage = null;
  printReceipt = false;

  formPart1: FormGroup;
  formPart2: FormGroup;
  formPRN: FormGroup;
  DraftReferenceNumber = new FormControl();
   
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;  

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.service.updatePageTitle(this.title + '-' + this.subTitle);  
    
    // const data = {
    //   TaxHeadCode: "COP01",
    //   Name: 'MARK KAJUBI',
    //   NIN: 'CM930991022FYK',
    //   TIN: ''
    // }

    // this.processing = true;
    // this.http.post<ApiPayload>(this.endpoints.get_prn, data)
    // .pipe(catchError(this.service.handleError))
    // .subscribe((response) => {

    //   this.PRNDetails = {
    //     PRN: response.data.PRN,
    //     Amount: response.data.Amount,
    //     Currency: response.data.Currency,
    //     ExpiryDate: response.data.ExpiryDate
    //   }
      
    //   this.processing = false;

    // }, (error) => {
    //   this.processing = false;
    //   this.service.determineErrorResponse(error);
    // });    
      
  }

  ngOnInit(): void {
    this.ropForm3Categories = this.service.ROPForm3Categories;

    this.formPart1 = this.formBuilder.group({
      NIN: new FormControl('CM930991022FYK', [
        Validators.maxLength(14),
        Validators.minLength(14),
        // Validators.pattern(/^(C|R|N|P)(M|F|X)[0-9a-zA-Z]{12}$/)
        Validators.pattern(/^(C|R|N|P|U|X|E|W|A)(M|F|X)[0-9a-zA-Z]{12}$/)
      ]),
      PhoneNumber: new FormControl('703 333 889', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(20),     
        Validators.pattern(/^[0-9]{3}[ ]{1}[0-9]{3}[ ]{1}[0-9]{3}$/) 
      ]),
      EmailAddress: new FormControl('', [Validators.email]),         
    });   

    this.formPart2 = this.formBuilder.group({
      DataCategory: new FormControl('', [Validators.required]),      
      ChangeOfNameByOmittingFromSurname: new FormControl(''),      
      ChangeOfNameByOmittingFromGivenName: new FormControl(''),      
      ChangeOfNameByOmittingFromOtherName: new FormControl(''),        
      ChangeOfNameByOmittingToSurname: new FormControl(''),      
      ChangeOfNameByOmittingToGivenName: new FormControl(''),      
      ChangeOfNameByOmittingToOtherName: new FormControl(''),  
      changeOfNameByAddingFromSurname: new FormControl(''),      
      changeOfNameByAddingFromGivenName: new FormControl(''),      
      changeOfNameByAddingFromOtherName: new FormControl(''),        
      changeOfNameByAddingFromMaidenName: new FormControl(''),        
      changeOfNameByAddingFromPreviousName: new FormControl(''),        
      changeOfNameByAddingToSurname: new FormControl(''),      
      changeOfNameByAddingToGivenName: new FormControl(''),      
      changeOfNameByAddingToOtherName: new FormControl(''),        
      changeOfNameByAddingToMaidenName: new FormControl(''),        
      changeOfNameByAddingToPreviousName: new FormControl(''),  
      completeChangeOfNameFromSurname: new FormControl(''),      
      completeChangeOfNameFromGivenName: new FormControl(''),      
      completeChangeOfNameFromOtherName: new FormControl(''),        
      completeChangeOfNameToSurname: new FormControl(''),      
      completeChangeOfNameToGivenName: new FormControl(''),      
      completeChangeOfNameToOtherName: new FormControl(''),
      changeOfNameByDroppingNickname: new FormControl('', [Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]),      
      changeOfNameByDroppingPetName: new FormControl('', [Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]),      
      changeOfNameByDroppingTitle: new FormControl('', [Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]),      
      inclusionOrDeletionRadiobtn: new FormControl(''), 
      inclusionOrDeletionMaidenName: new FormControl(''), 
      changeOfOrderOfNamesFromSurname: new FormControl(''),      
      changeOfOrderOfNamesFromGivenName: new FormControl(''),      
      changeOfOrderOfNamesFromOtherName: new FormControl(''),        
      changeOfOrderOfNamesFromMaidenName: new FormControl(''),        
      changeOfOrderOfNamesFromPreviousName: new FormControl(''),        
      changeOfOrderOfNamesToSurname: new FormControl(''),      
      changeOfOrderOfNamesToGivenName: new FormControl(''),      
      changeOfOrderOfNamesToOtherName: new FormControl(''),        
      changeOfOrderOfNamesToMaidenName: new FormControl(''),        
      changeOfOrderOfNamesToPreviousName: new FormControl(''), 
      clarificationOfInitialsRadiobtn: new FormControl(''),        
      clarificationOfInitialsFrom: new FormControl(''), 
      clarificationOfInitialsTo: new FormControl(''), 
      clarificationOfInitialsDetails: new FormControl(''), 
      changeOfDateOrMonthFrom: new FormControl(''),        
      changeOfDateOrMonthTo: new FormControl(''),     
      changeOfPlaceOfBirthFromDistrict: new FormControl(''),        
      changeOfPlaceOfBirthFromCounty: new FormControl(''),        
      changeOfPlaceOfBirthFromSubCounty: new FormControl(''),        
      changeOfPlaceOfBirthFromParish: new FormControl(''),        
      changeOfPlaceOfBirthFromVillage: new FormControl(''),        
      changeOfPlaceOfBirthToDistrict: new FormControl(''),        
      changeOfPlaceOfBirthToCounty: new FormControl(''),        
      changeOfPlaceOfBirthToSubCounty: new FormControl(''),        
      changeOfPlaceOfBirthToParish: new FormControl(''),        
      changeOfPlaceOfBirthToVillage: new FormControl(''),   
      changeOfYearOfBirthFrom: new FormControl(''),        
      changeOfYearOfBirthTo: new FormControl(''),   
      changeOfSexFrom: new FormControl(''),        
      changeOfSexTo: new FormControl(''),        
    });   

    this.formPRN = this.formBuilder.group({
      PRN: new FormControl('', [
        Validators.required,
        Validators.maxLength(13),
        Validators.pattern(/^[0-9]{13}$/)
      ]),
    });

    this.dataSource = new MatTableDataSource(this.requiredAttachments);

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.formPart2.get('DataCategory').valueChanges.subscribe((value) => {
      const values: string[] = [...value];
      
      this.selectedCategories = '';

      if (values.length) {
        this.showStepAttachemets = true;

        values.filter((selected, index:number) => {
          this.selectedCategories = index > 0 ? this.selectedCategories + ',' + selected: this.selectedCategories + selected; 
        });
      } else {
        // If no category is selected
        this.requiredAttachments.length = 0;        
        this.showStepPayments = false;
      }

      this.requiredAttachments.length = 0; // Reset the object.

      this.ropForm3Categories.filter((category) => {

        values.filter((selected, index:number) => {
          if (category.Name === selected) {
            category.Attachments.filter((attachment) => {
              // Check if the attached has not beed added already.
              let found = false;

              this.requiredAttachments.filter((item) => {
                if (item.Name === attachment.Name) {
                  found = true;
                }
              });

              if (!found) {
                this.requiredAttachments.push({
                  Name: attachment.Name,
                  Required: attachment.Required
                });
              }
            });
          }
        });

        this.changeDetector.detectChanges();
      });

      // Update the table.
      this.dataSource = new MatTableDataSource(this.requiredAttachments);

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });    

    this.httpSubscription = this.fetchMultiple()
    .pipe(catchError(this.service.handleError))
    .subscribe((responseList) => {

      this.Districts = responseList[0].data; 

      // Listeners
      this.filteredDistricts = this.formPart2.get('changeOfPlaceOfBirthToDistrict').valueChanges
      .pipe(
        startWith(''),
        map(value => this.service._filterDistrict(value, this.Districts))
      );  
     
      this.processing = false;
      this.service.processingBar.next(this.processing);
    }, (error) => {
      this.processing = false;
      this.service.processingBar.next(this.processing);
      this.service.determineErrorResponse(error);
    });    
  }

  onCategorySelection(category: ROPForm3Category) {
    if (category.Name === 'Change of Name by Omitting or adopting a New Name') { 
      this.changeOfNameByOmitting = !this.changeOfNameByOmitting;
      this.validationChangeOfNameByOmitting(this.changeOfNameByOmitting);
    }
    
    if (category.Name === 'Change of Name by adding Name already appearing on Document') { 
      this.changeOfNameByAdding = !this.changeOfNameByAdding;
      this.validationChangeOfNameByAdding(this.changeOfNameByAdding);
    }
    
    if (category.Name === 'Complete Change of Name') { 
      this.completeChangeOfName = !this.completeChangeOfName;
      this.validationCompleteChangeOfName(this.completeChangeOfName);
    }
    
    if (category.Name === 'Change of Name by Dropping Nicknames, Pet Names and/or Titles') { 
      this.changeOfNameByDropping = !this.changeOfNameByDropping;
      this.validationChangeOfNameByDropping(this.changeOfNameByDropping);
    }
    
    if (category.Name === 'Inclusion or Deletion of Maiden Name') { 
      this.inclusionOrDeletion = !this.inclusionOrDeletion;
      this.validationInclusionOrDeletion(this.inclusionOrDeletion);
    }
    
    if (category.Name === 'Change of Order of Names') { 
      this.changeOfOrderOfNames = !this.changeOfOrderOfNames;
      this.validationChangeOfOrderOfNames(this.changeOfOrderOfNames);
    }
    
    if (category.Name === 'Clarification of Initials (add or remove)') { 
      this.clarificationOfInitials = !this.clarificationOfInitials;
      this.validationClarificationOfInitials(this.clarificationOfInitials);
    }
    
    if (category.Name === 'Change of Date or Month of Birth') { 
      this.changeOfDateOrMonth = !this.changeOfDateOrMonth;
      this.validationChangeOfDateOrMonth(this.changeOfDateOrMonth);
    }
    
    if (category.Name === 'Change of Place of Birth') { 
      this.changeOfPlaceOfBirth = !this.changeOfPlaceOfBirth;
      // this.showStepPayments = false;
      this.validationChangeOfPlaceOfBirth(this.changeOfPlaceOfBirth);
    }
    
    if (category.Name === 'Change of Year of Birth') { 
      this.changeOfYearOfBirth = !this.changeOfYearOfBirth;
      this.validationChangeOfYearOfBirth(this.changeOfYearOfBirth);
    }
    
    if (category.Name === 'Change of Sex') { 
      this.changeOfSex = !this.changeOfSex;
      this.validationChangeOfSex(this.changeOfSex);
    }

    if (this.changeOfNameByOmitting || this.changeOfNameByAdding 
      || this.completeChangeOfName || this.changeOfNameByDropping
      || this.inclusionOrDeletion || this.changeOfOrderOfNames
      || this.clarificationOfInitials || this.changeOfDateOrMonth
      || this.changeOfYearOfBirth || this.changeOfSex) {
      this.showStepPayments = true;
    } else {
      this.showStepPayments = false;
    }  
  }

  private validationChangeOfNameByOmitting(status: boolean): void {
    if (status) {
      // this.formPart2.get('ChangeOfNameByOmittingFromSurname').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      // this.formPart2.get('ChangeOfNameByOmittingFromGivenName').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      // this.formPart2.get('ChangeOfNameByOmittingFromOtherName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('ChangeOfNameByOmittingToSurname').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('ChangeOfNameByOmittingToGivenName').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('ChangeOfNameByOmittingToOtherName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
    } else {
      // Remove Validation
      this.formPart2.get('ChangeOfNameByOmittingFromSurname').clearValidators();
      this.formPart2.get('ChangeOfNameByOmittingFromGivenName').clearValidators();
      this.formPart2.get('ChangeOfNameByOmittingToSurname').clearValidators();
      this.formPart2.get('ChangeOfNameByOmittingToGivenName').clearValidators();
      
      // Reset
      this.formPart2.get('ChangeOfNameByOmittingFromSurname').reset();
      this.formPart2.get('ChangeOfNameByOmittingFromGivenName').reset();
      this.formPart2.get('ChangeOfNameByOmittingFromOtherName').reset();
      this.formPart2.get('ChangeOfNameByOmittingToSurname').reset();
      this.formPart2.get('ChangeOfNameByOmittingToGivenName').reset();
      this.formPart2.get('ChangeOfNameByOmittingToOtherName').reset();
    }
    
    this.formPart2.controls['ChangeOfNameByOmittingFromSurname'].updateValueAndValidity();
    this.formPart2.controls['ChangeOfNameByOmittingFromGivenName'].updateValueAndValidity();
    this.formPart2.controls['ChangeOfNameByOmittingFromOtherName'].updateValueAndValidity();
    this.formPart2.controls['ChangeOfNameByOmittingToSurname'].updateValueAndValidity();
    this.formPart2.controls['ChangeOfNameByOmittingToGivenName'].updateValueAndValidity();
    this.formPart2.controls['ChangeOfNameByOmittingToOtherName'].updateValueAndValidity();
  }

  private validationChangeOfNameByAdding(status: boolean): void {
    if (status) {
      // this.formPart2.get('changeOfNameByAddingFromSurname').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      // this.formPart2.get('changeOfNameByAddingFromGivenName').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      // this.formPart2.get('changeOfNameByAddingFromOtherName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      // this.formPart2.get('changeOfNameByAddingFromMaidenName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      // this.formPart2.get('changeOfNameByAddingFromPreviousName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('changeOfNameByAddingToSurname').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('changeOfNameByAddingToGivenName').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('changeOfNameByAddingToOtherName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('changeOfNameByAddingToMaidenName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('changeOfNameByAddingToPreviousName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
    } else {
      // Remove Validation
      this.formPart2.get('changeOfNameByAddingFromSurname').clearValidators();
      this.formPart2.get('changeOfNameByAddingFromGivenName').clearValidators();
      this.formPart2.get('changeOfNameByAddingToSurname').clearValidators();
      this.formPart2.get('changeOfNameByAddingToGivenName').clearValidators();
      
      // Reset
      this.formPart2.get('changeOfNameByAddingFromSurname').reset();
      this.formPart2.get('changeOfNameByAddingFromGivenName').reset();
      this.formPart2.get('changeOfNameByAddingFromOtherName').reset();
      this.formPart2.get('changeOfNameByAddingFromMaidenName').reset();
      this.formPart2.get('changeOfNameByAddingFromPreviousName').reset();
      this.formPart2.get('changeOfNameByAddingToSurname').reset();
      this.formPart2.get('changeOfNameByAddingToGivenName').reset();
      this.formPart2.get('changeOfNameByAddingToOtherName').reset();
      this.formPart2.get('changeOfNameByAddingToMaidenName').reset();
      this.formPart2.get('changeOfNameByAddingToPreviousName').reset();
    }
    
    this.formPart2.controls['changeOfNameByAddingFromSurname'].updateValueAndValidity();
    this.formPart2.controls['changeOfNameByAddingFromGivenName'].updateValueAndValidity();
    this.formPart2.controls['changeOfNameByAddingFromOtherName'].updateValueAndValidity();
    this.formPart2.controls['changeOfNameByAddingFromMaidenName'].updateValueAndValidity();
    this.formPart2.controls['changeOfNameByAddingFromPreviousName'].updateValueAndValidity();
    this.formPart2.controls['changeOfNameByAddingToSurname'].updateValueAndValidity();
    this.formPart2.controls['changeOfNameByAddingToGivenName'].updateValueAndValidity();
    this.formPart2.controls['changeOfNameByAddingToOtherName'].updateValueAndValidity();
    this.formPart2.controls['changeOfNameByAddingToMaidenName'].updateValueAndValidity();
    this.formPart2.controls['changeOfNameByAddingToPreviousName'].updateValueAndValidity();
  }

  private validationCompleteChangeOfName(status: boolean): void {
    if (status) {
      // this.formPart2.get('completeChangeOfNameFromSurname').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      // this.formPart2.get('completeChangeOfNameFromGivenName').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      // this.formPart2.get('completeChangeOfNameFromOtherName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('completeChangeOfNameToSurname').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('completeChangeOfNameToGivenName').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('completeChangeOfNameToOtherName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
    } else {
      // Remove Validation
      this.formPart2.get('completeChangeOfNameFromSurname').clearValidators();
      this.formPart2.get('completeChangeOfNameFromGivenName').clearValidators();
      this.formPart2.get('completeChangeOfNameToSurname').clearValidators();
      this.formPart2.get('completeChangeOfNameToGivenName').clearValidators();
      
      // Reset
      this.formPart2.get('completeChangeOfNameFromSurname').reset();
      this.formPart2.get('completeChangeOfNameFromGivenName').reset();
      this.formPart2.get('completeChangeOfNameFromOtherName').reset();
      this.formPart2.get('completeChangeOfNameToSurname').reset();
      this.formPart2.get('completeChangeOfNameToGivenName').reset();
      this.formPart2.get('completeChangeOfNameToOtherName').reset();
    }
    
    this.formPart2.controls['completeChangeOfNameFromSurname'].updateValueAndValidity();
    this.formPart2.controls['completeChangeOfNameFromGivenName'].updateValueAndValidity();
    this.formPart2.controls['completeChangeOfNameFromOtherName'].updateValueAndValidity();
    this.formPart2.controls['completeChangeOfNameToSurname'].updateValueAndValidity();
    this.formPart2.controls['completeChangeOfNameToGivenName'].updateValueAndValidity();
    this.formPart2.controls['completeChangeOfNameToOtherName'].updateValueAndValidity();
  }

  private validationChangeOfNameByDropping(status: boolean): void {
    if (!status) {
      // Reset
      this.formPart2.get('changeOfNameByDroppingNickname').reset();
      this.formPart2.get('changeOfNameByDroppingPetName').reset();
      this.formPart2.get('changeOfNameByDroppingTitle').reset();
    }
    
    this.formPart2.controls['changeOfNameByDroppingNickname'].updateValueAndValidity();
    this.formPart2.controls['changeOfNameByDroppingPetName'].updateValueAndValidity();
    this.formPart2.controls['changeOfNameByDroppingTitle'].updateValueAndValidity();
  }

  private validationInclusionOrDeletion(status: boolean): void {
    if (status) {
      this.formPart2.get('inclusionOrDeletionRadiobtn').setValidators([Validators.required]);
      this.formPart2.get('inclusionOrDeletionMaidenName').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
    } else {
      // Remove Validation
      this.formPart2.get('inclusionOrDeletionRadiobtn').clearValidators();
      this.formPart2.get('inclusionOrDeletionMaidenName').clearValidators();
      
      // Reset
      this.formPart2.get('inclusionOrDeletionRadiobtn').reset();
      this.formPart2.get('inclusionOrDeletionMaidenName').reset();
    }
    
    this.formPart2.controls['inclusionOrDeletionRadiobtn'].updateValueAndValidity();
    this.formPart2.controls['inclusionOrDeletionMaidenName'].updateValueAndValidity();
  }

  private validationChangeOfOrderOfNames(status: boolean): void {
    if (status) {
      // this.formPart2.get('changeOfOrderOfNamesFromSurname').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      // this.formPart2.get('changeOfOrderOfNamesFromGivenName').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      // this.formPart2.get('changeOfOrderOfNamesFromOtherName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      // this.formPart2.get('changeOfOrderOfNamesFromMaidenName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      // this.formPart2.get('changeOfOrderOfNamesFromPreviousName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('changeOfOrderOfNamesToSurname').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('changeOfOrderOfNamesToGivenName').setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('changeOfOrderOfNamesToOtherName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('changeOfOrderOfNamesToMaidenName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
      this.formPart2.get('changeOfOrderOfNamesToPreviousName').setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]);
    } else {
      // Remove Validation
      this.formPart2.get('changeOfOrderOfNamesFromSurname').clearValidators();
      this.formPart2.get('changeOfOrderOfNamesFromGivenName').clearValidators();
      this.formPart2.get('changeOfOrderOfNamesToSurname').clearValidators();
      this.formPart2.get('changeOfOrderOfNamesToGivenName').clearValidators();
      
      // Reset
      this.formPart2.get('changeOfOrderOfNamesFromSurname').reset();
      this.formPart2.get('changeOfOrderOfNamesFromGivenName').reset();
      this.formPart2.get('changeOfOrderOfNamesFromOtherName').reset();
      this.formPart2.get('changeOfOrderOfNamesFromMaidenName').reset();
      this.formPart2.get('changeOfOrderOfNamesFromPreviousName').reset();
      this.formPart2.get('changeOfOrderOfNamesToSurname').reset();
      this.formPart2.get('changeOfOrderOfNamesToGivenName').reset();
      this.formPart2.get('changeOfOrderOfNamesToOtherName').reset();
      this.formPart2.get('changeOfOrderOfNamesToMaidenName').reset();
      this.formPart2.get('changeOfOrderOfNamesToPreviousName').reset();
    }
    
    this.formPart2.controls['changeOfOrderOfNamesFromSurname'].updateValueAndValidity();
    this.formPart2.controls['changeOfOrderOfNamesFromGivenName'].updateValueAndValidity();
    this.formPart2.controls['changeOfOrderOfNamesFromOtherName'].updateValueAndValidity();
    this.formPart2.controls['changeOfOrderOfNamesFromMaidenName'].updateValueAndValidity();
    this.formPart2.controls['changeOfOrderOfNamesFromPreviousName'].updateValueAndValidity();
    this.formPart2.controls['changeOfOrderOfNamesToSurname'].updateValueAndValidity();
    this.formPart2.controls['changeOfOrderOfNamesToGivenName'].updateValueAndValidity();
    this.formPart2.controls['changeOfOrderOfNamesToOtherName'].updateValueAndValidity();
    this.formPart2.controls['changeOfOrderOfNamesToMaidenName'].updateValueAndValidity();
    this.formPart2.controls['changeOfOrderOfNamesToPreviousName'].updateValueAndValidity();
  }

  private validationClarificationOfInitials(status: boolean): void {
    if (status) {
      this.formPart2.get('clarificationOfInitialsRadiobtn').setValidators([Validators.required]);
      // this.formPart2.get('clarificationOfInitialsFrom').setValidators([Validators.required]);
      // this.formPart2.get('clarificationOfInitialsTo').setValidators([Validators.required]);
      this.formPart2.get('clarificationOfInitialsDetails').setValidators([Validators.required]);
    } else {
      // Remove Validation
      this.formPart2.get('clarificationOfInitialsRadiobtn').clearValidators();
      // this.formPart2.get('clarificationOfInitialsFrom').clearValidators();
      // this.formPart2.get('clarificationOfInitialsTo').clearValidators();
      this.formPart2.get('clarificationOfInitialsDetails').clearValidators();
      
      // Reset
      this.formPart2.get('clarificationOfInitialsRadiobtn').reset();
      // this.formPart2.get('clarificationOfInitialsFrom').reset();
      // this.formPart2.get('clarificationOfInitialsTo').reset();
      this.formPart2.get('clarificationOfInitialsDetails').reset();
    }
    
    this.formPart2.controls['clarificationOfInitialsRadiobtn'].updateValueAndValidity();
    // this.formPart2.controls['clarificationOfInitialsFrom'].updateValueAndValidity();
    // this.formPart2.controls['clarificationOfInitialsTo'].updateValueAndValidity();
    this.formPart2.controls['clarificationOfInitialsDetails'].updateValueAndValidity();
  }

  private validationChangeOfDateOrMonth(status: boolean): void {
    if (status) {
      this.formPart2.get('changeOfDateOrMonthFrom').setValidators([Validators.required]);
      this.formPart2.get('changeOfDateOrMonthTo').setValidators([Validators.required]);
    } else {
      // Remove Validation
      this.formPart2.get('changeOfDateOrMonthFrom').clearValidators();
      this.formPart2.get('changeOfDateOrMonthTo').clearValidators();
      
      // Reset
      this.formPart2.get('changeOfDateOrMonthFrom').reset();
      this.formPart2.get('changeOfDateOrMonthTo').reset();
    }
    
    this.formPart2.controls['changeOfDateOrMonthFrom'].updateValueAndValidity();
    this.formPart2.controls['changeOfDateOrMonthTo'].updateValueAndValidity();
  }

  private validationChangeOfPlaceOfBirth(status: boolean): void {
    if (status) {
      this.formPart2.get('changeOfPlaceOfBirthToDistrict').setValidators([Validators.required]);
      this.formPart2.get('changeOfPlaceOfBirthToCounty').setValidators([Validators.required]);
      this.formPart2.get('changeOfPlaceOfBirthToSubCounty').setValidators([Validators.required]);
      this.formPart2.get('changeOfPlaceOfBirthToParish').setValidators([Validators.required]);
      this.formPart2.get('changeOfPlaceOfBirthToVillage').setValidators([Validators.required]);
    } else {
      // Remove Validation
      this.formPart2.get('changeOfPlaceOfBirthToDistrict').clearValidators();
      this.formPart2.get('changeOfPlaceOfBirthToCounty').clearValidators();
      this.formPart2.get('changeOfPlaceOfBirthToSubCounty').clearValidators();
      this.formPart2.get('changeOfPlaceOfBirthToParish').clearValidators();
      this.formPart2.get('changeOfPlaceOfBirthToVillage').clearValidators();
      
      // Reset
      this.formPart2.get('changeOfPlaceOfBirthToDistrict').reset();
      this.formPart2.get('changeOfPlaceOfBirthToCounty').reset();
      this.formPart2.get('changeOfPlaceOfBirthToSubCounty').reset();
      this.formPart2.get('changeOfPlaceOfBirthToParish').reset();
      this.formPart2.get('changeOfPlaceOfBirthToVillage').reset();
    }
    
    this.formPart2.controls['changeOfPlaceOfBirthToDistrict'].updateValueAndValidity();
    this.formPart2.controls['changeOfPlaceOfBirthToCounty'].updateValueAndValidity();
    this.formPart2.controls['changeOfPlaceOfBirthToSubCounty'].updateValueAndValidity();
    this.formPart2.controls['changeOfPlaceOfBirthToParish'].updateValueAndValidity();
    this.formPart2.controls['changeOfPlaceOfBirthToVillage'].updateValueAndValidity();
  }

  private validationChangeOfYearOfBirth(status: boolean): void {
    if (status) {
      this.formPart2.get('changeOfYearOfBirthFrom').setValidators([Validators.required, Validators.pattern(/^[0-9]{4}$/)]);
      this.formPart2.get('changeOfYearOfBirthTo').setValidators([Validators.required, Validators.pattern(/^[0-9]{4}$/)]);
    } else {
      // Remove Validation
      this.formPart2.get('changeOfYearOfBirthFrom').clearValidators();
      this.formPart2.get('changeOfYearOfBirthTo').clearValidators();
      
      // Reset
      this.formPart2.get('changeOfYearOfBirthFrom').reset();
      this.formPart2.get('changeOfYearOfBirthTo').reset();
    }
    
    this.formPart2.controls['changeOfYearOfBirthFrom'].updateValueAndValidity();
    this.formPart2.controls['changeOfYearOfBirthTo'].updateValueAndValidity();
  }

  private validationChangeOfSex(status: boolean): void {
    if (status) {
      this.formPart2.get('changeOfSexFrom').setValidators([Validators.required]);
      this.formPart2.get('changeOfSexTo').setValidators([Validators.required]);
    } else {
      // Remove Validation
      this.formPart2.get('changeOfSexFrom').clearValidators();
      this.formPart2.get('changeOfSexTo').clearValidators();
      
      // Reset
      this.formPart2.get('changeOfSexFrom').reset();
      this.formPart2.get('changeOfSexTo').reset();
    }
    
    this.formPart2.controls['changeOfSexFrom'].updateValueAndValidity();
    this.formPart2.controls['changeOfSexTo'].updateValueAndValidity();
  }

  getSurnameErrorMessage(field: string) {
    return this.formPart2.get(field).hasError('required') ? 'Please enter a value' : 
    this.formPart2.get(field).hasError('maxlength') ? 'You have reached the maximum.' : 
    this.formPart2.get(field).hasError('pattern') ? 'Enter a correct name' : '';
  }

  getGivenNameErrorMessage(field: string) {
    return this.formPart2.get(field).hasError('required') ? 'Please enter a value' : 
    this.formPart2.get(field).hasError('maxlength') ? 'You have reached the maximum.' : 
    this.formPart2.get(field).hasError('pattern') ? 'Enter a correct name' : '';
  }
  
  getOtherNameErrorMessage(field: string) {
    return this.formPart2.get(field).hasError('maxlength') ? 'You have reached the maximum.' : 
    this.formPart2.get(field).hasError('pattern') ? 'Enter a correct name' : '';
  }

  getMaidenNameErrorMessage(field: string) {
    return this.formPart2.get(field).hasError('maxlength') ? 'You have reached the maximum.' : 
    this.formPart2.get(field).hasError('pattern') ? 'Enter a correct name' : '';
  }

  getPreviousNameErrorMessage(field: string) {
    return this.formPart2.get(field).hasError('maxlength') ? 'You have reached the maximum.' : 
    this.formPart2.get(field).hasError('pattern') ? 'Enter a correct name' : '';
  }

  getPRNErrorMessage() {
    return this.formPRN.get('PRN').hasError('required') ? 'Please enter a value' :
    this.formPRN.get('PRN').hasError('maxlength')
    || this.formPRN.get('PRN').hasError('pattern') ? 'Not a valid' : '';
  }

  getNINErrorMessage() {
    return this.formPart1.get('NIN').hasError('required') ? 'Please enter a value' :
    this.formPart1.get('NIN').hasError('maxlength')
    || this.formPart1.get('NIN').hasError('minlength') 
    || this.formPart1.get('NIN').hasError('pattern') ? 'Not a valid NIN' : '';
  }

  getTelephoneNumberErrorMessage() {
    return this.formPart1.get('PhoneNumber').hasError('required') ? 'Please enter your phone number' :
    this.formPart1.get('PhoneNumber').hasError('minlength')
    || this.formPart1.get('PhoneNumber').hasError('maxlength')
    || this.formPart1.get('PhoneNumber').hasError('pattern') ? 'Not a valid mobile number' : '';
  }

  getEmailErrorMessage() {
    return this.formPart1.get('EmailAddress').hasError('email') ? 'Not a valid email address.' : '';
  }

  getSelectErrorMessage() {
    return this.formPart2.get('changeOfSexFrom').hasError('required') 
    || this.formPart2.get('changeOfSexTo').hasError('required') 
    || this.formPart2.get('changeOfPlaceOfBirthToDistrict').hasError('required') 
    || this.formPart2.get('changeOfPlaceOfBirthToCounty').hasError('required') 
    || this.formPart2.get('changeOfPlaceOfBirthToSubCounty').hasError('required') 
    || this.formPart2.get('changeOfPlaceOfBirthToParish').hasError('required') 
    || this.formPart2.get('changeOfPlaceOfBirthToVillage').hasError('required')    
    ? 'Please choose one.' : '';
  }

  getChangeOfYearOfBirthErrorMessage(field: string) {
    return this.formPart2.get(field).hasError('required') ? 'Please enter a value' : 
    this.formPart2.get(field).hasError('pattern') ? 'Enter a corrent year' :'';
  }

  getClarificationOfInitialsDetailsErrorMessage() {
    return this.formPart2.get('clarificationOfInitialsDetails').hasError('required') ? 'Please enter a value' : 
    this.formPart2.get('clarificationOfInitialsDetails').hasError('maxlength') ? 'You have reached the maximum.' :'';
  }

  private fetchMultiple(): Observable<any[]> {
    this.processing = true;
    this.service.processingBar.next(this.processing);

    const reqDistrict = this.http.get(this.endpoints.ref_data_district);

    return forkJoin([reqDistrict]);
  }

  onPlaceOfBirthDistrict(DistrictID: number): void {
    this.formPart2.get('changeOfPlaceOfBirthToCounty').reset();

    this.onFetchCounties(DistrictID, 'changeOfPlaceOfBirthToCounty');
  }    

  private onFetchCounties(DistrictID: number, field: string):void {
    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.ref_data_county + '?DistrictID=' + DistrictID)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.Counties = response.data;

      if (field === 'changeOfPlaceOfBirthToCounty') {
        this.filteredCounties = this.formPart2.get('changeOfPlaceOfBirthToCounty').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterCounty(value, this.Counties))
        );        
      }

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    }); 
  }

  onPlaceOfBirthCounty(CountyID: number): void {
    this.formPart2.get('changeOfPlaceOfBirthToSubCounty').reset();

    this.onFetchSubCounties(CountyID, 'changeOfPlaceOfBirthToSubCounty');
  }    

  private onFetchSubCounties(CountyID: number, field: string):void {
    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.ref_data_sub_county + '?CountyID=' + CountyID)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.SubCounties = response.data;

      if (field === 'changeOfPlaceOfBirthToSubCounty') {
        this.filteredSubCounties = this.formPart2.get('changeOfPlaceOfBirthToSubCounty').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterSubCounty(value, this.SubCounties))
        );     
      }

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    }); 
  }  

  onPlaceOfBirthSubCounty(SubCountyID: number): void {
    this.formPart2.get('changeOfPlaceOfBirthToParish').reset();

    this.onFetchParishes(SubCountyID, 'changeOfPlaceOfBirthToParish');
  }   
  
  private onFetchParishes(SubCountyID: number, field: string):void {
    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.ref_data_parish + '?SubCountyID=' + SubCountyID)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.Parishes = response.data;

      if (field === 'changeOfPlaceOfBirthToParish') {
        this.filteredParishes = this.formPart2.get('changeOfPlaceOfBirthToParish').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterParish(value, this.Parishes))
        );        
      } 

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    }); 
  }  

  onPlaceOfBirthParish(ParishID: number): void {
    this.formPart2.get('changeOfPlaceOfBirthToVillage').reset();

    this.onFetchVillages(ParishID, 'changeOfPlaceOfBirthToVillage');
  }      

  private onFetchVillages(ParishID: number, field: string):void {
    this.httpSubscription = this.http.get<ApiPayload>(this.endpoints.ref_data_village + '?ParishID=' + ParishID)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      this.Villages = response.data;

      if (field === 'changeOfPlaceOfBirthToVillage') {
        this.filteredVillages = this.formPart2.get('changeOfPlaceOfBirthToVillage').valueChanges
        .pipe(
          startWith(''),
          map(value => this.service._filterVillage(value, this.Villages))
        );        
      } 

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    }); 
  }

  onCheckNIN(): void {
    this.NINDetails = null;

    this.formPart1.disable();

    const processSub:Subscription = this.service.processing.subscribe((results: Process) => {

      this.processing = results.state;
      
      if (!results.state) {
        processSub.unsubscribe();

        this.formPart1.enable();

        this.NINDetails = results.data;

        if (this.NINDetails.IsValid) {
          this.stepper.next();
        }
        
        this.changeDetector.detectChanges();
      }
    });
    
    this.service.onCheckNIN(this.formPart1.get('NIN').value.toUpperCase());
  }

  onGeneratePRN(): void {
    this.processing = true;

    const data = {
      TaxHeadCode: this.ServiceName,
      Name: this.NINDetails.Name,
      NIN: this.NINDetails.NIN,
      TIN: ''
    }

    this.http.post<ApiPayload>(this.endpoints.get_prn, data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      this.PRNDetails = {
        PRN: response.data.PRN,
        Amount: response.data.Amount,
        Currency: response.data.Currency,
        ExpiryDate: response.data.ExpiryDate,
      }
      
      this.processing = false;

    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });        
  }

  onPrintReceipt(): void {
    this.printReceipt = true;

    setTimeout(() =>{
      window.print();
    }, 500);
  }

  private checkIfAllDocumentsAreAttached(): void {
    let allAttached = true;

    this.requiredAttachments.filter((attachement) => {
      if (!attachement.File) {
        allAttached = false;
      }
    });

    this.allDocumentsAttached = allAttached;
  }

  onBrowseForDocument(row: ROPRequiredAttachment): void {
    this.dialogRef = this.dialog.open(UploadDocumentDialogComponent, {
      panelClass: ['upload-document-dialog', 'dialogs'],
      disableClose: true,
      data: { 
        multiple: false,
        title: row.Name
      }
    });

    this.dialogRef.afterClosed().subscribe((result: DocumentUpload) => {
      if (result) {
        row.File = result;
        
        // Check if all documents are attached.
        this.checkIfAllDocumentsAreAttached();
      }
    });      
  }

  onReplaceAttachment(row: ROPRequiredAttachment): void {
    this.onBrowseForDocument(row);
  }

  onRemoveAttachment(row: ROPRequiredAttachment): void {
    row.File = null;
  }

  private getFormData(): FormData {

    let Gazette: any;
    let DeedPoll: any;
    let MarriageCertificate: any;
    let DecreeCertificate: any;
    let StatutoryDeclaration: any;
    let BirthCertificateOrAcademicDocOrPassport: any;
    let ReportFromDGAL: any;
    let MedicalDoctorCertificate: any;

    this.requiredAttachments.filter((item) => {
      if (item.Name === 'Certified Medical Doctor'){ 
        MedicalDoctorCertificate = item.File.Document;
      } else if (item.Name === 'Report from DGAL') {
        ReportFromDGAL = item.File.Document;
      } else if (item.Name === 'Statutory declaration registered by URSB') {
        StatutoryDeclaration = item.File.Document;
      } else if (item.Name === 'Notice of Intention to change name in Gazette') {
        Gazette = item.File.Document;
      } else if (item.Name === 'Deed Poll certified by URSB') {
        DeedPoll = item.File.Document;
      } else if (item.Name === 'Certificate copy of decree absolute') {
        DecreeCertificate = item.File.Document;
      } else if (item.Name === 'Marriage Certificate (BR1)') {
        MarriageCertificate = item.File.Document;
      } else if (([
        'Academic Document issued OR Birth Certificate Or Baptism Card', 
        'Academic Document or Birth Certificate or Passport', 
        'Academic Document, Birth Certificate',
        'Birth Certificate issued before 1st January 2016 certified by URSB OR Academic Document Issued before 2014 or Passport issued before 2014',
        'Academic Document Issued before 2014 or Previous Documents especially academic before 2014 Or Certificate of Good Conduct from Interpol or Police Clearance form',
        'Academic Document Issued before 2014 or Previous Documents especially academic before 2014']).includes(item.Name)) {
        BirthCertificateOrAcademicDocOrPassport = item.File.Document;
      }
    });

    const formData = new FormData();
    formData.append('NIN', this.NINDetails.NIN);
    formData.append('ClientName', this.NINDetails.Name);
    formData.append('PRN', this.formPRN.get('PRN').value);
    formData.append('PhoneNumber', '256' + this.formPart1.get('PhoneNumber').value);
    formData.append('EmailAddress', this.formPart1.get('EmailAddress').value);
    formData.append('SelectedCategories', this.selectedCategories);
    formData.append('Gazette', Gazette);
    formData.append('DeedPoll', DeedPoll);
    formData.append('MarriageCertificate', MarriageCertificate);
    formData.append('DecreeCertificate', DecreeCertificate);
    formData.append('StatutoryDeclaration', StatutoryDeclaration);
    formData.append('BirthCertificateOrAcademicDocOrPassport', BirthCertificateOrAcademicDocOrPassport);
    formData.append('ReportFromDGAL', ReportFromDGAL);
    formData.append('MedicalDoctorCertificate', MedicalDoctorCertificate);
    formData.append('ChangeOfNameByOmittingFromSurname', this.formPart2.get('ChangeOfNameByOmittingFromSurname').value);
    formData.append('ChangeOfNameByOmittingFromGivenName', this.formPart2.get('ChangeOfNameByOmittingFromGivenName').value);
    formData.append('ChangeOfNameByOmittingFromOtherName', this.formPart2.get('ChangeOfNameByOmittingFromOtherName').value);
    formData.append('ChangeOfNameByOmittingToSurname', this.formPart2.get('ChangeOfNameByOmittingToSurname').value);
    formData.append('ChangeOfNameByOmittingToGivenName', this.formPart2.get('ChangeOfNameByOmittingToGivenName').value);
    formData.append('ChangeOfNameByOmittingToOtherName', this.formPart2.get('ChangeOfNameByOmittingToOtherName').value);
    formData.append('ChangeOfNameByAddingFromSurname', this.formPart2.get('changeOfNameByAddingFromSurname').value);
    formData.append('ChangeOfNameByAddingFromGivenName', this.formPart2.get('changeOfNameByAddingFromGivenName').value);
    formData.append('ChangeOfNameByAddingFromOtherName', this.formPart2.get('changeOfNameByAddingFromOtherName').value);
    formData.append('ChangeOfNameByAddingFromMaidenName', this.formPart2.get('changeOfNameByAddingFromMaidenName').value);
    formData.append('ChangeOfNameByAddingFromPreviousName', this.formPart2.get('changeOfNameByAddingFromPreviousName').value);
    formData.append('ChangeOfNameByAddingToSurname', this.formPart2.get('changeOfNameByAddingToSurname').value);
    formData.append('ChangeOfNameByAddingToGivenName', this.formPart2.get('changeOfNameByAddingToGivenName').value);
    formData.append('ChangeOfNameByAddingToOtherName', this.formPart2.get('changeOfNameByAddingToOtherName').value);
    formData.append('ChangeOfNameByAddingToMaidenName', this.formPart2.get('changeOfNameByAddingToMaidenName').value);
    formData.append('ChangeOfNameByAddingToPreviousName', this.formPart2.get('changeOfNameByAddingToPreviousName').value);
    formData.append('CompleteChangeOfNameFromSurname', this.formPart2.get('completeChangeOfNameFromSurname').value);
    formData.append('CompleteChangeOfNameFromGivenName', this.formPart2.get('completeChangeOfNameFromGivenName').value);
    formData.append('CompleteChangeOfNameFromOtherName', this.formPart2.get('completeChangeOfNameFromOtherName').value);
    formData.append('CompleteChangeOfNameToSurname', this.formPart2.get('completeChangeOfNameToSurname').value);
    formData.append('CompleteChangeOfNameToGivenName', this.formPart2.get('completeChangeOfNameToGivenName').value);
    formData.append('CompleteChangeOfNameToOtherName', this.formPart2.get('completeChangeOfNameToOtherName').value);
    formData.append('ChangeOfNameByDroppingNickname', this.formPart2.get('changeOfNameByDroppingNickname').value);
    formData.append('ChangeOfNameByDroppingPetName', this.formPart2.get('changeOfNameByDroppingPetName').value);
    formData.append('ChangeOfNameByDroppingTitle', this.formPart2.get('changeOfNameByDroppingTitle').value);
    formData.append('InclusionOrDeletionRadiobtn', this.formPart2.get('inclusionOrDeletionRadiobtn').value);
    formData.append('InclusionOrDeletionMaidenName', this.formPart2.get('inclusionOrDeletionMaidenName').value);
    formData.append('ChangeOfOrderOfNamesFromSurname', this.formPart2.get('changeOfOrderOfNamesFromSurname').value);
    formData.append('ChangeOfOrderOfNamesFromGivenName', this.formPart2.get('changeOfOrderOfNamesFromGivenName').value);
    formData.append('ChangeOfOrderOfNamesFromOtherName', this.formPart2.get('changeOfOrderOfNamesFromOtherName').value);
    formData.append('ChangeOfOrderOfNamesFromMaidenName', this.formPart2.get('changeOfOrderOfNamesFromMaidenName').value);
    formData.append('ChangeOfOrderOfNamesFromPreviousName', this.formPart2.get('changeOfOrderOfNamesFromPreviousName').value);
    formData.append('ChangeOfOrderOfNamesToSurname', this.formPart2.get('changeOfOrderOfNamesToSurname').value);
    formData.append('ChangeOfOrderOfNamesToGivenName', this.formPart2.get('changeOfOrderOfNamesToGivenName').value);
    formData.append('ChangeOfOrderOfNamesToOtherName', this.formPart2.get('changeOfOrderOfNamesToOtherName').value);
    formData.append('ChangeOfOrderOfNamesToMaidenName', this.formPart2.get('changeOfOrderOfNamesToMaidenName').value);
    formData.append('ChangeOfOrderOfNamesToPreviousName', this.formPart2.get('changeOfOrderOfNamesToPreviousName').value);
    formData.append('ClarificationOfInitialsRadiobtn', this.formPart2.get('clarificationOfInitialsRadiobtn').value);
    // formData.append('clarificationOfInitialsFrom', this.formPart2.get('clarificationOfInitialsFrom').value);
    // formData.append('clarificationOfInitialsTo', this.formPart2.get('clarificationOfInitialsTo').value);
    formData.append('ClarificationOfInitialsDetails', this.formPart2.get('clarificationOfInitialsDetails').value);
    formData.append('ChangeOfDateOrMonthFrom', this.formPart2.get('changeOfDateOrMonthFrom').value);
    formData.append('ChangeOfDateOrMonthTo', this.formPart2.get('changeOfDateOrMonthTo').value);
    // formData.append('changeOfPlaceOfBirthFromDistrict', this.DistrictID.toString());
    // formData.append('changeOfPlaceOfBirthFromCounty', this.CountyID.toString());
    // formData.append('changeOfPlaceOfBirthFromSubCounty', this.SubCountyID.toString());
    // formData.append('changeOfPlaceOfBirthFromParish', this.ParishID.toString());
    // formData.append('changeOfPlaceOfBirthFromVillage', this.VillageID.toString());
    formData.append('ChangeOfPlaceOfBirthToDistrict', this.DistrictID.toString());
    formData.append('ChangeOfPlaceOfBirthToCounty', this.CountyID.toString());
    formData.append('ChangeOfPlaceOfBirthToSubCounty', this.SubCountyID.toString());
    formData.append('ChangeOfPlaceOfBirthToParish', this.ParishID.toString());
    formData.append('ChangeOfPlaceOfBirthToVillage', this.VillageID.toString());
    formData.append('ChangeOfYearOfBirthFrom', this.formPart2.get('changeOfYearOfBirthFrom').value);
    formData.append('ChangeOfYearOfBirthTo', this.formPart2.get('changeOfYearOfBirthTo').value);

    return formData;
  }

  onCheckPRNStatus(): void {
    this.PRNErrorMessage = null;

    const data = {
      PRN: this.formPRN.get('PRN').value,
      NIN: this.NINDetails.NIN,
      ServiceName: this.ServiceName
    }

    this.http.post<ApiPayload>(this.endpoints.check_prn_status, data)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      console.log('response:', response);

      if (response.code === 200) {
        
      } else {

        this.PRNErrorMessage = response.message;

        this.changeDetector.detectChanges();
      }

    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });        
  }  

  onSubmit(): void {    
    this.processing = true;

    // if (this.showStepPayments) {
    //   this.onCheckPRNStatus();
    // }

    this.formPRN.disable();

    this.httpSubscription = this.http.post<ApiPayload>(this.endpoints.form_1_cop, this.getFormData())
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      console.log('response:', response);

      if (response.code === 200) {
        this.PRNErrorMessage = null;
        
        this.RecievedMessage = response.message;

        // this.formPart1.reset();
        // this.formPart2.reset();
        // this.formPRN.enable();
        // this.formPRN.reset();    
        // this.requiredAttachments.length = 0; 
        // this.selectedIndex = 0;   
        // this.NINDetails = null;
        
      } else {
        this.formPRN.enable();

        this.RecievedMessage = null;

        this.PRNErrorMessage = response.message;
      }      
      
      this.processing = false;
      
      this.changeDetector.detectChanges();

    }, (error) => {
      this.processing = false;
      this.formPRN.enable();       
      this.service.determineErrorResponse(error);
    });  
  }

  ngOnDestroy(): void {
    if (this.dialogRef) { this.dialogRef.close(); }
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
    if (this.processingSub) { this.processingSub.unsubscribe(); }
  }  
}
