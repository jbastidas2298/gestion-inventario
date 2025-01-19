import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemsService } from 'src/app/services/items.service';
import { DialogArticuloComponent } from '../dialog-articulo/dialog-articulo.component';
import { DialogImagenComponent } from '../dialog-imagen/dialog-imagen.component';
import { NotificationService } from 'src/app/services/Notification.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ArchivoService } from 'src/app/services/archivo.service';
import { PageEvent } from '@angular/material/paginator';
import { DialogConfirmarComponent } from '../dialog-confirmar/dialog-confirmar.component';

@Component({
  selector: 'app-inventario-articulo',
  templateUrl: './inventario-articulo.component.html',
  styleUrls: ['./inventario-articulo.component.scss']
})
export class InventarioArticuloComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  articulos: any[] = [];
  filteredArticulos: any[] = [];
  selectedRows: Set<number> = new Set();
  filtro: string = '';
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  delayTimer: any; 
  estadoFiltro: string = 'DISPONIBLE'; 
  constructor(
    private dialog: MatDialog,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private router: Router,
    private userService: UserService,
    private archivoService: ArchivoService
  ) { }

  ngOnInit() {
    this.cargarArticulos();
  }

  cargarArticulos(page: number = 0, size: number = 10): void {
    this.itemsService.obtenerItems(page, size, this.filtro, this.estadoFiltro).subscribe((data: any) => {
      this.articulos = data.content || [];
      this.filteredArticulos = [...this.articulos];
      this.totalElements = data.totalElements || 0;
      this.pageSize = data.size || 10;
      this.pageIndex = data.number || 0;
    });
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.filtro = filterValue;

    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      this.filtro = filterValue;
      this.cargarArticulos(this.pageIndex, this.pageSize);
    }, 300);
  }

  filtrarPorEstado(estado: string): void {
    this.estadoFiltro = estado;
    this.pageIndex = 0; 
    this.cargarArticulos(this.pageIndex, this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarArticulos(this.pageIndex, this.pageSize);
  }

  agregarItem() {
    const dialogRef = this.dialog.open(DialogArticuloComponent, {
      width: '500px',
      height: 'auto',
      data: null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemsService.agregarItem(result).subscribe(() => this.cargarArticulos());
      }
    });
  }

  Revisar(articulo: any) {
    this.router.navigate(['/inventario-detalle', articulo.id]);
  }

  editarItem(articulo: any) {
    const dialogRef = this.dialog.open(DialogArticuloComponent, {
      width: '500px',
      height: 'auto',
      data: articulo
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemsService.actualizarItem(result.id, result).subscribe(() => this.cargarArticulos());
      }
    });
  }


  eliminarItem(id: number): void {
    const dialogRef = this.dialog.open(DialogConfirmarComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar Eliminación',
        mensaje: '¿Estás seguro de que deseas eliminar este artículo? Esto eliminará por completo su historial y archivos asociados. Si es necesario conservar esta información, cambia el estado a "Dado de Baja".',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemsService.eliminarItem(id).
        subscribe({
          next: () => {
            this.cargarArticulos(); 
            this.notificationService.showSuccess('Artículo eliminado exitosamente.');
          },
        });
      }
    });
  }

  agregarImagen(id: number) {
    const dialogRef = this.dialog.open(DialogImagenComponent);

    dialogRef.afterClosed().subscribe((file: File) => {
      if (file) {
        this.archivoService.subirImagen(id, file).subscribe({
          next: (response) => {
            this.notificationService.showSuccess('Imagen subida exitosamente');
            this.cargarArticulos();
          },
        });
      }
    });
  }


  generarCodigosBarra(): void {
    const itemSeleccionados = Array.from(this.selectedRows).map((row: any) => row.id);

    if (itemSeleccionados.length === 0) {
      this.notificationService.showError('Por favor, selecciona al menos un artículo.');
      return;
    }

    this.archivoService.generarReporteCodigosBarra(itemSeleccionados).subscribe({
      next: (pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_codigos_barras.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
    });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  importarExcel(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.archivoService.importarExcel(file).subscribe({
        next: () => this.cargarArticulos(),
      });
    }
  }

  isAdmin(): boolean {
    const roles = this.userService.getRoles();
    return roles.includes('ADMINISTRADOR');
  }

  onLazyLoad(event: any): void {
    const page = Math.floor(event.first / event.rows);
    const size = event.rows;
    this.pageIndex = page;
    this.pageSize = size;
    this.cargarArticulos(page, size);
  }

  buscarDadosBaja() {
    this.itemsService.obtenerItemsBaja().subscribe((data: any) => {
      this.articulos = data || [];
      this.filteredArticulos = [...this.articulos];
    });
  }
  buscarServicioTecnico() {
    this.itemsService.obtenerItemsServicioTecnico().subscribe((data: any) => {
      this.articulos = data || [];
      this.filteredArticulos = [...this.articulos];
    });
  }

}
