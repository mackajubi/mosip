import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { Speech } from 'src/app/services/api.model';
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
  selector: 'app-chairmanz-message',
  templateUrl: './chairmanz-message.component.html',
  styleUrls: ['./chairmanz-message.component.scss']
})
export class ChairmanzMessageComponent implements OnInit, AfterViewInit, OnDestroy {

  loading = true;
  speeches: Speech[] = [];
  selected: Speech | null;
  displayedColumns: string[] = ['item'];
  dataSource;
  routeParam = null;
  routeParamSubscription: Subscription;
  httpSubscription: Subscription;
  page_banner = null;
  pageSize = 10;
  title = "Chairperson's Message";

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
    this.service.loading.next(true);
    
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
    this.httpSubscription = this.http.get(this.endpoints.chairmansMessage + '&per_page=3')
    .pipe(catchError(this.service.handleError))
    .subscribe((response: any[]) => {

      response.filter((speech, index: number) => {
        if (speech['status'] === 'publish') {
          this.speeches.push({
            title: speech['title']['rendered'],
            datePublished: new Date(speech['modified']),
            url: this.service.getCMSMediaProxy(speech['acf']['pdf']),
            slug: speech['slug']
          });

          if (speech['slug'] === this.routeParam) {
            this.selected = this.speeches[index];
          }          
        }
      });
      
      this.selected = this.speeches[0];
      this.dataSource = new MatTableDataSource(this.speeches);

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

  onSelectingASpeech(item: Speech): void {
    this.service.scollToTop(0);
    this.selected = item;
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.routeParamSubscription) { this.routeParamSubscription.unsubscribe(); }
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }
}