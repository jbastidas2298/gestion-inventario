import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemsService } from 'src/app/services/items.service';
import { DialogArticuloComponent } from '../dialog-articulo/dialog-articulo.component';
import { DialogImagenComponent } from '../dialog-imagen/dialog-imagen.component';
import { NotificationService } from 'src/app/services/Notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario-articulo',
  templateUrl: './inventario-articulo.component.html',
  styleUrls: ['./inventario-articulo.component.scss']
})
export class InventarioArticuloComponent implements OnInit {
  articulos: any[] = [];
  filteredArticulos: any[] = [];
  displayedColumns: string[] = ['codigoOrigen', 'codigoInterno', 'nombre', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadArticulos();
  }

  loadArticulos() {
    this.itemsService.getAllItems().subscribe((data: any) => {
      this.articulos = data;
      this.filteredArticulos = [...this.articulos];
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredArticulos = this.articulos.filter((articulo) =>
      articulo.nombre.toLowerCase().includes(filterValue) ||
      articulo.codigoOrigen.toLowerCase().includes(filterValue)
    );
  }

  onAdd() {
    const dialogRef = this.dialog.open(DialogArticuloComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemsService.addItem(result).subscribe(() => this.loadArticulos());
      }
    });
  }

  /*onEdit(articulo: any) {
    const dialogRef = this.dialog.open(DialogArticuloComponent, {
      data: articulo
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemsService.updateItem(result.id, result).subscribe(() => this.loadArticulos());
      }
    });
  }*/
  onEdit(articulo: any) {
    this.router.navigate(['/inventario-detalle', articulo.id]);
  }
  onDelete(id: number) {
    if (confirm('¿Estás seguro de eliminar este artículo?')) {
      this.itemsService.deleteItem(id).subscribe(() => this.loadArticulos());
    }
  }

  onAddImage(id: number) {
    const dialogRef = this.dialog.open(DialogImagenComponent);

    dialogRef.afterClosed().subscribe((file: File) => {
      if (file) {
        this.itemsService.subirImagen(id, file).subscribe({
          next: (response) => {
            this.notificationService.showSuccess('Imagen subida exitosamente');
            this.loadArticulos();
          },
        });
      }
    });
  }
}
