import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DocumentUpload } from 'src/app/services/api.model';

@Component({
  selector: 'app-upload-document-dialog',
  templateUrl: './upload-document-dialog.component.html',
  styleUrls: ['./upload-document-dialog.component.scss']
})
export class UploadDocumentDialogComponent implements OnInit, AfterViewInit {

  processing = true;
  form: FormGroup;
  status = false;
  files: DocumentUpload[] | null = [];

  @ViewChild('attachDocumentInput', { static: false }) attachDocumentInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { multiple: boolean, title: string },
    private dialogRef: MatDialogRef<UploadDocumentDialogComponent>,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({                          
      Document: new FormControl('', [
        Validators.required
      ])                        
    });   
  }

  ngAfterViewInit(): void {
    this.onAttachDocument();
  }

  get f(){
    return this.form.controls;
  }

  onCloseDialog(): void {
    this.dialogRef.close(this.status ? (this.data.multiple ? this.files : this.files[0]) : null);
  }  

  onAttachDocument():void {
    this.attachDocumentInput.nativeElement.click();

    setTimeout(() => {
      this.processing = false;
    }, 1000);
  }

  onFileChange(event) {
    this.files.length = 0;

    const documents:any[] = Array.from(event.target.files);

    documents.filter((document) => {
      this.files.push({
        Filename: document['name'],
        Document: document,
        Size: parseFloat((document.size / 1000000).toString()).toFixed(3),
      });
    });
  }

  onRemoveDocument(document: DocumentUpload): void {
    this.files.splice(this.files.indexOf(document), 1);
    this.form.reset();
  }

  onAttach(): void {
    this.processing = true;
    
    setTimeout(() => {
      this.status = true;

      this.form.reset();

      this.onCloseDialog();
      
      this.processing = false;
    }, 500);    
  }  
}


