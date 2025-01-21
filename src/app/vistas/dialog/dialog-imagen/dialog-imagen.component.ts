import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/Notification.service';

@Component({
  selector: 'app-dialog-imagen',
  templateUrl: './dialog-imagen.component.html',
  styleUrls: ['./dialog-imagen.component.scss'],
})
export class DialogImagenComponent implements AfterViewInit {
  @ViewChild('video') elementoVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') elementoCanvas!: ElementRef<HTMLCanvasElement>;

  archivoSeleccionado: File | null = null;
  mostrarCamara: boolean = false;
  imagenCapturada: string | null = null;

  constructor(
    public referenciaDialogo: MatDialogRef<DialogImagenComponent>,
    public notificacion: NotificationService
  ) {}

  ngAfterViewInit(): void {
    if (this.mostrarCamara) {
      this.iniciarCamara();
    }
  }

  seleccionarArchivo(evento: any): void {
    const archivo: File = evento.files[0]; 
    if (archivo) {
      this.archivoSeleccionado = archivo;
      this.imagenCapturada = null;
    }
  }

  abrirCamara(): void {
    this.cerrarCamara();
    this.mostrarCamara = true;
    this.iniciarCamara();
  }

  cerrarCamara(): void {
    if (this.mostrarCamara && this.elementoVideo) {
      this.mostrarCamara = false;
      const video = this.elementoVideo.nativeElement;
      const flujo = video.srcObject as MediaStream;
      if (flujo) {
        flujo.getTracks().forEach((pista) => pista.stop());
        video.srcObject = null; 
      }
    }
  }
  

  iniciarCamara(): void {
    const opciones = {
      video: {
        facingMode: 'environment', 
      },
    };
    navigator.mediaDevices
      .getUserMedia(opciones)
      .then((flujo) => {
        const video = this.elementoVideo.nativeElement;
        video.srcObject = flujo;
        video.play();
      })
      .catch((error) =>
        this.notificacion.showError('Error al acceder a la cámara: ' + error)
      );
  }

  capturarFoto(): void {
    const video = this.elementoVideo.nativeElement;
    const canvas = this.elementoCanvas.nativeElement;
    const contexto = canvas.getContext('2d');

    if (contexto) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imagenBase64 = canvas.toDataURL('image/png');
      this.imagenCapturada = imagenBase64;
      this.archivoSeleccionado = null; 
    }
    this.cerrarCamara();
  }

  subirImagen(): void {
    let archivoParaSubir: File | null = this.archivoSeleccionado;
    if (this.imagenCapturada) {
      archivoParaSubir = this.base64AArchivo(
        this.imagenCapturada,
        `captura_${Date.now()}.png`
      );
    }
    this.cerrarCamara();

    if (archivoParaSubir) {
      const tipoMime = archivoParaSubir.type.toLowerCase();
      const extensionesPermitidas = ['image/png', 'image/jpeg'];
  
      if (!extensionesPermitidas.includes(tipoMime)) {
        this.notificacion.showError(
          'Solo se permiten archivos en formato PNG o JPEG.'
        );
        return;
      }
        this.referenciaDialogo.close(archivoParaSubir);
    } else {
      this.notificacion.showError(
        'No hay archivo seleccionado o imagen capturada.'
      );
    }
  }

  cancelar(): void {
    this.cerrarCamara(); 
    this.referenciaDialogo.close();
  }

  private base64AArchivo(base64: string, nombreArchivo: string): File {
    const arreglo = base64.split(',');
    const mime = arreglo[0].match(/:(.*?);/)[1];
    const bstr = atob(arreglo[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], nombreArchivo, { type: mime });
  }
}
