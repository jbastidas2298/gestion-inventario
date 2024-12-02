import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.scss']
})

export class BarraComponent {
  username: string = '';

  constructor(private router: Router, private userService: UserService) {

  }
  ngOnInit() {
    this.obtenerNombreUsuario();
  }

  obtenerNombreUsuario() {
    const usernameLocal = this.userService.getUsername(); 
    this.userService.getNombreCompleto(usernameLocal).subscribe({
      next: (response: any) => { 
        this.username = response?.nombreCompleto ? response.nombreCompleto : usernameLocal; 
      },
      error: (error) => {
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
}

