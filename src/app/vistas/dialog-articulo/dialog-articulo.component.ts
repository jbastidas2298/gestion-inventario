import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

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
  private codeReader: BrowserMultiFormatReader; // Correcto

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogArticuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
    }
  }

  activarEscaner(): void {
    if (this.scannerActive) {
      return; 
    }
  
    this.mostrarEscaner = true;
    this.scannerActive = true;
  
    setTimeout(() => {
      if (this.videoElement && this.videoElement.nativeElement) {
        this.codeReader.decodeFromVideoDevice(
          null,
          this.videoElement.nativeElement,
          (result, err) => {
            if (result) {
              this.articuloForm.controls['codigoOrigen'].setValue(result.getText());
              this.desactivarEscaner();
            }
          }
        );
      }
    }, 100);
  }
  

  desactivarEscaner(): void {
    if (this.scannerActive) {
      this.codeReader.reset();
      this.scannerActive = false;
      this.mostrarEscaner = false;
    }
  }


  onSave() {
    if (this.articuloForm.valid) {
      this.dialogRef.close(this.articuloForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
    this.desactivarEscaner();
  }
}
