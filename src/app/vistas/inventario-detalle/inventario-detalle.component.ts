import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-inventario-detalle',
  templateUrl: './inventario-detalle.component.html',
  styleUrls: ['./inventario-detalle.component.scss'],
})
export class InventarioDetalleComponent implements OnInit {
  articulo: any = null;
  qrCodeUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private itemsService: ItemsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadArticuloDetalle(id);
    this.loadCodigoQR(id);
  }

  loadArticuloDetalle(id: number) {
    this.itemsService.getArticuloDetalle(id).subscribe((data) => {
      this.articulo = data;
    });
  }

  loadCodigoQR(id: number) {
    this.itemsService.generarCodigoQR(id).subscribe((data) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.qrCodeUrl = reader.result as string;
      };
      reader.readAsDataURL(data);
    });
  }
}
