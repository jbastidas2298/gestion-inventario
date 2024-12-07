import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';
import { AsignacionDialogComponent } from '../dialog-asignacion/asignacion-dialog.component';
import { NotificationService } from 'src/app/services/Notification.service';

@Component({
  selector: 'app-inventario-asignacion',
  templateUrl: './inventario-asignacion.component.html',
  styleUrls: ['./inventario-asignacion.component.scss']
})
export class InventarioAsignacionComponent implements OnInit {
  usuariosAreas: any[] = [];
  displayedColumns: string[] = ['seleccionar','codigoOrigen','codigoInterno', 'nombreAsignado', 'acciones'];
  articulosAsignacion: any[] = [];
  selectedRows: Set<number> = new Set(); 
  filteredAsignacion: any[] = [];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private itemsService : ItemsService,
    private notificacion : NotificationService
  ) {}

  ngOnInit() {
    this.cargarUsuariosAreas();
    this.cargarAsignaciones();
  }
  cargarAsignaciones() {
    this.itemsService.obtenerAsignaciones().subscribe((data: any) => {
      this.articulosAsignacion = data;
      this.filteredAsignacion = [...this.articulosAsignacion]
    });
  }

  cargarUsuariosAreas() {
    this.userService.obtenerUsuariosAreas().subscribe({
      next: (data: any) => (this.usuariosAreas = data),
    });
  }

  editarAsignacion(articuloAsignacion: any) {
    const dialogRef = this.dialog.open(AsignacionDialogComponent, {
      width: '400px',
      data: {
        articuloActual: articuloAsignacion,
        usuariosAreas: this.usuariosAreas,
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const idArticulo = [result.idArticulo];
        const idUsuario = result.idUsuario;
        const tipoRelacion = result.tipoRelacion;
  
        this.itemsService.asignarItems(idArticulo, idUsuario, tipoRelacion).subscribe({
          next: (response) => {
            this.notificacion.showSuccess('Asignación exitosa:');
            this.cargarAsignaciones();
          },
        });
      }
    });
  }

  reasignarAsignacionTodos() {
    const dialogRef = this.dialog.open(AsignacionDialogComponent, {
      width: '400px',
      data: {
        articuloActual: null, // No se pasa un artículo en este caso
        usuariosAreas: this.usuariosAreas,
        isReassigning: true,
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const idUsuarioActual = result.idUsuarioActual;
        const tipoRelacionActual = result.tipoRelacionActual;
        const idUsuarioNuevo = result.idUsuario;
        const tipoRelacionNuevo = result.tipoRelacion;
        const descripcion = result.descripcion;
  
        this.itemsService.reasignarTodos(idUsuarioActual, tipoRelacionActual, idUsuarioNuevo, tipoRelacionNuevo, descripcion).subscribe({
          next: (response) => {
            this.notificacion.showSuccess('Reasignación realizada con éxito.');
            this.cargarAsignaciones();
          },
        });
      }
    });
  }
  

  asignacionVarios() {
    const selectedIds = Array.from(this.selectedRows);

    if (selectedIds.length === 0) {
      this.notificacion.showError('Por favor, selecciona al menos un artículo.');
      return;
    }
    const dialogRef = this.dialog.open(AsignacionDialogComponent, {
      width: '400px',
      data: {
        articuloActual: null, 
        usuariosAreas: this.usuariosAreas,
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const idUsuario = result.idUsuario;
        const tipoRelacion = result.tipoRelacion;

        this.itemsService.asignarItems(selectedIds, idUsuario, tipoRelacion).subscribe({
          next: (response) => {
            this.notificacion.showSuccess('Asignaciónes exitosas');
            this.cargarAsignaciones();
            this.selectedRows.clear();
          },
        });
      }
    });

  }

  generarReporteActaEntrega(articuloAsignacion: any): void {
    this.itemsService.generarReporteActaEntrega(articuloAsignacion.idArticulo).subscribe({
      next: (pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
    });
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredAsignacion = this.articulosAsignacion.filter((articulo) =>
      articulo.nombreAsignado.toLowerCase().includes(filterValue) ||
      articulo.codigoOrigen.toLowerCase().includes(filterValue)
    );
  }
  
  isAllSelected(): boolean {
    return this.selectedRows.size === this.filteredAsignacion.length;
  }
  
  isSomeSelected(): boolean {
    return this.selectedRows.size > 0 && !this.isAllSelected();
  }
  
  toggleAllRows(event: any): void {
    if (event.checked) {
      this.filteredAsignacion.forEach((articulo: any) => this.selectedRows.add(articulo.idArticulo));
    } else {
      this.selectedRows.clear();
    }
  }
  
  toggleRowSelection(articulo: any): void {
    if (this.selectedRows.has(articulo.idArticulo)) {
      this.selectedRows.delete(articulo.idArticulo);
    } else {
      this.selectedRows.add(articulo.idArticulo);
    }
  }
  
  isRowSelected(articulo: any): boolean {
    return this.selectedRows.has(articulo.idArticulo);
  }
}
