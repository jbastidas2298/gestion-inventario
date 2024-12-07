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

  subirImagen(id: number, file: File) {
    const formData = new FormData();
    formData.append('imagen', file);
    return this.http.post<string>(`${this.apiUrl}/${id}/imagen`, formData);
  }

  subirPdf(id: number, file: File) {
    const formData = new FormData();
    formData.append('pdf', file);
    return this.http.post<string>(`${this.apiUrl}/${id}/pdf`, formData);
  }

  getArticuloDetalle(id: number) {
    return this.http.get<any>(`${this.apiUrl}/articuloDetalle/${id}`);
  }
  generarCodigoQR(id: number) {
    return this.http.get(`${this.apiUrl}/${id}/codigo-barras`, {
      responseType: 'blob',
    });
  }

  verArchivo(path: string): Observable<Blob> {
    const url = `${this.apiUrl}/archivo/ver`; 
    return this.http.post(url, path, {
      responseType: 'blob', 
    });
  }

  descargarArchivo(path: string): Observable<Blob> {
    const url = `${this.apiUrl}/archivo/descargar`;
    return this.http.post(url, path, {
      responseType: 'blob', 
      headers: { 'Content-Type': 'text/plain' }, 
    });
  }

  generarReporteCodigosBarra(articuloIds: number[]): Observable<Blob> {
    const url = `${this.apiUrl}/codigo-barras/reporte`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, articuloIds, {
      headers,
      responseType: 'blob', 
    });
  }
  
  generarReporteItems(articuloId: number): Observable<Blob> {
    const url = `${this.apiUrl}/reporteArticulo/`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url+articuloId,'', {
      headers,
      responseType: 'blob', 
    });
  }

  generarReporteActaEntrega(articuloId: number): Observable<Blob> {
    const url = `${this.apiUrl}/reporteActaEntrega/`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url+articuloId,'', {
      headers,
      responseType: 'blob', 
    });
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
