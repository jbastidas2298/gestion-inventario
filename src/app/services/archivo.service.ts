import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArchivoService {
    private apiUrl = `${environment.apiUrl}/inventario/articulo/archivo`;

  constructor(private http: HttpClient) {}


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

  importarExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file); 
    return this.http.post<string>(`${this.apiUrl}/importar-excel`, formData);
  }

  generarReporteExcelAsignaciones(): Observable<Blob> {
    const url = `${this.apiUrl}/reporte-excel`;
    return this.http.get(url, {
      responseType: 'blob', 
    });
  }
  
}
