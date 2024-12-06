import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
    private apiUrl = `${environment.apiUrl}/inventario/articulo/items`;

  constructor(private http: HttpClient) {}

  getAllItems() {
    return this.http.get(`${this.apiUrl}`);
  }
  
  addItem(item: any) {
    return this.http.post(`${this.apiUrl}`, item);
  }
  
  updateItem(id: number, item: any) {
    return this.http.put(`${this.apiUrl}/${id}`, item);
  }
  
  deleteItem(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  subirImagen(id: number, file: File) {
    const formData = new FormData();
    formData.append('imagen', file);
    return this.http.post<string>(`${this.apiUrl}/${id}/imagen`, formData);
  }

  getArticuloDetalle(id: number) {
    return this.http.get<any>(`${this.apiUrl}/articuloDetalle/${id}`);
  }
  generarCodigoQR(id: number) {
    return this.http.get(`${this.apiUrl}/${id}/codigo-barras`, {
      responseType: 'blob',
    });
  }

}
