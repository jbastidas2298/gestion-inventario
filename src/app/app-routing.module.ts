import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './vistas/login/login.component';
import { InicioComponent } from './vistas/inicio/inicio.component';
import { ConfiguracionMenuComponent } from './vistas/configuracion-menu/configuracion-menu.component';
import { ConfiguracionUsuarioComponent } from './vistas/configuracion-usuario/configuracion-usuario.component';
import { ConfiguracionAreasComponent } from './vistas/configuracion-areas/configuracion-areas.component';
import { InventarioMenuComponent } from './vistas/inventario-menu/inventario-menu.component';
import { InventarioArticuloComponent } from './vistas/inventario-articulo/inventario-articulo.component';
import { InventarioDetalleComponent } from './vistas/inventario-detalle/inventario-detalle.component';
import { InventarioAsignacionComponent } from './vistas/inventario-asignacion/inventario-asignacion.component';


@NgModule({
  imports: [RouterModule.forRoot([
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'configuracion', component: ConfiguracionMenuComponent },
    { path: 'configuracionUsuarios', component: ConfiguracionUsuarioComponent },
    { path: 'configuracionAreas', component: ConfiguracionAreasComponent },
    { path: 'inventario', component: InventarioMenuComponent },
    { path: 'items', component: InventarioArticuloComponent },
    { path: 'inventario-detalle/:id', component: InventarioDetalleComponent },
    { path: 'inventario-asignacion', component: InventarioAsignacionComponent },
  
  ], {scrollPositionRestoration: 'enabled'})
],
exports: [RouterModule]
})
export class AppRoutingModule {
}