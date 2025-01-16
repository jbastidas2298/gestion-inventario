import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';
import { AsignacionDialogComponent } from '../dialog-asignacion/asignacion-dialog.component';
import { NotificationService } from 'src/app/services/Notification.service';
import { ArchivoService } from 'src/app/services/archivo.service';

@Component({
  selector: 'app-inventario-asignacion',
  templateUrl: './inventario-asignacion.component.html',
  styleUrls: ['./inventario-asignacion.component.scss']
})
export class InventarioAsignacionComponent implements OnInit {
  usuariosAreas: any[] = [];
  articulosAsignacion: any[] = [];
  seleccionados: Set<number> = new Set();
  filteredAsignacion: any[] = [];
  filterValue: string = '';
  currentPage: number = 0;
  pageSize: number = 10;
  totalRecords: number = 0;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private itemsService: ItemsService,
    private notificacion: NotificationService,
    private archivoService: ArchivoService
  ) { }

  ngOnInit() {
    this.cargarUsuariosAreas();
    this.cargarAsignaciones();
  }

  cargarAsignaciones(page: number = 0, size: number = 10, filter: string = '') {
    this.itemsService.obtenerAsignaciones(page, size, filter).subscribe((data: any) => {
      this.articulosAsignacion = data.content;
      this.filteredAsignacion = [...this.articulosAsignacion];
      this.totalRecords = data.totalElements;
      this.pageSize = data.size;
      this.currentPage = data.number;
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
            this.notificacion.showSuccess('Asignación exitosa');
            this.cargarAsignaciones();
            this.seleccionados.clear();
          },
        });
      }
    });
  }

  reasignarAsignacionTodos() {
    const dialogRef = this.dialog.open(AsignacionDialogComponent, {
      width: '400px',
      data: {
        articuloActual: null,
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
    const itemSeleccionados = Array.from(this.seleccionados).map((row: any) => row.idArticulo);

    if (itemSeleccionados.length === 0) {
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

        this.itemsService.asignarItems(itemSeleccionados, idUsuario, tipoRelacion).subscribe({
          next: (response) => {
            this.notificacion.showSuccess('Asignaciónes exitosas');
            this.cargarAsignaciones();
            const seleccionadosSet = new Set(this.seleccionados);
            seleccionadosSet.clear(); 
          },
        });
      }
    });

  }

  generarReporteActaEntrega(articuloAsignacion: any): void {
    this.archivoService.generarReporteActaEntrega(articuloAsignacion.idArticulo).subscribe({
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
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.cargarAsignaciones(this.currentPage, this.pageSize, this.filterValue);
  }



  onLazyLoad(event: any) {
    const page = event.first / event.rows;
    const size = event.rows;
    const filter = this.filterValue || '';
    this.cargarAsignaciones(page, size, filter);
  }

}
