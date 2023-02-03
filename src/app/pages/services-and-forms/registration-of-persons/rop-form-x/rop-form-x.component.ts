import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-rop-form-x',
  templateUrl: './rop-form-x.component.html',
  styleUrls: ['./rop-form-x.component.scss']
})
export class RopFormXComponent implements OnInit {

  title = "Form X";
  subTitle = "For Aliens";
  loading = true;
  processing = false;

  DraftReferenceNumber = new FormControl();

  constructor() { }

  ngOnInit(): void {
  }

  onGetSavedDraft(): void {
    console.log('retrieve the saved draft');
  }  

}
