import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/Notification.service';

@Component({
  selector: 'app-dialog-pdf',
  templateUrl: './dialog-pdf.component.html',
  styleUrls: ['./dialog-pdf.component.scss']
})
export class DialogPdfComponent {
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<DialogPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public notificacion : NotificationService
  ) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
  
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
      this.notificacion.showError('Solo se permiten archivos PDF.');
    }
  }
  
  onUpload() {
    if (this.selectedFile) {
      this.dialogRef.close(this.selectedFile);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}