import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LeyendaComponent } from './leyenda/leyenda.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorInterceptor } from './services/errorInterceptor.service';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio/inicio.component';
import { MatIconModule } from '@angular/material/icon';
import { BarraComponent } from './barra/barra.component';
import { AuthInterceptor } from './services/authInterceptor.service';
import { ConfiguracionMenuComponent } from './configuracion-menu/configuracion-menu.component';
import { EditarUsuarioDialogComponent } from './editar-usuario-dialog/editar-usuario-dialog.component';
import { ConfiguracionUsuarioComponent } from './configuracion-usuario/configuracion-usuario.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';



@NgModule({
  declarations: [						
    AppComponent,
    LoginComponent,
    LeyendaComponent,
    InicioComponent,
    BarraComponent,
    ConfiguracionMenuComponent,
    ConfiguracionUsuarioComponent,
    EditarUsuarioDialogComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AppRoutingModule,
    ToastModule,
    NgxSpinnerModule,
    HttpClientModule,
    MatSnackBarModule,
    MatToolbarModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor, 
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, 
      multi: true
    }
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
