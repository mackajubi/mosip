import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiService } from 'src/app/services/api.service';

export interface Procedure {
  id: number;
  title: string;
  datePublished: Date;
  content: string;
  slug: string; 
}

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.component.html',
  styleUrls: ['./procedures.component.scss']
})
export class ProceduresComponent implements OnInit, AfterViewInit, OnDestroy {
  title = "Procedures";
  loading = true;
  procedures: Procedure[] = [];
  selected: Procedure | null;
  displayedColumns: string[] = ['procedure'];
  dataSource;
  routeParam = null;
  routeParamSubscription: Subscription;
  httpSubscription: Subscription;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private route: Router

  ) {
    this.routeParamSubscription = this.activatedRoute.paramMap.subscribe((params) => {
      this.routeParam = params.get('slug');
      // console.log('routeParam:', this.routeParam);
    });

    this.service.updatePageTitle(this.title);
  }

  ngOnInit(): void {
    this.checkDimensions();

    window.addEventListener('resize', () => {
      this.checkDimensions();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onFetch();
    });
  }

  private checkDimensions(): void {
    this.pageSize = window.innerWidth <= 640 ? 5 : 10;  
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator && this.dataSource.data.length > 10) {
      this.dataSource.paginator.firstPage();
    }
  }  

  private onFetch(): void {
    this.service.loading.next(this.loading);
    
    setTimeout(() => {
      this.procedures = [
        {
          id: 1,
          title: 'Facts about NIRA',
          datePublished: new Date('05/06/2021'),
          content: "",  
          slug: 'facts-about-nira'
        },
        {
          id: 2,
          title: 'List of persons whose cards are ready for issuance-Western Region',
          datePublished: new Date('05/06/2021'),
          content: "",  
          slug: 'list-of-persons-whose-cards-are-ready-for-issuance-western-region'
        },
      ];

      this.selected = this.routeParam ? this.selected : this.procedures[0];
      this.dataSource = new MatTableDataSource(this.procedures);

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });      

      this.loading = false;

      this.service.loading.next(this.loading);       
    }, 1000);

    // this.httpSubscription = this.http.get(this.endpoints.tenders + '&per_page=100')
    // .pipe(catchError(this.service.handleError))
    // .subscribe((response: any[]) => {

    //   response.filter((tender, index: number) => {
    //     if (tender['status'] === 'publish') {
    //       this.publications.push({
    //         id: tender['id'],
    //         tenderName: (tender['title']['rendered']).toLowerCase(),
    //         datePublished: new Date(tender['date_gmt']),
    //         tags: tender['acf']['category'],
    //         url: this.service.getCMSMediaProxy(tender['acf']['pdf']),
    //         slug: tender['slug']
    //       });
  
    //       if (tender['slug'] === this.routeParam) {
    //         this.selected = this.publications[index];
    //       }
    //     }
    //   });
      
    //   this.selected = this.routeParam ? this.selected : this.publications[0];
    //   this.dataSource = new MatTableDataSource(this.publications);

    //   setTimeout(() => {
    //     this.dataSource.paginator = this.paginator;
    //   });          
    //   this.processing = false;

    // }, (error) => {
    //   this.processing = false;
    //   this.service.determineErrorResponse(error);
    // });       
  }

  onSelectingAPublication(procedure: Procedure): void {
    this.service.scollToTop(0);
    // this.service.scollToTop(window.innerWidth <= 768 ? 310 : 400);
    this.selected = procedure;
    // this.route.navigate(['/publications', pubilcation.slug]);
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.routeParamSubscription) { this.routeParamSubscription.unsubscribe(); }
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }
}
