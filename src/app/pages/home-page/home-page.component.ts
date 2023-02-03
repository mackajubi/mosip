import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PrintNinSlipDialogComponent } from 'src/app/dialogs/key-services/print-nin-slip-dialog/print-nin-slip-dialog.component';
import { VerifyNiraDocumentsDialogComponent } from 'src/app/dialogs/key-services/verify-nira-documents-dialog/verify-nira-documents-dialog.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {

  dialogRef;
  routeSub: Subscription;
  routeParams: { 
    service: string; 
    data: string;
    nin?: string;
  } | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {   
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {

      this.routeParams = {
        service: params.get('service'),
        data: params.get('code')
          + '/' + params.get('day') 
          + '/' + params.get('month') 
          + '/' + params.get('yr') 
          + '/' + params.get('rand'),
        nin: params.get('nin')
      };

      if (params.get('service') === 'ninslip') {
        this.onPrintNINSlip();
      } else if (params.get('service') === 'coi') {
        this.onVerifyNIRADocuments();
      }
    });  
  }

  ngOnInit(): void {
  }

  private onPrintNINSlip(): void {
    this.dialogRef = this.dialog.open(PrintNinSlipDialogComponent, {
      panelClass: ['print-nin-slip-dialog', 'dialogs', 'scrollbar'],
      disableClose: true,
      data: {
        verify: true,
        ReferenceNo: this.routeParams.data
      }
    });  

    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  private onVerifyNIRADocuments(): void {
    this.dialogRef = this.dialog.open(VerifyNiraDocumentsDialogComponent, {
      panelClass: ['verify-nira-documents-dialog', 'dialogs', 'scrollbar'],
      disableClose: true,
      data: {
        verify: true,
        ReferenceNo: this.routeParams.data,
        NIN: this.routeParams.nin,
        Service: this.routeParams.service
      }      
    });  

    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }  

  ngOnDestroy(): void {
    if (this.dialogRef) { this.dialogRef.close(); }
    // if (this.routeSub) { this.routeSub.unsubscribe(); }
  }
}
