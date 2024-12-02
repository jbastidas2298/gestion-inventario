import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './Notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
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
        }

        return throwError(() => error);
      })
    );
  }
}