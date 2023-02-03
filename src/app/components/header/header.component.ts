import { ChangeDetectorRef, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  activeDropdown = null;
  mobile = false;
  toggleNav = false;
  scrollingUp = false;
  scrollingposition = 0; 
  subscription: Subscription;
  dialogRef?: any;
  baseURL = environment.cmsMediaProxy;
  
  @Output() navToggleEvent = new EventEmitter();

  constructor( 
    private dialog: MatDialog,
    private service: ApiService,
    private changeDetector: ChangeDetectorRef    
  ) { }

  ngOnInit(): void {
    this.activeDropdown = location.href.split('/')[3];

    this._checkDimensions();

    window.addEventListener('resize', () => {
      this._checkDimensions();
    });

    this.subscription = this.service.scrollingUp.subscribe((status: { state: boolean, position: number }) => {
      this.scrollingUp = this.toggleNav && window.innerWidth <= 910 ? true : status.state;
      this.scrollingposition = status.position;
      this.changeDetector.detectChanges();
    });
  }  

  _checkDimensions() {
    this.mobile = window.innerWidth <= 910 ? true : false;

    this.navToggleEvent.emit(this.mobile && this.toggleNav ? true : false);
  }

  onToggleNav() {
    this.toggleNav = !this.toggleNav;

    this.navToggleEvent.emit(this.toggleNav);
  }

  onScrollToElement(id: string): void {
    document.getElementById(id).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }

  onOpenUrl(url: string): void {
    window.open(url, '_blank');
  }

  onGoToTop(parent?: string): void {
    this.activeDropdown = parent;
    this.service.scollToTop(0);
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }  
}
