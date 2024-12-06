import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-imagen',
  templateUrl: './dialog-imagen.component.html',
  styleUrls: ['./dialog-imagen.component.scss']
})
export class DialogImagenComponent {
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<DialogImagenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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