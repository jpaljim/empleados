import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FichajeService } from 'src/app/services/fichaje.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LoadingController, Platform, ToastController } from '@ionic/angular';

import jsQR from 'jsqr';

@Component({
  selector: 'app-fichaje',
  templateUrl: './fichaje.component.html',
  styleUrls: ['./fichaje.component.scss'],
  providers: [BarcodeScanner],
})
export class FichajeComponent implements OnInit {
  public estadoFichaje: number = 99;

  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;

  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
  loading: HTMLIonLoadingElement = null;

  constructor(
    private fichajeService: FichajeService,
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private plt: Platform
  ) {
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }
  }

  ngOnInit() {
    this.comprobarEstado();
  }

  comprobarEstado() {
    this.fichajeService.comprobarFichaje().subscribe((resp: any) => {
      this.estadoFichaje = resp.resp;
    });
  }

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
  }

  async startScan() {
    // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });

    this.videoElement.srcObject = stream;
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    this.videoElement.play();
    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        //this.showQrToast();

        console.log(this.scanResult);
        //FICHAMOS
        // HACEMOS PETICIÓN
        this.fichajeService.fichar(this.estadoFichaje, this.scanResult).subscribe({
          next: (resp: any) => {
            // Comprobamos si la consulta del backend se ha realizado correctamente ( esto es si devuelve resp['ok'] === true)
            if (resp['ok']) {
              // Si se ha realizado correctamente mostramos un mensaje de fichaje realizado y cambiamos el estado del fichaje para que se nos muestra el botón contrario al que está
              if (this.estadoFichaje === 0) this.estadoFichaje = 3; 
              else if (this.estadoFichaje === 1) this.estadoFichaje = 2;

              setTimeout(() => {
                this.comprobarEstado();
              }, 3600000);
            }
          },
          error: (err: any) => {
            console.log('error');
          },
        });
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  captureImage() {
    this.fileinput.nativeElement.click();
  }

  handleFile(files: FileList) {
    const file = files.item(0);

    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(
        img,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        this.scanResult = code.data;
        //this.showQrToast();
      }
    };
    img.src = URL.createObjectURL(file);
  }

  // Funciones de ayuda
  stopScan() {
    this.scanActive = false;
  }

  reset() {
    this.scanResult = null;
  }

  // Helper functions
  // async showQrToast() {
  //   const toast = await this.toastCtrl.create({
  //     message: `Open ${this.scanResult}?`,
  //     position: 'top',
  //     buttons: [
  //       {
  //         text: 'Open',
  //         handler: () => {
  //           window.open(this.scanResult, '_system', 'location=yes');
  //         },
  //       },
  //     ],
  //   });
  //   toast.present();
  // }

  // scan(accion: number) {
  //   this.barcodeScanner
  //     .scan()
  //     .then((barcodeData) => {
  //       if (!barcodeData.cancelled) {
  //         // HACEMOS PETICIÓN
  //         this.fichajeService
  //           .fichar(accion, barcodeData.text)
  //           .subscribe({
  //             next: (resp: any) => {
  //               // Comprobamos si la consulta del backend se ha realizado correctamente ( esto es si devuelve resp['ok'] === true)
  //               if (resp['ok']) {
  //                 // Si se ha realizado correctamente mostramos un mensaje de fichaje realizado y cambiamos el estado del fichaje para que se nos muestra el botón contrario al que está
  //                 if (accion === 0) this.estadoFichaje = 1;
  //                 else if (accion === 1) this.estadoFichaje = 0;
  //               }
  //             },
  //             error: (err: any) => {
  //               console.log('error');
  //             }
  //           });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('Error', err);
  //     });
  // }
}
