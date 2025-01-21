import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/dominio/usuario';
@Component({
  selector: 'app-editar-usuario-dialog',
  templateUrl: './editar-usuario-dialog.component.html',
  styleUrls: ['./editar-usuario-dialog.component.scss']
})
export class EditarUsuarioDialogComponent {
  usuarioForm: FormGroup;
  rolesDisponibles = ['ADMINISTRADOR', 'PERSONAL_ADMINISTRATIVO', 'DOCENTE', 'RESPONSABLE_AREA', 'SERVICIO'];

  constructor(
    private dialogRef: MatDialogRef<EditarUsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario; esNuevo: boolean },
    private fb: FormBuilder
  ) {
    this.usuarioForm = this.fb.group({
      id: [data.usuario.id],
      nombreUsuario: [data.usuario.nombreUsuario, [Validators.required, Validators.minLength(3)]],
      contrasena: [data.esNuevo ? data.usuario.contrasena : '', [ Validators.minLength(6)]],
      correo: [data.usuario.correo, [Validators.required, Validators.email]],
      activo: [data.usuario.activo],
      nombreCompleto: [data.usuario.nombreCompleto, [Validators.required]],
      roles: [data.usuario.roles, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.usuarioForm.valueChanges.subscribe((values) => {
      Object.keys(values).forEach((key) => {
        if (key !== 'contrasena' && key !== 'correo') {
          const control = this.usuarioForm.get(key);
          if (control && typeof values[key] === 'string') {
            control.setValue(values[key].toUpperCase(), { emitEvent: false });
          }
        }
      });
    });
  }

  guardar(): void {
    if (this.usuarioForm.valid) {
      this.dialogRef.close(this.usuarioForm.value);
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}