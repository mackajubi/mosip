import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiService } from 'src/app/services/api.service';

export interface News {
  id: number;
  title: string;
  datePublished: Date;
  image: string;
  slug: string; 
  content: string;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, AfterViewInit, OnDestroy {

  title = "News & Updates";
  loading = true;
  news: News[] = [];
  selected: News | null;
  displayedColumns: string[] = ['news'];
  dataSource;
  routeParam = null;
  routeParamSubscription: Subscription;
  httpSubscription: Subscription;
  filterValue = null;

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
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onFetch();
    });
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();

    if (this.dataSource.paginator && this.dataSource.data.length > 10) {
      this.dataSource.paginator.firstPage();
    }
  }  

  private onFetch(): void {
    this.service.loading.next(this.loading);
    
    // setTimeout(() => {
    //   this.news = [
    //     {
    //       id: 1,
    //       title: 'President receives his National Identification card.',
    //       datePublished: new Date('05/06/2021'),
    //       image: './assets/images/Launch-of-Card-Issuance.jpg',
    //       slug: 'president-receives-his-national-identification-card',
    //       content: "",          
    //     },
    //     {
    //       id: 2,
    //       title: 'President Museveni registers for the National Identification Card',
    //       datePublished: new Date('04/28/2021'),
    //       image: './assets/images/M7-8.jpg',
    //       slug: 'president-receives-his-national-identification-card',
    //       content: "",          
    //     },
    //     {
    //       id: 3,
    //       title: 'Launching of the Alien National Identification Card',
    //       datePublished: new Date('02/16/2021'),
    //       image: './assets/images/IMG_0237-300x200.jpg',
    //       slug: 'president-receives-his-national-identification-card',
    //       content: "",          
    //     },
    //   ];

    //   this.selected = this.routeParam ? this.selected : this.news[0];
    //   this.dataSource = new MatTableDataSource(this.news);

    //   setTimeout(() => {
    //     this.dataSource.paginator = this.paginator;
    //   });      

    //   this.loading = false;
    //   this.service.loading.next(this.loading);       
    // }, 1000);

    this.httpSubscription = this.http.get(this.endpoints.news + '&per_page=4')
    .pipe(catchError(this.service.handleError))
    .subscribe((response: any[]) => {

      response.filter((news, index: number) => {
        if (news['status'] === 'publish') {
          this.news.push({
            id: news['id'],
            title: news['title']['rendered'],
            datePublished: new Date(news['modified']),
            // image: news['_embedded'] ? this.service.getCMSMediaProxy(news['_embedded']['wp:featuredmedia']['0']['source_url']) : './assets/images/press_release.jpg',
            image: news['_embedded'] ? this.service.getCMSMediaProxy(news['_embedded']['wp:featuredmedia']['0']['source_url']) : './assets/images/press_release_1.jpg',
            slug: news['slug'],
            content: news['acf']['news_content'],
          });
  
          if (news['slug'] === this.routeParam) {
            this.selected = this.news[index];
          }          
        }
      });
              
      this.selected = this.routeParam ? this.selected : this.news[0];
      this.dataSource = new MatTableDataSource(this.news);

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

  onSelectingATender(news: News): void {
    this.service.scollToTop(0);
    this.selected = news;
    // this.route.navigate(['/news', news.slug]);
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.routeParamSubscription) { this.routeParamSubscription.unsubscribe(); }
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }
}
