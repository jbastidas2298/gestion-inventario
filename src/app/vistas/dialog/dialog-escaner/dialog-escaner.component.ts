import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserMultiFormatReader } from '@zxing/library';

@Component({
  selector: 'app-dialog-escaner',
  templateUrl: './dialog-escaner.component.html',
  styleUrls: ['./dialog-escaner.component.scss'],
})
export class DialogEscanerComponent {
  @ViewChild('video') videoElement!: ElementRef;
  private codeReader: BrowserMultiFormatReader;
  private isScanning: boolean = true; 

  constructor(private dialogRef: MatDialogRef<DialogEscanerComponent>) {
    this.codeReader = new BrowserMultiFormatReader();
  }

  ngAfterViewInit() {
    this.codeReader.decodeFromVideoDevice(
      null,
      this.videoElement.nativeElement,
      (result, err) => {
        if (result && this.isScanning) {
          this.isScanning = false; 
          this.dialogRef.close(result.getText()); 
        }
      }
    );
  }

  cerrarEscaner() {
    this.isScanning = false;
    this.codeReader.reset(); 
    this.dialogRef.close(); 
  }

  ngOnDestroy() {
    this.codeReader.reset();
  }
}
