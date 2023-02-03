import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiService } from 'src/app/services/api.service';
import { Tender } from '../../tenders/tenders.component';

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit, OnDestroy {

  processing = true;
  tenders: any[] = [];
  httpSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private route: Router
  ) {
  }

  ngOnInit(): void {
    this.onFetch();
  }

  private onFetch(): void {
    this.httpSubscription = this.http.get(this.endpoints.tenders + '&per_page=4')
    .pipe(catchError(this.service.handleError))
    .subscribe((response: any[]) => {

      response.filter((tender) => {
        if (tender['status'] === "publish") {
          this.tenders.push({
            tenderName: (tender['title']['rendered']).toLowerCase(),
            datePublished: new Date(tender['date_gmt']),
            tags: tender['acf']['category'],
            url: tender['acf']['pdf_url'],
            id: tender['id'],
            slug: tender['slug']
          });
        }
        
      });
              
      this.processing = false;

    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });     
  }

  onReadTender(tender: Tender): void {    
    this.service.scollToTop(0);
    this.route.navigate(['/tenders', tender.slug]);
  }

  textToShow(): number {
    const element = document.querySelector('.home-page-latest-tenders-section') as HTMLElement;
    const size = element.offsetWidth - 500;
    // return window.innerWidth <= 900 ? 300 : size;
    // return 120;
    return 160;
  }
  
  ngOnDestroy(): void {
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  } 
}
