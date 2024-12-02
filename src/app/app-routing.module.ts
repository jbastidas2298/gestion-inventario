import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { ConfiguracionMenuComponent } from './configuracion-menu/configuracion-menu.component';
import { ConfiguracionUsuarioComponent } from './configuracion-usuario/configuracion-usuario.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'configuracion', component: ConfiguracionMenuComponent },
  { path: 'configuracionUsuarios', component: ConfiguracionUsuarioComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
