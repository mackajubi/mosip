import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SkitterImages } from 'src/app/components/components.model';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, OnDestroy, AfterContentInit {

  processing = true;
  httpSubscription: Subscription;
  imageSources: SkitterImages[] = [];  

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.httpSubscription = this.fetchMultiple()
    .pipe(catchError(this.service.handleError))
    .subscribe((responseList) => {

      // console.log('responseList:', responseList);

      const edzComm = responseList[0][0];
      // const publication = responseList[1][0];

      responseList[1].filter((publication) => {
        this.imageSources.push({
          img: publication['_embedded'] ? this.service.getCMSMediaProxy(publication['_embedded']['wp:featuredmedia']['0']['source_url']) : './assets/images/press_release.jpg',
          className: this.service.getSlideShowClass(0),
          title: publication['title']['rendered'],
          caption: 'Published on ' + this.datePipe.transform(new Date(publication['modified']), 'EEEE, MMMM d, yyyy'),
          slug: '/publications/' + publication['slug'],
        });
      });

      responseList[2].filter((news, index: number) => {
        if (news['status'] === 'publish') {
          this.imageSources.push({
            img: news['_embedded'] ? this.service.getCMSMediaProxy(news['_embedded']['wp:featuredmedia']['0']['source_url']) : './assets/images/press_release_1.jpg',
            className: this.service.getSlideShowClass(++index),
            title: news['title']['rendered'],
            caption: 'Published on ' + this.datePipe.transform(new Date(news['modified']), 'EEEE, MMMM d, yyyy'),
            slug: '/news/' + news['slug'],
            url: news['acf']['url'] ? news['acf']['url'] : null
          });
        }
      });

      this.imageSources.push({
        img: edzComm['_embedded'] ? this.service.getCMSMediaProxy(edzComm['_embedded']['wp:featuredmedia']['0']['source_url']) : './assets/images/press_release.jpg',
        className: this.service.getSlideShowClass(1),
        title: edzComm['title']['rendered'],
        caption: 'Ms. Rosemary Kisembo',
        slug: '/about-nira/edz-message/' + edzComm['slug'],
      });
      
      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });    
  }

  private fetchMultiple(): Observable<any[]> {
    this.processing = true;

    // const reqGallery = this.http.get(this.endpoints.gallery + '&per_page=1');
    const reqEDzMessage = this.http.get(this.endpoints.edzMessage + '&per_page=1');
    const reqPublications = this.http.get(this.endpoints.publications + '&per_page=3');
    const reqNews = this.http.get(this.endpoints.news + '&per_page=5');

    return forkJoin([reqEDzMessage, reqPublications, reqNews]);
  }  

  onReadMore(url: string): void {
    this.router.navigate([url]);
  }  

  ngOnDestroy(): void {
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }   
}

