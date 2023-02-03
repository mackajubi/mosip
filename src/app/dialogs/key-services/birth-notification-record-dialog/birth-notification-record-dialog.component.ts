import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BirthNotificationRecord } from 'src/app/pages/services-and-forms/services-and-forms.model';
import * as html2pdf from 'html2pdf.js';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-birth-notification-record-dialog',
  templateUrl: './birth-notification-record-dialog.component.html',
  styleUrls: ['./birth-notification-record-dialog.component.scss']
})
export class BirthNotificationRecordDialogComponent implements OnInit {

  today = new Date();

  constructor(
    private dialogRef: MatDialogRef<BirthNotificationRecordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { row: BirthNotificationRecord },
    private datePipe: DatePipe,
    private service: ApiService,
  ) { }

  ngOnInit(): void {
    this.onDownloadLetter();
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  getDateSuperscript(date: Date): string {
    let day = parseInt(this.datePipe.transform(date, 'd'));

    if (day === 1 || day === 21) {
      return 'st';
    } else if (day === 2 || day === 22) {
      return 'nd';
    } else if (day === 3 || day === 23) {
      return 'rd';
    } else {
      return 'th';
    }
  }

  onDownloadLetter(): void {

    this.service.openSnackBar('Downloading. Please wait.', 'nuetral');

    const options = {
      filename: this.data.row.ChildSurname.toUpperCase() + ' ' + this.data.row.ChildGivenName.toUpperCase() + "'s Birth Notification Record.pdf",
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        backgroundColor: null,
      },
      jspdf: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
      },
      margin: 1,
    };

    const content: Element = document.getElementById('letterBodyContainer');

    html2pdf()
    .from(content)
    .set(options)
    .save()
    .then((onFulfilled) => {

      setTimeout(() => {
        this.service.openSnackBar('Downloaded. Please check in your downloads.', 'success-lg');
        this.onCloseDialog();
      }, 1000);

    }); 
  }  
}
