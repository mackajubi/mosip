import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiService } from 'src/app/services/api.service';

export interface Tender {
  id: number;
  tenderName: string;
  datePublished: Date;
  tags?: string[],
  url: string;
  slug: string; 
}

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit, AfterViewInit, OnDestroy {
  title = "Tenders";
  loading = true;
  tenders: Tender[] = [];
  selected: Tender | null;
  displayedColumns: string[] = ['tenders'];
  dataSource;
  routeParam = null;
  routeParamSubscription: Subscription;
  httpSubscription: Subscription;
  page_banner = null;
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
    this.service.loading.next(this.loading);
    this.service.scollToTop(0);

    setTimeout(() => {
      this.onFetch();
    }, 1000);
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
    
    this.httpSubscription = this.http.get(this.endpoints.tenders + '&per_page=100')
    .pipe(catchError(this.service.handleError))
    .subscribe((response: any[]) => {

      response.filter((tender, index: number) => {
        if (tender['status'] === 'publish') {
          this.tenders.push({
            id: tender['id'],
            tenderName: (tender['title']['rendered']).toLowerCase(),
            datePublished: new Date(tender['date_gmt']),
            tags: tender['acf']['category'],
            url: this.service.getCMSMediaProxy(tender['acf']['pdf']),
            slug: tender['slug']
          });
  
          if (tender['slug'] === this.routeParam) {
            this.selected = this.tenders[index];
          }
        }
      });
      
      this.selected = this.routeParam ? this.selected : this.tenders[0];
      this.dataSource = new MatTableDataSource(this.tenders);

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });    

      this.loading = false;
      this.service.loading.next(this.loading);

    }, (error) => {
      this.loading = false;
      this.service.loading.next(this.loading);
      this.service.determineErrorResponse(error);
    });       
  }

  onSelectingATender(tender: Tender): void {
    this.service.scollToTop(0);
    this.selected = tender;
    this.route.navigate(['/tenders', tender.slug]);
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.routeParamSubscription) { this.routeParamSubscription.unsubscribe(); }
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }
}
