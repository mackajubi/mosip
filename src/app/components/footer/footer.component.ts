import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

interface LatestNews {
  slug: string;
  imageSrc: string;
  datePublished: Date;
  title: string; 
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit, OnDestroy {

  latestNews: LatestNews[] = [];
  currentYear = new Date().getFullYear();  
  inMobileBrowser = false;
  mediaProxy = null;
  httpSubscription: Subscription;

  constructor(
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private http: HttpClient,
    private router: Router
  ) {
    this.checkDimensions();
    this.mediaProxy = environment.cmsMediaProxy;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.httpSubscription = this.fetchMultiple()
    .pipe(catchError(this.service.handleError))
    .subscribe((responseList) => {

      responseList[0].filter((publication) => {
        if (publication['status'] === 'publish') {
          this.latestNews.push({
            title: publication['title']['rendered'],
            imageSrc: publication['_embedded'] ? this.service.getCMSMediaProxy(publication['_embedded']['wp:featuredmedia']['0']['source_url']) : './assets/images/press_release.jpg',
            datePublished: new Date(publication['modified']),
            slug: '/publications/' + publication['slug'],
          });     
        }
      });

      responseList[1].filter((news, index: number) => {
        if (news['status'] === 'publish') {
          this.latestNews.push({
            title: news['title']['rendered'],
            imageSrc: news['_embedded'] ? this.service.getCMSMediaProxy(news['_embedded']['wp:featuredmedia']['0']['source_url']) : './assets/images/press_release_1.jpg',
            datePublished: new Date(news['modified']),
            slug: '/news/' + news['slug'],
          });
        }
      });
      
    }, (error) => {
      this.service.determineErrorResponse(error);
    });      
  }

  private checkDimensions(): void {
    this.inMobileBrowser = !this.service.isStandalone() && this.service.isAndroidOrIOS() ? true : false;
    
    window.addEventListener('resize', (e) => {
      this.inMobileBrowser = !this.service.isStandalone() && this.service.isAndroidOrIOS() ? true : false;
    });
  }  

  private fetchMultiple(): Observable<any[]> {
    const reqPublications = this.http.get(this.endpoints.publications + '&per_page=2');
    const reqNews = this.http.get(this.endpoints.news + '&per_page=2');

    return forkJoin([reqPublications, reqNews]);
  }  

  onReadMore(news: any): void {
    this.service.scollToTop(0);
    this.router.navigate([news.slug]);
  }

  onScrollToTop(): void {
    this.service.scollToTop(0);
  }

  ngOnDestroy(): void {
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }    
}
