import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Area } from '../dominio/area';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
    private apiUrl = `${environment.apiUrl}/configuracion/areas`;

  constructor(private http: HttpClient) {}

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.apiUrl);
  }

  getAreaById(id: number): Observable<Area> {
    return this.http.get<Area>(`${this.apiUrl}/${id}`);
  }

  createArea(area: Area): Observable<Area> {
    return this.http.post<Area>(this.apiUrl, area);
  }

  updateArea(area: Area): Observable<Area> {
    return this.http.put<Area>(`${this.apiUrl}/${area.id}`, area);
  }

  deleteArea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
