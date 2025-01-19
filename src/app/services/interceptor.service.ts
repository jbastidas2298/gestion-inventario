import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingService } from './loading.service';
import { NotificationService } from './Notification.service';
import { catchError, finalize, map } from 'rxjs/operators';
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
      map((event: HttpEvent<any>) => {
        if (
          event instanceof HttpResponse &&
          event.headers.get('content-type')?.includes('text/plain')
        ) {
          return event.clone({ body: event.body });
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.';

        if (error.error) {
          if (typeof error.error === 'string') {
            try {
              const parsedError = JSON.parse(error.error);
              if (parsedError.mensaje) {
                errorMessage = `Código del error: ${parsedError.codigo || 'Desconocido'}. Mensaje: ${parsedError.mensaje}`;
              }
            } catch (e) {
              errorMessage = error.error;
            }
          } else if (typeof error.error === 'object' && error.error.mensaje) {
            const backendError = error.error as { codigo: string; mensaje: string };
            errorMessage = `Código del error: ${backendError.codigo || 'Desconocido'}. Mensaje: ${backendError.mensaje}`;
          }
        }

        this.notificationService.showError(errorMessage);

        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }
}
