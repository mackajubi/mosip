import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BirthSongDialogComponent } from 'src/app/dialogs/key-services/birth-song-dialog/birth-song-dialog.component';
import { ConfirmationOfInformationDialogComponent } from 'src/app/dialogs/key-services/confirmation-of-information-dialog/confirmation-of-information-dialog.component';
import { PrintNinSlipDialogComponent } from 'src/app/dialogs/key-services/print-nin-slip-dialog/print-nin-slip-dialog.component';
import { TrackStatusDialogComponent } from 'src/app/dialogs/key-services/track-status-dialog/track-status-dialog.component';
import { VerifyNiraDocumentsDialogComponent } from 'src/app/dialogs/key-services/verify-nira-documents-dialog/verify-nira-documents-dialog.component';

@Component({
  selector: 'app-key-services',
  templateUrl: './key-services.component.html',
  styleUrls: ['./key-services.component.scss']
})
export class KeyServicesComponent implements OnInit, OnDestroy, AfterContentInit {

  render = true;
  selected = null;
  dialogRef;  
  slideConfig = {
    slidesToShow: 2, 
    slidesToScroll: 1, 
    autoplay: true,
    autoplaySpeed: 4000,
    // autoplaySpeed: 1200000,
    dots: false,
    arrows: true,
  };    
  birthSongMonth = false;
  // birthSongMonth = 9;

  constructor(
    private dialog: MatDialog
  ) {
    this.birthSongMonth = new Date().getMonth() === 11 && new Date().getFullYear() === 2021 ? true : false;
  }

  ngOnInit(): void {

    this.checkDimensions();

    window.addEventListener('resize', (e) => {
      this.checkDimensions();
    });

    setTimeout(() => {
      this.render = true;
    }, 800);
  }

  ngAfterContentInit(): void {
    if (this.birthSongMonth) {
      setTimeout(() => {
        this.onRegisterForBirthSong();
      }, 5000);
    }    
  }

  private checkDimensions(): void {
    if (window.innerWidth <= 600) {
      this.slideConfig = {
        slidesToShow: 1, 
        slidesToScroll: 1, 
        autoplay: true,
        autoplaySpeed: 4000,
        dots: false,
        arrows: true,
      };    
    } else {
      this.slideConfig = {
        slidesToShow: 2, 
        slidesToScroll: 1, 
        autoplay: true,
        autoplaySpeed: 4000,
        dots: false,
        arrows: true,
      };    
    }
  }

  onTrackStatus(): void {
    this.dialogRef = this.dialog.open(TrackStatusDialogComponent, {
      panelClass: ['track-status-dialog', 'dialogs', 'scrollbar'],
      disableClose: true,
    });  

    this.dialogRef.afterClosed().subscribe(() => {
      this.selected = null;
    });
  } 
  
  onConfirmationOfInformation(): void {
    this.dialogRef = this.dialog.open(ConfirmationOfInformationDialogComponent, {
      panelClass: ['confirmation-of-information-dialog', 'dialogs', 'scrollbar'],
      disableClose: true,
    });  

    this.dialogRef.afterClosed().subscribe(() => {
      this.selected = null;
    });
  } 

  onVerifyNIRADocuments(): void {
    this.dialogRef = this.dialog.open(VerifyNiraDocumentsDialogComponent, {
      panelClass: ['verify-nira-documents-dialog', 'dialogs', 'scrollbar'],
      disableClose: true,
    });  

    this.dialogRef.afterClosed().subscribe(() => {
      this.selected = null;
    });
  }

  onPrintNINSlip(): void {
    this.dialogRef = this.dialog.open(PrintNinSlipDialogComponent, {
      panelClass: ['print-nin-slip-dialog', 'dialogs', 'scrollbar'],
      disableClose: true,
    });  

    this.dialogRef.afterClosed().subscribe(() => {
      this.selected = null;
    });
  }

  onRegisterForBirthSong(): void {
    if (this.birthSongMonth) {
      this.selected = 'Birth Registration Competition';
      
      this.dialogRef = this.dialog.open(BirthSongDialogComponent, {
        panelClass: ['birth-song-dialog', 'dialogs', 'scrollbar'],
        disableClose: true,
      });  
  
      this.dialogRef.afterClosed().subscribe(() => {
        this.selected = null;
      });      
    }
  }
  
  ngOnDestroy(): void {
    if (this.dialogRef) { this.dialogRef.close(); }
  }    
}
