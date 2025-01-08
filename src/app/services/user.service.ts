import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../dominio/usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/configuracion/usuarios`;
  private readonly ROLES_KEY = 'roles';
  private readonly USERNAME_KEY = 'username';

  constructor(private http: HttpClient) {}

  setUserDetails(roles: string[], username: string) {
    localStorage.setItem(this.ROLES_KEY, JSON.stringify(roles));
    localStorage.setItem(this.USERNAME_KEY, username);
  }

  getRoles(): string[] {
    const roles = localStorage.getItem(this.ROLES_KEY);
    return roles ? JSON.parse(roles) : [];
  }

  getUsername(): string {
    return localStorage.getItem(this.USERNAME_KEY) || '';
  }

  clearUserDetails() {
    localStorage.removeItem(this.ROLES_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
  }

  getNombreCompleto(username: string): Observable<any> {
    return this.http.get(this.apiUrl+'/usuarioCompleto/'+username);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerUsuariosAreas() {
    return this.http.get(`${this.apiUrl}/usuarioArea`);
  }

  importarExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file); 
    return this.http.post<string>(`${this.apiUrl}/importar-excel`, formData);
  }
  
}
