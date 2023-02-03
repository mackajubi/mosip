import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { PDFDocumentProxy, PdfViewerComponent } from 'ng2-pdf-viewer';
import { ApiService } from 'src/app/services/api.service';

export interface PDFReader {
  doc_id?: number;
  page?: string;
}

@Component({
  selector: 'app-pdf-reader',
  templateUrl: './pdf-reader.component.html',
  styleUrls: ['./pdf-reader.component.scss']
})
export class PdfReaderComponent implements OnInit, OnChanges {

  mode = 'indeterminate';
  visibility = true;
  pdfPage = 1;
  autoResize = true;
  originalSize = false;
  rotation = [0, 90, 180, 270];
  rotationValue = this.rotation[0];
  currentPageLoaded = 0;
  totalPages = 0;
  isLoaded = false;
  progressTotal = 0;
  progressLoaded = 0;
  zoom = 0.8;
  min = 1;
  tooltipPosition = 'below';
  displayStyle = 'display: block;margin-left:auto;margin-right:auto;max-width: 80%';
  fullscreen = false;

  @Input() src = null;
  @Input() filename = null;
  @Input() unsetPosition = false;
  @Input() showPageCount = true;
  @Input() showCloseBtn = true;
  @Input() showGoTo = true;
  @Input() showAllPages = true;

  @Output() close = new EventEmitter();

  @ViewChild('pdfReaderContainer', { static: false}) private pdfReaderContainer: ElementRef;
  @ViewChild(PdfViewerComponent, { static: false }) private pdfComponent: PdfViewerComponent;

  constructor(
    private service: ApiService
  ) {
    this.zoom = window.innerWidth <= 768 ? 0.9 : 0.8;
  }

  ngOnInit() {
    window.addEventListener('resize', (e) => {
      this.displayStyle = 'display: block;margin-left:auto;margin-right:auto;max-width: 80%';
    });

    document.addEventListener('keydown', (event) => {
      if (event.keyCode === 27) {
        this.onToggleFullscreen();
      }
    });

  }

  _rotate() {
    const index = this.rotation.indexOf(this.rotationValue) + 1;
    this.rotationValue = index >= this.rotation.length ? this.rotation[0] : this.rotation[index];
  }

  _close() {
    this.close.emit();
  }

  _prevPage() {
    this.service.scollToTop();
    this.pdfPage--;
  }

  _nextPage() {
    this.service.scollToTop();
    this.pdfPage++;
  }

  _zoomIn() {
    this.zoom = this.zoom + 0.1;
  }

  _zoomOut() {
    this.zoom = this.zoom - 0.1;
  }

  _handleOnProgress(progressData: any) {
    this.progressTotal = progressData.total;
    this.progressLoaded = progressData.loaded;
  }

  _handlePageRendered(event: any) {
    this.currentPageLoaded = event.pageNumber;
    this.visibility = false;
  }

  _handleLoadComplete(pdf: PDFDocumentProxy) {
    this.pdfComponent.pdfViewer.scroll.up = true;
    this.totalPages = pdf.numPages;
    this.isLoaded = true;
    this.visibility = false;
  }

  _fetch() {
    this.visibility = true;
  }

  onToggleFullscreen() {
    this.fullscreen = !this.fullscreen;
    if (this.fullscreen) {
      if (this.pdfReaderContainer.nativeElement.requestFullscreen) {
        this.pdfReaderContainer.nativeElement.requestFullscreen();
      } else if (this.pdfReaderContainer.nativeElement.webkitRequestFullscreen) {
        this.pdfReaderContainer.nativeElement.webkitRequestFullscreen();
      } else if (this.pdfReaderContainer.nativeElement.mozRequestFullScreen) {
        this.pdfReaderContainer.nativeElement.mozRequestFullScreen();
      } else if (this.pdfReaderContainer.nativeElement.msRequestFullscreen) {
        this.pdfReaderContainer.nativeElement.msRequestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
  }

  ngOnChanges() {
    this.pdfPage = 1;
  }
}
