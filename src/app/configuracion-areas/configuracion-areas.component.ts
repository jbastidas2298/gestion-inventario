import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AreaService } from '../services/area.service';
import { Area } from '../dominio/area';
import { AreaDialogComponent } from '../area-dialog/area-dialog.component';
import { Usuario } from '../dominio/usuario';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-configuracion-areas',
  templateUrl: './configuracion-areas.component.html',
  styleUrls: ['./configuracion-areas.component.scss'],
})
export class ConfiguracionAreasComponent implements OnInit {
  areas: Area[] = [];
  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['nombre', 'usuario', 'acciones'];

  constructor(
    private areaService: AreaService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarAreas();
    this.cargarUsuarios();
  }

  cargarAreas() {
    this.areaService.getAreas().subscribe({
      next: (data) => (this.areas = data),
    });
  }

  cargarUsuarios() {
    this.userService.getUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
    });
  }

  agregarArea() {
    const dialogRef = this.dialog.open(AreaDialogComponent, {
      width: '400px',
      data: { area: null, usuarios: this.usuarios },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarAreas();
      }
    });
  }

  editarArea(area: Area) {
    const dialogRef = this.dialog.open(AreaDialogComponent, {
      width: '400px',
      data: { area, usuarios: this.usuarios },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarAreas();
      }
    });
  }

  eliminarArea(id: number) {
    this.areaService.deleteArea(id).subscribe({
      next: () => this.cargarAreas(),
    });
  }
}
