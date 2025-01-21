import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ArchivoService } from 'src/app/services/archivo.service';
import { NotificationService } from 'src/app/services/Notification.service';

@Component({
  selector: 'app-inventario-reportes',
  templateUrl: './inventario-reportes.component.html',
  styleUrls: ['./inventario-reportes.component.scss'],
})
export class InventarioReportesComponent implements OnInit {
  tabIndex: number = 0;

  tipoAsignacion: string = 'completo';
  usuarioFiltro = new FormControl('');
  usuarioAreas: any[] = [];
  usuariosFiltrados!: Observable<any[]>;

  estadoSeleccionado: string | null = null;
  estados: string[] = ['REVISION_TECNICA', 'DADO_BAJA'];
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  usuarioSeleccionado: any | null = null;


  constructor(
    private userService: UserService, 
    private archivoService: ArchivoService,
    private notificacionService: NotificationService
  ) { }

  ngOnInit() {
    this.cargarUsuariosAreas();
  }

  cargarUsuariosAreas() {
    this.userService.obtenerUsuariosAreas().subscribe({
      next: (data: any[]) => {
        this.usuarioAreas = data;
        this.usuariosFiltrados = this.usuarioFiltro.valueChanges.pipe(
          startWith(''),
          map((value) => (typeof value === 'string' ? this.filtrarUsuarios(value) : this.usuarioAreas))
        );
      },
    });
  }

  filtrarUsuarios(filtro: string): any[] {
    const filtroNormalizado = filtro.toLowerCase();
    return this.usuarioAreas.filter((usuario) =>
      usuario.nombre.toLowerCase().includes(filtroNormalizado)
    );
  }

  displayFn(usuario: any): string {
    return usuario ? usuario.nombre : '';
  }

  onUsuarioSeleccionado(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.usuarioFiltro.setValue(usuario.nombre);
  }

  onTipoAsignacionChange() {
    if (this.tipoAsignacion === 'completo') {
      this.usuarioSeleccionado = null;
      this.usuarioFiltro.setValue('');
    }
  }

  generarReporteAsignaciones() {
    if (this.tipoAsignacion === 'completo') {
      this.generarReporteAsignacionesCompleto();
    }else{
      this.generarReporteAsignacionesUsuario();
    }
  }

  generarReporteAsignacionesCompleto() {
    this.archivoService.generarReporteExcelAsignacionesCompleto().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Asignaciones.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
    });
  }


  generarReporteAsignacionesUsuario() {
    if (!this.usuarioSeleccionado) {
      this.notificacionService.showError('Debe seleccionar un usuario');
      return;
    }
    this.archivoService.generarReporteExcelAsignacionesUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado.tipoRelacion).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_${this.usuarioSeleccionado.nombre}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    });
  }

  generarReporteEstados() {
    if (!this.estadoSeleccionado) {
      this.notificacionService.showError('Por favor, selecciona un estado.');
      return;
    }
  
    if (!this.fechaInicio) {
      this.notificacionService.showError('Por favor, selecciona la fecha de inicio.');
      return;
    }
  
    if (!this.fechaFin) {
      this.notificacionService.showError('Por favor, selecciona la fecha de fin.');
      return;
    }
  
    if (this.fechaInicio > this.fechaFin) {
      this.notificacionService.showError('La fecha de inicio no puede ser mayor a la fecha de fin.');
      return;
    }

    this.archivoService.generarReporteEstados(this.estadoSeleccionado, this.fechaInicio, this.fechaFin).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_${this.estadoSeleccionado}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
    });
 
  }
  

}
