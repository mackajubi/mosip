import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
// import * as jQuery from 'jquery';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {

  // src = 'https://platform.twitter.com/widgets.js';

  data = {
    sourceType: 'url',
    url: 'https://twitter.com/NIRA_Ug',
    screenName: 'NIRA_Ug'
  };

  opts = {
    tweetLimit: 20,
    theme: 'dark',
    // chrome: [
    //   'polite'
    // ]
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentInit() {
    // const status = (<any>window).twttr.widgets.load();

    setTimeout(() => {
      this.styleWidget();
    }, 10000);
  }

  private styleWidget(): void {
    var iframe = document.getElementById("twitter-widget-0") as HTMLIFrameElement;

    var timelineTweetListtweet = iframe.contentWindow.document.querySelectorAll(".timeline-TweetList-tweet");
    timelineTweetListtweet.forEach(li => {
      const element = li.getElementsByTagName('p')[0] as HTMLElement;
      element.style.fontFamily = "Segoe UI, Calibri, sans-serif";
      element.style.fontSize = "15px";
      element.style.fontWeight = "400";
    });

    var timelineWidget = iframe.contentWindow.document.getElementsByClassName("timeline-Widget")[0] as HTMLElement;
    timelineWidget.style.borderRadius = "0px";

    var timelineViewport = iframe.contentWindow.document.getElementsByClassName("timeline-Viewport")[0] as HTMLElement;
    timelineViewport.style.height = "453px";
    timelineViewport.style.overflowY = "auto";

    var timelineViewport = iframe.contentWindow.document.getElementsByTagName("h1")[0] as HTMLElement;
    timelineViewport.style.fontFamily = "Segoe UI, Calibri, sans-serif"; 
    timelineViewport.style.fontSize = "22px";
  }
}
