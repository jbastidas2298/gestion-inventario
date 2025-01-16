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
      delay(300),
      map((event: HttpEvent<any>) => {
        // Manejar respuestas de texto plano
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

        if (error.error instanceof ErrorEvent) {
          // Errores del cliente o de red
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
