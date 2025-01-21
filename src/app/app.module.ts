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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './vistas/inicio/inicio.component';
import { MatIconModule } from '@angular/material/icon';
import { BarraComponent } from './general/barra/barra.component';
import { ConfiguracionMenuComponent } from './vistas/configuracion-menu/configuracion-menu.component';
import { EditarUsuarioDialogComponent } from './vistas/dialog/dialog-usuario/editar-usuario-dialog.component';
import { ConfiguracionUsuarioComponent } from './vistas/configuracion-usuario/configuracion-usuario.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfiguracionAreasComponent } from './vistas/configuracion-areas/configuracion-areas.component';
import { AreaDialogComponent } from './vistas/dialog/dialog-area/area-dialog.component';
import { InventarioMenuComponent } from './vistas/inventario-menu/inventario-menu.component';
import { DialogArticuloComponent } from './vistas/dialog/dialog-articulo/dialog-articulo.component';
import { InventarioArticuloComponent } from './vistas/inventario-articulo/inventario-articulo.component';
import { DialogImagenComponent } from './vistas/dialog/dialog-imagen/dialog-imagen.component';
import { InventarioDetalleComponent } from './vistas/inventario-detalle/inventario-detalle.component';
import { InventarioAsignacionComponent } from './vistas/inventario-asignacion/inventario-asignacion.component';
import { AsignacionDialogComponent } from './vistas/dialog/dialog-asignacion/asignacion-dialog.component';
import { Interceptor } from './services/interceptor.service';
import { LoadingComponent } from './general/loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogConfirmarComponent } from './vistas/dialog/dialog-confirmar/dialog-confirmar.component';
import { MatDividerModule } from '@angular/material/divider';
import { DialogPdfComponent } from './vistas/dialog/dialog-pdf/dialog-pdf.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { InventarioReportesComponent } from './vistas/inventario-reportes/inventario-reportes.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
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
    LoadingComponent,
    DialogConfirmarComponent,
    DialogPdfComponent,
    InventarioReportesComponent,
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
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatGridListModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    CardModule,
    AccordionModule,
    FileUploadModule,
    MatDividerModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatTabsModule,
    MatAutocompleteModule,
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
