import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaService } from '../services/area.service';
import { Area } from '../dominio/area';
import { Usuario } from '../dominio/usuario';

@Component({
  selector: 'app-area-dialog',
  templateUrl: './area-dialog.component.html',
  styleUrls: ['./area-dialog.component.scss'],
})
export class AreaDialogComponent {
  nombre: string = '';
  usuarioSeleccionado: number | null = null; 

  constructor(
    public dialogRef: MatDialogRef<AreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { area: Area | null; usuarios: Usuario[] },
    private areaService: AreaService
  ) {
    if (this.data.area) {
      this.nombre = this.data.area.nombreArea;
      this.usuarioSeleccionado = this.data.area.usuarioEncargadoId; 
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.usuarioSeleccionado) {
      console.error('Debe seleccionar un usuario');
      return;
    }

    const area: Area = {
      id: this.data.area?.id || 0,
      nombreArea: this.nombre,
      usuarioEncargadoId: this.usuarioSeleccionado,
      nombreUsuarioEncargado: this.data.usuarios.find(
        (u) => u.id === this.usuarioSeleccionado
      )?.nombreCompleto || '',
    };

    if (this.data.area?.id) {
      this.areaService.updateArea(area).subscribe(() => this.dialogRef.close(true));
    } else {
      this.areaService.createArea(area).subscribe(() => this.dialogRef.close(true));
    }
  }
}
