import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GrupoActivo } from '../dominio/grupoActivo';

@Injectable({
  providedIn: 'root'
})
export class GrupoActivoService {
  private apiUrl = `${environment.apiUrl}/inventario/articulo/grupoActivo`;
  constructor(private http: HttpClient) { }

  obtenerGrupoActivo(): Observable<GrupoActivo[]> {
      return this.http.get<GrupoActivo[]>(this.apiUrl);
  }

  guardarGrupoActivo(grupoActivo: GrupoActivo): Observable<GrupoActivo> {
      return this.http.post<GrupoActivo>(this.apiUrl, grupoActivo);
  }

  eliminarGrupoActivo(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
