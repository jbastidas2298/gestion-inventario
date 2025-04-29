import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { DialogEscanerComponent } from '../dialog-escaner/dialog-escaner.component';
import { GrupoActivoService } from 'src/app/services/grupoActivo.service';
import { GrupoActivo } from 'src/app/dominio/grupoActivo';
import { NotificationService } from 'src/app/services/Notification.service';
import { DialogConfirmarComponent } from '../dialog-confirmar/dialog-confirmar.component';

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
  mostrarDialogAgregarGrupo = false;
  nuevoGrupoForm: FormGroup;
  estados: string[] = [
    'DISPONIBLE',
    'REVISION_TECNICA',
    'DADO_BAJA'
  ];

  grupoActivo: GrupoActivo[] = [];
  private codeReader: BrowserMultiFormatReader;
  grupoSeleccionado: GrupoActivo | null = null;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogArticuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private grupoActivoService: GrupoActivoService,
    private notificacionService: NotificationService,
    private cdRef: ChangeDetectorRef
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
      grupoActivo: [data?.grupoActivo || '', [Validators.required, this.grupoActivoValidator]],
      descripcion: [data?.descripcion || '', Validators.required],
      observacion: [data?.observacion || ''],
      asignarseArticulo: [true],
    });

    this.nuevoGrupoForm = this.fb.group({
      codigo: [''],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.obtenerGrupoActivo();
    }, 0);

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
        if (key === 'id') return;
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

  obtenerGrupoActivo(): void {
    this.grupoActivoService.obtenerGrupoActivo().subscribe((data) => {
      const grupoVacio: GrupoActivo = { id: 0, codigo: '', descripcion: '' };
      this.grupoActivo = [grupoVacio, ...data];

      const grupoId = this.data?.grupoActivo;
      const grupoIdNormalizado = typeof grupoId === 'string' ? parseInt(grupoId, 10) : grupoId;

      if (grupoIdNormalizado) {
        this.articuloForm.controls['grupoActivo'].setValue(grupoIdNormalizado);
      }
      this.cdRef.detectChanges();
    });
  }

  grupoActivoValidator(control: AbstractControl) {
    if (control.value === 0) {
      return { grupoActivoInvalido: true };
    }
    return null;
  }

  abrirDialogAgregarGrupo() {
    const idSeleccionado = this.articuloForm.controls['grupoActivo'].value;

    const grupoSeleccionado = this.grupoActivo.find(grupo => grupo.id === idSeleccionado);

    if (grupoSeleccionado) {
      this.mostrarDialogAgregarGrupo = true;
      this.nuevoGrupoForm.setValue({
        codigo: grupoSeleccionado.codigo,
        descripcion: grupoSeleccionado.descripcion
      });
      this.grupoSeleccionado = grupoSeleccionado;
    } else {
      this.nuevoGrupoForm.reset();
      this.mostrarDialogAgregarGrupo = true;
      this.grupoSeleccionado = null;
    }
  }



  cancelarAgregarGrupo() {
    this.mostrarDialogAgregarGrupo = false;
    this.nuevoGrupoForm.reset();
  }

  guardarNuevoGrupo() {
    if (this.nuevoGrupoForm.valid) {
      const nuevoGrupo: GrupoActivo = {
        id: this.grupoSeleccionado ? this.grupoSeleccionado.id : 0,
        codigo: this.nuevoGrupoForm.value.codigo,
        descripcion: this.nuevoGrupoForm.value.descripcion,
      }
      this.grupoActivoService.guardarGrupoActivo(nuevoGrupo).subscribe((grupo) => {
        this.mostrarDialogAgregarGrupo = false;
        this.nuevoGrupoForm.reset();
        this.notificacionService.showSuccess('Grupo activo guardado correctamente');
        this.obtenerGrupoActivo();
      });
      this.nuevoGrupoForm.reset();
    }
  }

  eliminarGrupoActivo(idGrupoActivo: number) {
    const dialogRef = this.dialog.open(DialogConfirmarComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar Eliminación',
        mensaje: '¿Está seguro de que desea eliminar este grupo activo? Si el grupo está asignado a algún artículo, deberá cambiar primero el grupo en los artículos asignados antes de eliminarlo.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.grupoActivoService.eliminarGrupoActivo(idGrupoActivo).subscribe(() => {
          this.notificacionService.showSuccess('Grupo activo eliminado correctamente');
          this.obtenerGrupoActivo();
        });
      }
    });

  }
}
