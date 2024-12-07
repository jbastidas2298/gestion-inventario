import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-articulo',
  templateUrl: './dialog-articulo.component.html',
  styleUrls: ['./dialog-articulo.component.scss'],
})
export class DialogArticuloComponent implements OnInit {
  articuloForm: FormGroup;
  isCodigoOrigenReadonly: boolean = false;
  mostrarEscaner: boolean = false;
  selectedDevice: MediaDeviceInfo | undefined;
  availableDevices: MediaDeviceInfo[] = [];
  estados: string[] = [
    'PERDIDO_ASIGNADO',
    'DISPONIBLE',
    'DAÑADO_ASIGNADO',
    'DAÑADO',
    'PERDIDO',
    'ASIGNADO',
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogArticuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.articuloForm = this.fb.group({
      id: [data?.id || null],
      codigoOrigen: [data?.codigoOrigen || '', Validators.required],
      codigoInterno: [data?.codigoInterno || ''],
      nombre: [data?.nombre || '', Validators.required],
      descripcion: [data?.descripcion || '', Validators.required],
      marca: [data?.marca || '', Validators.required],
      estado: [data?.estado || '', Validators.required],
      observacion: [data?.observacion || ''],
    });
  }

  ngOnInit(): void {
    if (this.data?.id) {
      this.articuloForm.controls['codigoInterno'].disable();
    }
  }

  activarEscaner() {
    this.mostrarEscaner = true;
  }

  desactivarEscaner() {
    this.mostrarEscaner = false;
  }

  onCodigoEscaneado(result: string) {
    console.log('Código escaneado:', result);
    this.articuloForm.controls['codigoOrigen'].setValue(result);
    this.isCodigoOrigenReadonly = true;
    this.desactivarEscaner();
  }

  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    this.selectedDevice = devices[0];
  }

  onScanError(error: any) {
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
