import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiService } from 'src/app/services/api.service';

export interface BoardOfDirector {
  name: string;
  role: string;
  imageSrc: string;
}

@Component({
  selector: 'app-board-of-directors',
  templateUrl: './board-of-directors.component.html',
  styleUrls: ['./board-of-directors.component.scss']
})
export class BoardOfDirectorsComponent implements OnInit, AfterViewInit, OnDestroy {

  title = "Board Of Directors";
  loading = true;
  httpSubscription: Subscription;

  boardOfDirectors: BoardOfDirector[] = [];
  chairperson: BoardOfDirector | null;
  boardOfDirectorsOne: BoardOfDirector[] = [];
  boardOfDirectorsTwo: BoardOfDirector[] = [];
  boardOfDirectorsThree: BoardOfDirector[] = [];
  boardOfDirectorsFour: BoardOfDirector[] = [];

  renderAll = false;

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
  ) {

    this.service.updatePageTitle(this.title);

  }

  ngOnInit(): void {
    
    window.addEventListener('resize', (e) => {
      this._checkDimensions();
    });

  }

  private _checkDimensions(): void {
    this.renderAll = window.innerWidth <= 1200 ? true : false;

    if (window.innerWidth > 1260) {
      this.boardOfDirectorsOne.length = 0;
      this.boardOfDirectorsTwo.length = 0;
      this.boardOfDirectorsThree.length = 0;
      this.boardOfDirectorsFour.length = 0;
      this.renderAll = false;

      this.boardOfDirectors.filter((item) => {
        if (this.boardOfDirectorsOne.length < 4) {
          this.boardOfDirectorsOne.push(item);
        } else if (this.boardOfDirectorsTwo.length < 4){
          this.boardOfDirectorsTwo.push(item);
        }
      });
    } else if (window.innerWidth <= 1260 && window.innerWidth > 930) {
      this.boardOfDirectorsOne.length = 0;
      this.boardOfDirectorsTwo.length = 0;
      this.boardOfDirectorsThree.length = 0;
      this.boardOfDirectorsFour.length = 0;
      this.renderAll = false;

      this.boardOfDirectors.filter((item) => {
        if (this.boardOfDirectorsOne.length < 3) {
          this.boardOfDirectorsOne.push(item);
        } else if (this.boardOfDirectorsTwo.length < 3){
          this.boardOfDirectorsTwo.push(item);
        } else if (this.boardOfDirectorsThree.length < 3){
          this.boardOfDirectorsThree.push(item);
        }
      });      
    } else if (window.innerWidth <= 930 && window.innerWidth > 640) {
      this.boardOfDirectorsOne.length = 0;
      this.boardOfDirectorsTwo.length = 0;
      this.boardOfDirectorsThree.length = 0;
      this.boardOfDirectorsFour.length = 0;
      this.renderAll = false;

      this.boardOfDirectors.filter((item) => {
        if (this.boardOfDirectorsOne.length < 2) {
          this.boardOfDirectorsOne.push(item);
        } else if (this.boardOfDirectorsTwo.length < 2){
          this.boardOfDirectorsTwo.push(item);
        } else if (this.boardOfDirectorsThree.length < 2){
          this.boardOfDirectorsThree.push(item);
        } else if (this.boardOfDirectorsFour.length < 2){
          this.boardOfDirectorsFour.push(item);
        }
      });      
    } else if (window.innerWidth <= 640) {
      this.boardOfDirectorsOne.length = 0;
      this.boardOfDirectorsTwo.length = 0;
      this.boardOfDirectorsThree.length = 0;

      this.renderAll = true;      
    }
  }

  ngAfterViewInit(): void {
    this.service.loading.next(this.loading);

    setTimeout(() => {
      this.onFetch();
    }, 1000);
  }

  private onFetch(): void {
    this.httpSubscription = this.http.get(this.endpoints.boardOfDirectors)
    .pipe(catchError(this.service.handleError))
    .subscribe((response: any[]) => {

      response.filter((director, index: number) => {
        if (director['status'] === "publish") {
          this.boardOfDirectors.push({
            name: director['acf']['name'],
            imageSrc: director['acf']['image'] ? this.service.getCMSMediaProxy(director['acf']['image']['url']) : '',
            role: director['acf']['role']
          });  
          
          if (director['acf']['role'] === 'Chairperson') {
            this.chairperson = this.boardOfDirectors[index];
            this.boardOfDirectors.splice(index,1);
          }

        }
      });      
      
      this._checkDimensions();

      this.loading = false;
      this.service.loading.next(this.loading);

    }, (error) => {
      this.loading = false;
      this.service.loading.next(this.loading);
      this.service.determineErrorResponse(error);
    });  
  }

  ngOnDestroy(): void {
    if (this.httpSubscription) { this.httpSubscription.unsubscribe(); }
  }    
}
