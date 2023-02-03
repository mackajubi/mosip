import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-banner',
  templateUrl: './page-banner.component.html',
  styleUrls: ['./page-banner.component.scss']
})
export class PageBannerComponent implements OnInit {

  render = false;

  @Input() title: string = null;
  @Input() subTitle: string = null;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.render = true;
    }, 500);
  }

}
