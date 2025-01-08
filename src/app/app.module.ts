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
import { LoginComponent } from './vistas/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LeyendaComponent } from './general/leyenda/leyenda.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './vistas/inicio/inicio.component';
import { MatIconModule } from '@angular/material/icon';
import { BarraComponent } from './general/barra/barra.component';
import { ConfiguracionMenuComponent } from './vistas/configuracion-menu/configuracion-menu.component';
import { EditarUsuarioDialogComponent } from './vistas/dialog-usuario/editar-usuario-dialog.component';
import { ConfiguracionUsuarioComponent } from './vistas/configuracion-usuario/configuracion-usuario.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfiguracionAreasComponent } from './vistas/configuracion-areas/configuracion-areas.component';
import { AreaDialogComponent } from './vistas/dialog-area/area-dialog.component';
import { InventarioMenuComponent } from './vistas/inventario-menu/inventario-menu.component';
import { DialogArticuloComponent } from './vistas/dialog-articulo/dialog-articulo.component';
import { InventarioArticuloComponent } from './vistas/inventario-articulo/inventario-articulo.component';
import { DialogImagenComponent } from './vistas/dialog-imagen/dialog-imagen.component';
import { InventarioDetalleComponent } from './vistas/inventario-detalle/inventario-detalle.component';
import { InventarioAsignacionComponent } from './vistas/inventario-asignacion/inventario-asignacion.component';
import { AsignacionDialogComponent } from './vistas/dialog-asignacion/asignacion-dialog.component';
import { Interceptor } from './services/interceptor.service';
import { LoadingComponent } from './general/loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LeyendaComponent,
    InicioComponent,
    BarraComponent,
    ConfiguracionMenuComponent,
    ConfiguracionUsuarioComponent,
    EditarUsuarioDialogComponent,
    ConfiguracionAreasComponent,
    AreaDialogComponent,
    InventarioMenuComponent,
    DialogArticuloComponent,
    InventarioArticuloComponent,
    DialogImagenComponent,
    InventarioDetalleComponent,
    InventarioAsignacionComponent,
    AsignacionDialogComponent,
    LoadingComponent
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
    MatCheckboxModule,
    //ZXingScannerModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
