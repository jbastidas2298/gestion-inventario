import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatTableDataSource } from '@angular/material/table';
import { EditarUsuarioDialogComponent } from '../dialog/dialog-usuario/editar-usuario-dialog.component';
import { Usuario } from 'src/app/dominio/usuario';
import { UserService } from 'src/app/services/user.service';
import { PageEvent } from '@angular/material/paginator';
import { NotificationService } from 'src/app/services/Notification.service';
import { DialogConfirmarComponent } from '../dialog/dialog-confirmar/dialog-confirmar.component';

@Component({
  selector: 'app-configuracion-usuario',
  templateUrl: './configuracion-usuario.component.html',
  styleUrls: ['./configuracion-usuario.component.scss']
})
export class ConfiguracionUsuarioComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  usuarios: any[] = [];
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>();
  filtroUsuarios: any[] = [];
  seleccionados: Set<number> = new Set();
  filtro: string = '';
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  delayTimer: any; 
  constructor(
    private userService: UserService, 
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(page: number = 0, size: number = 10): void {
    this.userService.consultarUsuarios(page, size, this.filtro).subscribe({
      next: (data: any) => {
        this.usuarios = data.content || []
        this.filtroUsuarios = [...this.usuarios];
        this.totalElements = data.totalElements || 0;
        this.pageSize = data.size || 10;
        this.pageIndex = data.number || 0;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarUsuarios(this.pageIndex, this.pageSize);
  }

  agregarUsuario(): void {
    const nuevoUsuario: Usuario = {
      id: 0,
      nombreUsuario: '',
      contrasena: '',
      correo: '',
      activo: true,
      nombreCompleto: '',
      roles: []
    };

    const dialogRef = this.dialog.open(EditarUsuarioDialogComponent, {
      width: '400px',
      data: { usuario: nuevoUsuario, esNuevo: true }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.userService.crearUsuario(resultado).subscribe({
          next: () => this.cargarUsuarios(),
        });
      }
    });
  }

  editarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(EditarUsuarioDialogComponent, {
      width: '400px',
      data: { usuario: { ...usuario }, esNuevo: false }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.userService.actualizarUsuario(resultado.id, resultado).subscribe({
          next: () => this.cargarUsuarios(),
        });
      }
    });
  }

  eliminarUsuario( articulo: any): void {
    const dialogRef = this.dialog.open(DialogConfirmarComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar Eliminación',
        mensaje: '¿Estás seguro de eliminar el usuario '+articulo.nombreCompleto+'?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.eliminarUsuario(articulo.id).
          subscribe({
            next: () => {
              this.cargarUsuarios();
              this.notificationService.showSuccess('Usuario eliminado exitosamente.');
            },
          });
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();
  
    clearTimeout(this.delayTimer);
  
    this.delayTimer = setTimeout(() => {
      this.filtro = filterValue;
      this.cargarUsuarios(this.pageIndex, this.pageSize);
    }, 300);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  importarExcel(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.userService.importarExcel(file).subscribe({
        next: () => this.cargarUsuarios(),
      });
    }
  }

  onLazyLoad(event: any): void {
    const page = Math.floor(event.first / event.rows);
    const size = event.rows;
    this.pageIndex = page;
    this.pageSize = size;
    this.cargarUsuarios(page, size);
  }
}
