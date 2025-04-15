import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/Notification.service';
import { RestablecerPasswordService } from 'src/app/services/RestablecerPassword.service';

@Component({
  selector: 'app-restablecer-contrasena-ingreso',
  templateUrl: './restablecer-contrasena-ingreso.component.html',
  styleUrls: ['./restablecer-contrasena-ingreso.component.scss']
})
export class RestablecerContrasenaIngresoComponent implements OnInit {

  form: FormGroup;
  token: string;
  cargando = false;
  hidePassword = true;
  tokenValido = false;
  validandoToken = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private restablecimientoService: RestablecerPasswordService,
    private notificacion: NotificationService,
  ) {
    this.form = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.validarToken();
  }

  validarToken() {
    this.validandoToken = true;

    this.restablecimientoService.validarToken(this.token).subscribe({
      next: () => {
        this.tokenValido = true;
        this.validandoToken = false;
      },
      error: () => {
        this.tokenValido = false;
        this.router.navigate(['/login']);
      }
    });
  }


  onSubmit() {
    if (this.form.invalid) {
      this.notificacion.showError('Por favor, complete todos los campos requeridos');
      return;
    }

    if (this.form.value.nuevaContrasena !== this.form.value.confirmarContrasena) {
      this.notificacion.showError('Las contraseñas no coinciden');
      return;
    }

    this.cargando = true;
    this.restablecimientoService
      .restablecerContraseña(this.token, this.form.value.nuevaContrasena)
      .subscribe({
        next: () => {
          this.notificacion.showSuccess('Contraseña restablecida con éxito');
          setTimeout(() => this.router.navigate(['/login']), 1000);
        },
        error: () => {
          this.tokenValido = false;
          this.cargando = false;
        }
      });
  }
}
