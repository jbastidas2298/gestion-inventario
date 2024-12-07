import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-asignacion-dialog',
  templateUrl: './asignacion-dialog.component.html',
  styleUrls: ['./asignacion-dialog.component.scss'],
})
export class AsignacionDialogComponent {
  articuloSeleccionado: any | null = null;
  usuarioSeleccionado: any | null = null;
  usuarioActual: any | null = null;
  motivo: string = '';
  usuariosFiltrados: any[] = [];
  isReassigning: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AsignacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { articuloActual: any | null; usuariosAreas: any[]; isReassigning: boolean }
  ) {
    this.usuariosFiltrados = data.usuariosAreas;
    this.isReassigning = data.isReassigning;

    if (data.articuloActual) {
      this.articuloSeleccionado = data.articuloActual;
      this.usuarioSeleccionado = this.usuariosFiltrados.find(
        (usuario) =>
          usuario.id === this.articuloSeleccionado.idUsuario &&
          usuario.tipoRelacion === this.articuloSeleccionado.tipoRelacion
      );
    }
  }

  onSave(): void {
    if (this.usuarioSeleccionado) {
      const resultado: any = {
        idUsuario: this.usuarioSeleccionado.id,
        tipoRelacion: this.usuarioSeleccionado.tipoRelacion,
      };

      if (this.isReassigning) {
        resultado.idUsuarioActual = this.usuarioActual?.id;
        resultado.tipoRelacionActual = this.usuarioActual?.tipoRelacion;
        resultado.descripcion = this.motivo;
      } else if (this.articuloSeleccionado) {
        resultado.idArticulo = this.articuloSeleccionado.idArticulo;
      }

      this.dialogRef.close(resultado);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
