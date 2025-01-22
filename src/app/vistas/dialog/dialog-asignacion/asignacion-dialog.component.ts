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
  usuariosFiltradosActuales: any[] = [];

  usuarioFiltro: string = '';
  usuarioFiltroActual: string = '';

  isReassigning: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AsignacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { articuloActual: any | null; usuariosAreas: any[]; isReassigning: boolean }
  ) {
    this.usuariosFiltrados = [...data.usuariosAreas];
    this.usuariosFiltradosActuales = [...data.usuariosAreas];
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

  filtrarUsuarios(): void {
    const filtro = this.usuarioFiltro.toLowerCase();
    this.usuariosFiltrados = this.data.usuariosAreas.filter((usuario) =>
      usuario.nombre.toLowerCase().includes(filtro)
    );
  }

  filtrarUsuariosActuales(): void {
    const filtro = this.usuarioFiltroActual.toLowerCase();
    this.usuariosFiltradosActuales = this.data.usuariosAreas.filter((usuario) =>
      usuario.nombre.toLowerCase().includes(filtro)
    );
  }
  
  seleccionarUsuarioActual(event: any): void {
    this.usuarioActual = this.data.usuariosAreas.find(
      (usuario) => usuario.nombre === event.option.value
    );
  }

  seleccionarUsuario(event: any): void {
    this.usuarioSeleccionado = this.data.usuariosAreas.find(
      (usuario) => usuario.nombre === event.option.value
    );
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
