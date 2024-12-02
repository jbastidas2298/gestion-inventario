export interface Usuario {
    id: number;
    nombreUsuario: string;
    contrasena: string;
    correo: string;
    activo: boolean;
    nombreCompleto: string;
    roles: string[];
  }
  