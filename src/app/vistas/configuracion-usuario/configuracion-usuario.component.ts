import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatTableDataSource } from '@angular/material/table';
import { EditarUsuarioDialogComponent } from '../dialog-usuario/editar-usuario-dialog.component';
import { Usuario } from 'src/app/dominio/usuario';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-configuracion-usuario',
  templateUrl: './configuracion-usuario.component.html',
  styleUrls: ['./configuracion-usuario.component.scss']
})
export class ConfiguracionUsuarioComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  usuarios: Usuario[] = [];
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>();

  filtro: string = '';

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.userService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        this.dataSource.data = data; 
      },
    });
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

  eliminarUsuario(id: number): void {
    this.userService.eliminarUsuario(id).subscribe({
      next: () => this.cargarUsuarios(),
    });
  }
  
  aplicarFiltro(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
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
}
