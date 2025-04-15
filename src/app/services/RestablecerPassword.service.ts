import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestablecerPasswordService {

  private resetPassword = `${environment.apiUrl}/configuracion/restablecer-contrasena`;

  constructor(private http: HttpClient) {}

  restablecer(usuario: string, email: string): Observable<any> {
    const params = new HttpParams()
      .set('usuario', usuario)
      .set('email', email);
  
    return this.http.post(this.resetPassword, null, { params });
  }

  restablecerContraseña(token: string, nuevaClave: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token)
      .set('nuevaClave', nuevaClave);
  
    return this.http.post(this.resetPassword+'/nueva-password', null, { params });
  }

  validarToken(token: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token)
  
    return this.http.post(this.resetPassword + '/validar-token', null, { params });
  }
} 