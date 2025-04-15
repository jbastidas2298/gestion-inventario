import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/Notification.service';
import { RestablecerPasswordService } from 'src/app/services/RestablecerPassword.service';

@Component({
  selector: 'app-restablecer-password',
  templateUrl: './restablecer-password.component.html',
  styleUrls: ['./restablecer-password.component.scss']
})
export class RestablecerPasswordComponent implements OnInit {

  restablecerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private restablecer: RestablecerPasswordService,
    private notificacion: NotificationService
  ) {
    this.restablecerForm = this.fb.group({
      email: ['', [Validators.required]],
      usuario: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  restablecePassword() {
    if (this.restablecerForm.valid) {
      const email = this.restablecerForm.value.email;
      const usuario = this.restablecerForm.value.usuario;
      this.restablecer.restablecer(usuario, email).subscribe({ 
        next: (response) => {
          if (response) {
            this.notificacion.showSuccess('Se ha enviado un correo para restablecer la contraseña');
            this.router.navigate(['/login']);
          }
        },
      })
    }
  }

  onCancel() {
    this.router.navigate(['/login']);
  }

}
