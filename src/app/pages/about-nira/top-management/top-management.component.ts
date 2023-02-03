import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiService } from 'src/app/services/api.service';

export interface BoardOfDirector {
  name: string;
  role: string;
  imageSrc: string;
}

@Component({
  selector: 'app-top-management',
  templateUrl: './top-management.component.html',
  styleUrls: ['./top-management.component.scss']
})
export class TopManagementComponent implements OnInit, AfterViewInit {

  title = "Top Managemnt Team";
  loading = true;

  boardOfDirectors: BoardOfDirector[] = [];
  chairperson: BoardOfDirector | null;
  boardOfDirectorsOne: BoardOfDirector[] = [];
  boardOfDirectorsTwo: BoardOfDirector[] = [];

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {

    this.service.updatePageTitle(this.title);

  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.service.loading.next(this.loading);

    setTimeout(() => {
      this.onFetch();
    }, 1000);
  }

  private onFetch(): void {
    this.boardOfDirectors = [
      {
        name: 'Mr. Joseph N.Biribonwa',
        role: 'Chairperson',
        imageSrc: './assets/images/board_of_directors/Mr. Joseph N. Biribonwa.fw.png',
      },
      {
        name: 'Ms Ruth Nvumetta Kavuma',
        role: 'Vice Chairperson',
        imageSrc: './assets/images/board_of_directors/Ms Ruth Nvumetta Kavuma.fw.png',
      },
      {
        name: 'Dr. Betty Kivumbi Nannyonga',
        role: 'Member',
        imageSrc: './assets/images/board_of_directors/Dr. Betty Kivumbi Nannyonga.fw.png',
      },
      {
        name: 'Maj. Gen. Apollo Kasita-Gowa',
        role: 'Member',
        imageSrc: './assets/images/board_of_directors/Maj. Gen. Apollo Kasita-Gowa.fw.png',
      },
      {
        name: 'Dr. Paul Kintu.fw.png',
        role: 'Member',
        imageSrc: './assets/images/board_of_directors/Dr. Paul Kintu.fw.png',
      },
      {
        name: 'Dr. Chris NdatiraMukiza',
        role: 'Member',
        imageSrc: './assets/images/board_of_directors/Dr. Chris NdatiraMukiza.fw.png',
      },
      {
        name: 'Justice Simon Byabakama',
        role: 'Member',
        imageSrc: './assets/images/board_of_directors/Justice Simon Byabakama.fw.png',
      },
      {
        name: 'Brig. Gen. Stephen Kwiringira',
        role: 'Ag. Executive Director',
        imageSrc: './assets/images/board_of_directors/Brig. Gen. Stephen Kwiringira.fw.png',
      },
    ];

    this.boardOfDirectors.filter((item) => {

      if (item.role === 'Chairperson') {
        this.chairperson = item;
      } else if (this.boardOfDirectorsOne.length < 4) {
        this.boardOfDirectorsOne.push(item);
      } else if (this.boardOfDirectorsTwo.length < 4){
        this.boardOfDirectorsTwo.push(item);
      }

    });

    this.boardOfDirectors.length = 0;

    this.loading = false;

    this.service.loading.next(this.loading);
  }
}
