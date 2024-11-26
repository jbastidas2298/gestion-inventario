import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.scss']
})

export class BarraComponent {
  username: string;

  constructor(private router: Router, private userService: UserService) {
    this.username = this.userService.getUsername(); 
  }
  ngOnInit() {
  }

  logout(): void {
    localStorage.clear(); 
    this.router.navigate(['/login']); 
  }
}

