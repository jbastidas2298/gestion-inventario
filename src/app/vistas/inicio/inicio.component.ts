import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  constructor(
    private router: Router,
    private userService : UserService
  ) {}

  isAdmin(): boolean {
    const roles = this.userService.getRoles(); 
    return roles.includes('ADMINISTRADOR');
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
