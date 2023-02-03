import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiService } from 'src/app/services/api.service';

export interface Publication {
  title: string;
  datePublished: Date;
  url: string;
  slug: string; 
}

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit, AfterViewInit, OnDestroy {
  title = "Publications";
  loading = true;
  publications: Publication[] = [];
  selected: Publication | null;
  displayedColumns: string[] = ['publication'];
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
    this.httpSubscription = this.http.get(this.endpoints.publications + '&per_page=100')
    .pipe(catchError(this.service.handleError))
    .subscribe((response: any[]) => {

      response.filter((publication, index: number) => {
        if (publication['status'] === 'publish') {
          this.publications.push({
            title: (publication['title']['rendered']).toLowerCase(),
            datePublished: new Date(publication['date_gmt']),
            url: this.service.getCMSMediaProxy(publication['acf']['pdf']),
            slug: publication['slug']
          });
  
          if (publication['slug'] === this.routeParam) {
            this.selected = this.publications[index];
          }
        }
      });
      
      this.selected = this.routeParam ? this.selected : this.publications[0];
      this.dataSource = new MatTableDataSource(this.publications);

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

  onSelectingAPublication(pubilcation: Publication): void {
    this.service.scollToTop(0);
    this.selected = pubilcation;
    this.route.navigate(['/publications', pubilcation.slug]);
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.routeParamSubscription) { this.routeParamSubscription.unsubscribe(); }
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }
}
