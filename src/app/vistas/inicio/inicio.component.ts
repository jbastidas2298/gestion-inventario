import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  @ViewChild('leyendaDialog') leyendaDialog!: any;
  constructor(
    private router: Router,
    private userService : UserService,
    private dialog: MatDialog
  ) {}

  isAdmin(): boolean {
    const roles = this.userService.getRoles(); 
    return roles.includes('ADMINISTRADOR');
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  mostrarLeyenda(): void {
    this.dialog.open(this.leyendaDialog, {
      width: '400px',
      panelClass: 'custom-dialog-container'
    });
  }
}
