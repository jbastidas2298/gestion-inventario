import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/Notification.service';

@Component({
  selector: 'app-dialog-imagen',
  templateUrl: './dialog-imagen.component.html',
  styleUrls: ['./dialog-imagen.component.scss']
})
export class DialogImagenComponent  implements AfterViewInit {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;

  selectedFile: File | null = null;
  mostrarCamara: boolean = false;
  capturedImage: string | null = null;

  constructor(public dialogRef: MatDialogRef<DialogImagenComponent>,
    public notificacion : NotificationService
  ) {}

  ngAfterViewInit(): void {
    if (this.mostrarCamara) {
      this.iniciarCamara();
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.capturedImage = null; 
    }
  }

  abrirCamara(): void {
    this.mostrarCamara = true;
    this.iniciarCamara();
  }

  cerrarCamara(): void {
    this.mostrarCamara = false;
    const video = this.videoElement.nativeElement;
    const stream = video.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  }

  iniciarCamara(): void {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = this.videoElement.nativeElement;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => this.notificacion.showError('Error al acceder a la cámara: ' + err));
  }

  capturarFoto(): void {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
  
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/png');
      const file = this.base64ToFile(base64Image, `captura_${Date.now()}.png`);
  
      this.cerrarCamara(); 
      this.dialogRef.close(file); 
    }
  }
  
  

  onUpload(): void {
    let fileToUpload: File | null = this.selectedFile;
      if (this.capturedImage) {
      fileToUpload = this.base64ToFile(
        this.capturedImage,
        `captura_${Date.now()}.png`
      );
    }
  
    if (fileToUpload) {
      this.dialogRef.close(fileToUpload); 
    } else {
      this.notificacion.showError('No hay archivo seleccionado o imagen capturada.');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private base64ToFile(base64: string, fileName: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }
  
}