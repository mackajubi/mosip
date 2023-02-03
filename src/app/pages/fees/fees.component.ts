import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.scss']
})
export class FeesComponent implements OnInit {

  title = "Form Fees";
  subTitle = "For Registration of Persons"
  loading = true;

  selectedRow: Fee = null;
  displayedColumns: string[] = ['Count', 'SubCategory', 'TaxHead'];
  
  idDataSource: MatTableDataSource<Fee>;  
  birthDataSource: MatTableDataSource<Fee>;  
  deathDataSource: MatTableDataSource<Fee>;  

  idFees: Fee[] = [
    {
      SubCategory: 'Change of information',
      SubCategoryDetails: [
        {
          TaxHead: 'New ID First Enrollment',
          Currency: null,
          Fee: null
        },
        {
          TaxHead: 'New ID Replacement',
          Currency: 'UGX ',
          Fee: '50000'
        },
      ],
    },
    {
      SubCategory: 'Correction of Errors',
      SubCategoryDetails: [
        {
          TaxHead: 'New ID required',
          Currency: 'UGX ',
          Fee: '50000'
        },
        {
          TaxHead: 'New ID not required',
          Currency: null,
          Fee: null
        },
      ],
    },
    {
      SubCategory: 'New alien’s ID card',
      SubCategoryDetails: [
        {
          TaxHead: null,
          Currency: 'USD ',
          Fee: '100'
        },
      ],
    },
    {
      SubCategory: 'Confirmation of a person’s Information in the register ',
      SubCategoryDetails: [
        {
          TaxHead: null,
          Currency: 'UGX ',
          Fee: '1000'
        },
      ],
    },
    {
      SubCategory: 'Renewal of ID',
      SubCategoryDetails: [
        {
          TaxHead: 'Renewal of National ID',
          Currency: 'UGX ',
          Fee: '50000'
        },
        {
          TaxHead: 'Renewal of Alien’s ID',
          Currency: 'USD ',
          Fee: '100'
        },
      ],
    },  
  ];

  birthFees: Fee[] = [
    {
      SubCategory: 'Nationals',
      SubCategoryDetails: [
        {
          TaxHead: ' Certificate of Birth-Nationals',
          Currency: 'UGX ',
          Fee: '5000'
        },
        {
          TaxHead: 'Change of Name of an Adult',
          Currency: 'UGX ',
          Fee: '150000'
        },
        {
          TaxHead: 'Change of Name of a Child',
          Currency: 'UGX ',
          Fee: '20000'
        },
        {
          TaxHead: 'Certified Copy of an Entry in the Register',
          Currency: 'UGX ',
          Fee: '1000'
        },
        {
          TaxHead: 'Search in the Register',
          Currency: 'UGX ',
          Fee: '1000'
        },
      ],
    },
    {
      SubCategory: 'Foreigners',
      SubCategoryDetails: [
        {
          TaxHead: 'Change of Name of an Adult',
          Currency: null,
          Fee: null
        },
        {
          TaxHead: 'Change of Name of a Child',
          Currency: null,
          Fee: null
        },   
        {
          TaxHead: 'Certificate of Birth-Foreigners',
          Currency: 'USD ',
          Fee: '40'
        },
        {
          TaxHead: 'Late Registration of Birth',
          Currency: 'USD ',
          Fee: '20'
        },        
        {
          TaxHead: 'Certified Copy of an Entry in the Register',
          Currency: null,
          Fee: null
        },
        {
          TaxHead: 'Search in the Register',
          Currency: null,
          Fee: null
        },             
      ],
    },  
  ];

  deathFees: Fee[] = [
    {
      SubCategory: 'Nationals',
      SubCategoryDetails: [
        {
          TaxHead: 'Certificate of Death',
          Currency: 'UGX ',
          Fee: '5000'
        },
      ],
    },
    {
      SubCategory: 'Foreigners',
      SubCategoryDetails: [
        {
          TaxHead: 'Certificate of Death',
          Currency: null,
          Fee: null
        },            
      ],
    },  
  ];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;  

  constructor(
    private http: HttpClient,
    private service: ApiService,
  ) {
    this.service.updatePageTitle(this.title + '-' + this.subTitle);    
  }

  ngOnInit(): void {
    this.idDataSource = new MatTableDataSource(this.idFees);
    this.birthDataSource = new MatTableDataSource(this.birthFees);
    this.deathDataSource = new MatTableDataSource(this.deathFees);

    setTimeout(() => {
      this.idDataSource.paginator = this.paginator;
      this.idDataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
    // this.service.processingBar.next(false);

    // if (this.bottomsheetRef) { this.bottomsheetRef.dismiss(); }
    // if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }  
}
