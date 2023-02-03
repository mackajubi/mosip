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
  selector: 'app-department-finance',
  templateUrl: './department-finance.component.html',
  styleUrls: ['./department-finance.component.scss']
})
export class DepartmentFinanceComponent implements OnInit {

  title = "Department of Finance";
  loading = true;

  constructor(
    private http: HttpClient,
    private service: ApiService,
  ) {
    this.service.updatePageTitle(this.title);    
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    // this.service.processingBar.next(false);

    // if (this.bottomsheetRef) { this.bottomsheetRef.dismiss(); }
    // if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }  
}
