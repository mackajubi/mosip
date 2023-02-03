import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SkitterImages } from '../components.model';

@Component({
  selector: 'app-page-carousel',
  templateUrl: './page-carousel.component.html',
  styleUrls: ['./page-carousel.component.scss']
})
export class PageCarouselComponent implements OnInit, OnChanges {

  loading = true;
  url: null;

  @Input() imageSources: SkitterImages[] = [];
  @Input() backgroundColor: string = '#fec732';
  @Input() size: number = 255;
  @Input() readMore = false;

  constructor( private route: Router ){ }

  ngOnInit(): void { }

  private checkDimensions(): void {
    if (window.innerWidth <= 366) {
      this.size = 30;
    } else if (window.innerWidth <= 552){
      this.size = 80;
    } else {
      this.size = 255;
    }
  }

  loadScript() {
    let isFound = false;
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes('loader')) {
        isFound = true;
      }
    }

    if (!isFound) {
      const dynamicScripts = [
        'assets/js/jquery.easing.1.3.js',
        'assets/js/skitter/jquery.skitter.js',
        'assets/js/app.js',
      ];

      for (let i = 0; i < dynamicScripts.length; i++) {
        const node = document.createElement('script');
        node.src = dynamicScripts [i];
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
      }
    }
  }

  onReadMore(): void {
    const parent = document.querySelector('.container_skitter') as HTMLElement;
    const childParent = parent.querySelector('.image') as HTMLElement;
    const child = childParent.querySelector('a') as HTMLElement;
    const slug: string = child.getAttribute('href');

    if (this.readMore) {
      if (slug.includes('http')) {
        window.open(slug);
      } else {
        this.route.navigate([slug]);
      }      
    }
  }

  ngOnChanges() {
    if (this.imageSources.length && this.loading) {
      this.checkDimensions();
      this.loading = false;
      this.loadScript();
    }
  }
}
