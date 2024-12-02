import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); 
    const loginUrl = `${environment.apiUrl}/configuracion/login`;

    if (token) {
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        if (request.url !== loginUrl && token) {
            request = request.clone({
              setHeaders: {
                Authorization: formattedToken
              }
            });
          }

      }


    return next.handle(request)
  }
}
