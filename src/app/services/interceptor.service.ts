import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingService } from './loading.service';
import { NotificationService } from './Notification.service';
import { catchError, finalize } from 'rxjs/operators';
import { delay } from 'rxjs/operators';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const loginUrl = `${environment.apiUrl}/configuracion/login`;

    if (token) {
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      if (request.url !== loginUrl) {
        request = request.clone({
          setHeaders: {
            Authorization: formattedToken,
          },
        });
      }
    }

    this.loadingService.show();
    return next.handle(request).pipe(
      delay(300),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.';

        if (error.status === 200) {
          return throwError(() => null);
        }

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Error ${error.status}: ${error.message}`;
          if (error.error && typeof error.error === 'object' && error.error.mensaje) {
            errorMessage = `Código del error: ${error.error.codigo}. Mensaje: ${error.error.mensaje}`;
          }
        }

        this.notificationService.showError(errorMessage);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }
}