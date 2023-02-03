import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ApplicationRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiEndpointsService } from './services/api-endpoints.service';
import { ApiPayload } from './services/api.model';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  
  loading = true;
  loadingSub: Subscription;
  previousScrollPosition = 0;
  scrollingUp = false;
  dialogRef;

  constructor(
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private swUpdate: SwUpdate,
    private appRef: ApplicationRef,
    private dialog: MatDialog,
    private http: HttpClient
  ) { 
    this.loadingSub = this.service.loading.subscribe((status: boolean) => this.loading = status);
  }

  ngOnInit(): void {
    this.checkUpdate();
    // this.getAnnouncements();
  }

  ngAfterViewInit(): void {
    setTimeout(() => { 
      this.loading = false; 
      // this.showAnnouncement();
    }, 1000);   
  }  

  private checkUpdate(): void {
    this.swUpdate.available.subscribe(event => {
      if (event.available) {
        this.service.openSnackBar('We have an update available.', 'success-lg');

        this.swUpdate.activateUpdate().then((resolved) => {
          setTimeout(() => {
            document.location.reload();
          }, 4000);
        });
      }
    }); 
  }

  onScroll() {
    const homeEle = document.getElementById('main-content-wrapper') as HTMLElement;

    const st = window.pageYOffset || homeEle.scrollTop;

    // this.scrollingUp = st < this.previousScrollPosition ? true : st < 200 ? true : false;
    this.scrollingUp = st < this.previousScrollPosition ? true : false;

    this.service.scrollingUp.next({
      state: this.scrollingUp,
      position: st
    });

    this.previousScrollPosition = st <= 0 ? 0 : st;
  }

  private getAnnouncements(): void {

    this.http.get<ApiPayload>(this.endpoints.get_otp)
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      console.log('response:', response);

      // this.showAnnouncement();

    }, (error) => {
      this.service.determineErrorResponse(error);
    }); 
  }  

  private showAnnouncement(): void {

    // this.dialogRef = this.dialog.open(AnouncementDialogComponent, {
    //   panelClass: ['announcement-dialog', 'dialogs', 'scrollbar'],
    //   disableClose: true,
    // });
  }

  ngOnDestroy(): void {
    if (this.loadingSub) { this.loadingSub.unsubscribe(); }
  }
}
