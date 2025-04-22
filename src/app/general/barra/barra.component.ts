import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/Notification.service';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.scss']
})
export class BarraComponent implements OnInit {
  regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  dialogRef!: MatDialogRef<any>;
  username: string = '';
  claveComprobar: string = '';
  claveNueva: string = '';
  idUsuario: number = 0;

  @ViewChild('dialogoCambioClave') dialogoCambioClave!: TemplateRef<any>;

  constructor(
    private router: Router, 
    private userService: UserService, 
    private dialog: MatDialog,
    private notificacion: NotificationService
  ) {}

  ngOnInit() {
    this.obtenerNombreUsuario();
  }

  obtenerNombreUsuario() {
    const usernameLocal = this.userService.getUsername(); 
    if (!usernameLocal) {
      return; 
    }
    this.userService.getNombreCompleto(usernameLocal).subscribe({
      next: (response: any) => { 
        this.username = response?.nombreCompleto ? response.nombreCompleto : usernameLocal; 
        this.idUsuario = response?.id ?? 0;
      },
      error: () => {
        this.username = usernameLocal; 
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    localStorage.clear(); 
    this.router.navigate(['/login']); 
  }

  abrirDialogoCambioClave() {
    this.dialogRef = this.dialog.open(this.dialogoCambioClave);
  }

  cambiarClave(dialogRef: any) {
    if (!this.claveComprobar || !this.claveNueva) {
      this.notificacion.showError('Por favor completa ambos campos.');
      return;
    }

    if (this.claveComprobar !== this.claveNueva) {
      this.notificacion.showError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    if (!this.regex.test(this.claveNueva)) {
      this.notificacion.showError(
        'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo.'
      );
      return;
    }

    this.userService.cambiarClave(this.idUsuario, this.claveComprobar).subscribe({
      next: (res) => {
        this.notificacion.showSuccess('Contraseña actualizada correctamente.');
        this.cerrarDialogo();
      },
    });

    this.cerrarDialogo();
  }

  cerrarDialogo() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.claveComprobar = '';
      this.claveNueva = '';
    }
  }
}
