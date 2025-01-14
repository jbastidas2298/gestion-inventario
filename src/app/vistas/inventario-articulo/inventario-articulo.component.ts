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

@Component({
  selector: 'app-inventario-articulo',
  templateUrl: './inventario-articulo.component.html',
  styleUrls: ['./inventario-articulo.component.scss']
})
export class InventarioArticuloComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  articulos: any[] = [];
  filteredArticulos: any[] = [];
  displayedColumns: string[] = ['seleccionar','revisar','codigoOrigen', 'codigoInterno', 'nombre', 'acciones'];
  selectedRows: Set<number> = new Set(); 
  filtro: string = '';
  totalElements = 0; 
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private dialog: MatDialog,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private router: Router,
    private userService : UserService,
    private archivoService : ArchivoService
  ) { }

  ngOnInit() {
    this.cargarArticulos();
  }

  cargarArticulos(page: number = 0, size: number = 10): void {
    this.itemsService.obtenerItems(page, size, this.filtro).subscribe((data: any) => {
      this.articulos = data.content || [];
      this.filteredArticulos = [...this.articulos];
      this.totalElements = data.totalElements || 0;
      this.pageSize = data.size || 10;
      this.pageIndex = data.number || 0;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.filtro = filterValue;
    this.cargarArticulos(this.pageIndex, this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarArticulos(this.pageIndex, this.pageSize);
  }

  onAdd() {
    const dialogRef = this.dialog.open(DialogArticuloComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemsService.agregarItem(result).subscribe(() => this.cargarArticulos());
      }
    });
  }
  
  Revisar(articulo: any) {
    this.router.navigate(['/inventario-detalle', articulo.id]);
  }

  onEdit(articulo: any) {
    const dialogRef = this.dialog.open(DialogArticuloComponent, {
      data: articulo
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemsService.actualizarItem(result.id, result).subscribe(() => this.cargarArticulos());
      }
    });
  }
  onDelete(id: number) {
    if (confirm('¿Estás seguro de eliminar este artículo?')) {
      this.itemsService.eliminarItem(id).subscribe(() => this.cargarArticulos());
    }
  }

  onAddImage(id: number) {
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

  isAllSelected(): boolean {
    return this.selectedRows.size === this.filteredArticulos.length;
  }
  
  isSomeSelected(): boolean {
    return this.selectedRows.size > 0 && !this.isAllSelected();
  }
  
  toggleAllRows(event: any): void {
    if (event.checked) {
      this.filteredArticulos.forEach((articulo: any) => this.selectedRows.add(articulo.id));
    } else {
      this.selectedRows.clear();
    }
  }
  
  toggleRowSelection(articulo: any): void {
    if (this.selectedRows.has(articulo.id)) {
      this.selectedRows.delete(articulo.id);
    } else {
      this.selectedRows.add(articulo.id);
    }
  }
  
  isRowSelected(articulo: any): boolean {
    return this.selectedRows.has(articulo.id);
  }
  
  generarCodigosBarra(): void {
    const selectedIds = Array.from(this.selectedRows);

    if (selectedIds.length === 0) {
      this.notificationService.showError('Por favor, selecciona al menos un artículo.');
      return;
    }

    this.archivoService.generarReporteCodigosBarra(selectedIds).subscribe({
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


  
}
