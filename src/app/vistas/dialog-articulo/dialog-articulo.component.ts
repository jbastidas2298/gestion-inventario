import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-articulo',
  templateUrl: './dialog-articulo.component.html',
  styleUrls: ['./dialog-articulo.component.scss']
})
export class DialogArticuloComponent{

  articuloForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogArticuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.articuloForm = this.fb.group({
      id: [data?.id || null],
      codigoOrigen: [data?.codigoOrigen || '', Validators.required],
      codigoInterno: [data?.codigoInterno || '', Validators.required],
      nombre: [data?.nombre || '', Validators.required],
      descripcion: [data?.descripcion || '', Validators.required],
      marca: [data?.marca || '', Validators.required],
      estado: [data?.estado || '', Validators.required],
      observacion: [data?.observacion || '']
    });
  }

  onSave() {
    if (this.articuloForm.valid) {
      this.dialogRef.close(this.articuloForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}