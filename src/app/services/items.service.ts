import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
    private apiUrl = `${environment.apiUrl}/inventario/articulo/items`;

  constructor(private http: HttpClient) {}

  obtenerItems() {
    return this.http.get(`${this.apiUrl}`);
  }
  
  agregarItem(item: any) {
    return this.http.post(`${this.apiUrl}`, item);
  }
  
  actualizarItem(id: number, item: any) {
    return this.http.put(`${this.apiUrl}`, item);
  }
  
  eliminarItem(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getArticuloDetalle(id: number) {
    return this.http.get<any>(`${this.apiUrl}/articuloDetalle/${id}`);
  }

  obtenerAsignaciones() {
    return this.http.get(`${this.apiUrl}/asignaciones`);
  }

  asignarItems(idsArticulos: number[], idUsuario: number, tipoRelacion: string) {
    const params = new HttpParams()
      .set('idRelacionado', idUsuario.toString())
      .set('tipoRelacion', tipoRelacion);
  
    return this.http.post(`${this.apiUrl}/asignar`, idsArticulos, { params });
  }

  reasignarTodos(
    idUsuarioActual: number,
    tipoRelacionActual: string,
    idUsuarioNuevo: number,
    tipoRelacionNuevo: string,
    descripcion: string
  ) {
    const params = new HttpParams()
      .set('idUsuarioActual', idUsuarioActual.toString())
      .set('tipoRelacionActual', tipoRelacionActual)
      .set('idUsuarioNuevo', idUsuarioNuevo.toString())
      .set('tipoRelacionNuevo', tipoRelacionNuevo)
      .set('descripcion', descripcion);
  
    return this.http.post(`${this.apiUrl}/reasignar-todos`, null, { params });
  }  
  
}
