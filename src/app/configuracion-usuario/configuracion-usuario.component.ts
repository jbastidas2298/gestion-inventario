import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service'; // Asegúrate de ajustar el path
import { Usuario } from '../dominio/usuario';
import { MatTableDataSource } from '@angular/material/table';
import { EditarUsuarioDialogComponent } from '../editar-usuario-dialog/editar-usuario-dialog.component';

@Component({
  selector: 'app-configuracion-usuario',
  templateUrl: './configuracion-usuario.component.html',
  styleUrls: ['./configuracion-usuario.component.scss']
})
export class ConfiguracionUsuarioComponent implements OnInit {
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
}
