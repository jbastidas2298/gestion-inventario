import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-articulo-detalle',
  templateUrl: './dialog-articulo-detalle.component.html',
  styleUrls: ['./dialog-articulo-detalle.component.scss']
})
export class DialogArticuloDetalleComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogArticuloDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}