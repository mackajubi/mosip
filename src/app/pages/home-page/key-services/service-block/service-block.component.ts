import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-block',
  templateUrl: './service-block.component.html',
  styleUrls: ['./service-block.component.scss']
})
export class ServiceBlockComponent implements OnInit {

  @Input() icon: string = null;
  @Input() iconColor: string = null;
  @Input() iconBg: string = null;
  @Input() title: string = null;
  @Input() subTitle: string = null;
  @Input() text: string = null;
  @Input() href?: string = null;
  @Input() fixedHeight = false;
  @Input() removeHeaderMargin = false;
  @Input() selected: string = null;

  constructor() { }

  ngOnInit(): void {
  }

  onClick(): void {
    if (this.href) {
      window.open(this.href, '_blank');
    }
  }
}
