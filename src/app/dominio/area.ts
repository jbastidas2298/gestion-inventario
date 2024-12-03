import { Usuario } from "./usuario";

export interface Area {
    id: number;
    nombreArea: string;
    usuarioEncargadoId: number;
    nombreUsuarioEncargado: string;
  }