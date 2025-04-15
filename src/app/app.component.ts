import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, public userService: UserService) { }

  isLoginPage(): boolean {
    const currentUrl = this.router.url.split('?')[0];
    return currentUrl === '/login' ||
      currentUrl === '/restablecer-password' ||
      currentUrl.startsWith('/restablecerContrasena/');
  }
}
