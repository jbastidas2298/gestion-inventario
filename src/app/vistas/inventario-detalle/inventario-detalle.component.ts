import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from 'src/app/services/items.service';
import { DialogPdfComponent } from '../dialog/dialog-pdf/dialog-pdf.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/Notification.service';
import { UserService } from 'src/app/services/user.service';
import { ArchivoService } from 'src/app/services/archivo.service';

@Component({
  selector: 'app-inventario-detalle',
  templateUrl: './inventario-detalle.component.html',
  styleUrls: ['./inventario-detalle.component.scss'],
})
export class InventarioDetalleComponent implements OnInit {
  articulo: any = null;
  qrCodeUrl: string | null = null;
  displayedColumns: string[] = ['tipo', 'path', 'accion'];
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private userService: UserService,
    private archivoService : ArchivoService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.cargarArticuloDetalle(this.id);
    this.cargarCodigoQR(this.id);
  }

  cargarArticuloDetalle(id: number) {
    this.itemsService.getArticuloDetalle(id).subscribe((data) => {
      this.articulo = data;
    });
  }

  cargarCodigoQR(id: number) {
    this.archivoService.generarCodigoQR(id).subscribe((data) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.qrCodeUrl = reader.result as string;
      };
      reader.readAsDataURL(data);
    });
  }
  
  Revisar(path: string): void {
    this.archivoService.verArchivo(path)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          window.open(url); 
        },
      });
  }

  Descargar(path: string): void {
    this.archivoService.descargarArchivo(path).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); 
        a.href = url;
        a.download = this.obtenerNombreArchivo(path); 
        document.body.appendChild(a); 
        a.click(); 
        document.body.removeChild(a); 
        window.URL.revokeObjectURL(url); 
      },
    });
  }
  isAdmin(): boolean {
    const roles = this.userService.getRoles(); 
    return roles.includes('ADMINISTRADOR');
  }
  agregarPdf() {
    const dialogRef = this.dialog.open(DialogPdfComponent);

    dialogRef.afterClosed().subscribe((file: File) => {
      if (file) {
        this.archivoService.subirPdf(this.id, file).subscribe({
          next: (response) => {
            this.notificationService.showSuccess('Archivo subido exitosamente');
            this.cargarArticuloDetalle(this.id);
            this.cargarCodigoQR(this.id);
          },
        });
      }
    });
  }

  generarReporte(): void {
    this.archivoService.generarReporteItems(this.id).subscribe({
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
  
  private obtenerNombreArchivo(path: string): string {
    return path.split('/').pop() || 'archivo';
  }

}
