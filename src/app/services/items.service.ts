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

  obtenerItems(page: number = 0, size: number = 10, filter: string = '', estado: string = ''): Observable<any> {
    const params = { 
      page: page.toString(), 
      size: size.toString(), 
      filter,
      estado
    };
    return this.http.get(`${this.apiUrl}`, { params });
  }
  
  agregarItem(item: any) {
    return this.http.post(`${this.apiUrl}`, item);
  }
  
  actualizarItem(id: number, item: any) {
    return this.http.put(`${this.apiUrl}`, item);
  }
  
  eliminarItem(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  getArticuloDetalle(id: number) {
    return this.http.get<any>(`${this.apiUrl}/articuloDetalle/${id}`);
  }

  obtenerAsignaciones(page: number, size: number, filter: string, filter_usuario: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('filter_articulo', filter)
      .set('filter_usuario', filter_usuario);
    
    return this.http.get(`${this.apiUrl}/asignaciones`, { params });
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
  
  eliminarAsignacion(idArticulo: number) {
    return this.http.delete(`${this.apiUrl}/eliminarAsignacion/${idArticulo}`, { responseType: 'text' });
  }
  
  obtenerItemsServicioTecnico(){
    return this.http.get(`${this.apiUrl}/servicio-tecnico`);
  }

  obtenerItemsBaja(){
    return this.http.get(`${this.apiUrl}/baja`);
  }

  obtenerItemCodigo(codigo: string){
    return this.http.get(`${this.apiUrl}/codigo/${codigo}`);
  }
}
