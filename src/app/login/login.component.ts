import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/Notification.service';
import { UserService } from '../services/user.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private userService: UserService

  ) 
  {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      this.authService.login(username, password).subscribe({
        next: (response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
  
            const decodedToken: any = jwtDecode(response.token);
            const roles = decodedToken.roles || [];
            const usuario = decodedToken.sub || decodedToken.username;
  
            this.userService.setUserDetails(roles, usuario);
  
            this.notificationService.showSuccess('Inicio de sesión exitoso');
            this.router.navigate(['/inicio']);
          }
        },
      });
    }
  }
}  