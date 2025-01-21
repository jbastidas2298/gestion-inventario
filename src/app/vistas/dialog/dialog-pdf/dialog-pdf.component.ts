import { Component, Inject } from '@angular/core';
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
    public notificacion: NotificationService
  ) {}

  seleccionarArchivo(event: any) {
    const file = event.files[0]; // Compatible con PrimeNG's p-fileUpload

    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
      this.notificacion.showError('Solo se permiten archivos PDF.');
    }
  }

  subirArchivo() {
    if (this.selectedFile) {
      this.dialogRef.close(this.selectedFile);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
