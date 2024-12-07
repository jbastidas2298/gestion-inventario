import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-inventario-menu',
  templateUrl: './inventario-menu.component.html',
  styleUrls: ['./inventario-menu.component.scss']
})
export class InventarioMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isAdmin(): boolean {
    const roles = this.userService.getRoles(); 
    return roles.includes('ADMINISTRADOR');
  }
}
