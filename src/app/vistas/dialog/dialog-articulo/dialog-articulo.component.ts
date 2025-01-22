import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { DialogEscanerComponent } from '../dialog-escaner/dialog-escaner.component';

@Component({
  selector: 'app-dialog-articulo',
  templateUrl: './dialog-articulo.component.html',
  styleUrls: ['./dialog-articulo.component.scss'],
})
export class DialogArticuloComponent implements OnInit {
  @ViewChild('video', { static: false }) videoElement!: ElementRef;
  articuloForm: FormGroup;
  isCodigoOrigenReadonly: boolean = false;
  mostrarEscaner: boolean = false;
  scannerActive: boolean = false;
  selectedDevice: MediaDeviceInfo | null = null;
  availableDevices: MediaDeviceInfo[] = [];
  estados: string[] = [
    'DISPONIBLE',
    'REVISION_TECNICA',
    'DADO_BAJA'
  ];

  grupoActivo: string[] = [
    'BIENES_SUJETOS_A_CONTROL',
    'EQUIPO_ELECTRONICO'
  ];
  private codeReader: BrowserMultiFormatReader;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogArticuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
  ) {
    this.codeReader = new BrowserMultiFormatReader();

    this.articuloForm = this.fb.group({
      id: [data?.id || null],
      codigoOrigen: [data?.codigoOrigen || ''],
      codigoInterno: [data?.codigoInterno || ''],
      nombre: [data?.nombre || '', Validators.required],
      modelo: [data?.modelo || '', Validators.required],
      serie: [data?.serie || '', Validators.required],
      marca: [data?.marca || '', Validators.required],
      seccion: [data?.seccion || '', Validators.required],
      ubicacion: [data?.ubicacion || '', Validators.required],
      estado: [data?.estado || '', Validators.required],
      grupoActivo: [data?.grupoActivo || '', Validators.required],
      descripcion: [data?.descripcion || '', Validators.required],
      observacion: [data?.observacion || ''],
      asignarseArticulo: [true],
    });
  }

  ngOnInit(): void {
    if (this.data?.id) {
      this.articuloForm.controls['codigoInterno'].disable();
      if (this.data?.estado === 'REVISION_TECNICA') {
        Object.keys(this.articuloForm.controls).forEach((key) => {
          if (key !== 'estado') {
            this.articuloForm.controls[key].disable();
          }
        });
      }
    }
    this.articuloForm.valueChanges.subscribe((values) => {
      Object.keys(values).forEach((key) => {
        if (values[key] === '' || values[key] === null || values[key] === undefined) {
          this.articuloForm.get(key)?.setValue('S/N', { emitEvent: false });
        }
        const control = this.articuloForm.get(key);
        if (control && typeof values[key] === 'string') {
          control.setValue(values[key].toUpperCase(), { emitEvent: false });
        }
      });
    });
  }

  asignarValorPredeterminado(controlName: string): void {
    const control = this.articuloForm.get(controlName);
    if (control && (control.value === '' || control.value === null || control.value === undefined)) {
      control.setValue('S/N', { emitEvent: false });
    }
  }

  activarEscaner() {
    const dialogRef = this.dialog.open(DialogEscanerComponent, {
      width: '500px',
      height: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.articuloForm.controls['codigoOrigen'].setValue(result);
      }
    });
  }


  onSave() {
    if (this.articuloForm.invalid) {
      Object.keys(this.articuloForm.controls).forEach((key) => {
        const control = this.articuloForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.dialogRef.close(this.articuloForm.value);
  }


  onCancel() {
    this.dialogRef.close();
  }
  
}
