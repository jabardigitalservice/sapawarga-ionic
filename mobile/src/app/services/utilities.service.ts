import { Injectable } from '@angular/core';

// plugin moment js
import * as moment from 'moment';
import { ToastController, AlertController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  constructor(
    private toastCtrl: ToastController,
    private alertController: AlertController
  ) {}

  timeAgo(value: number) {
    moment.locale('id');
    return moment(value).fromNow();
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async alertConfirmation(msg: string, buttons: any, header?: string) {
    const headers = header ? header : '';
    const alert = await this.alertController.create({
      header: headers,
      message: msg,
      buttons: buttons
    });
    await alert.present();
  }

  // marker icon instantion
  iconMarker(category: string) {
    let icon = null;
    switch (category) {
      case 'Kesehatan':
        icon = 'assets/icon/kesehatan.png';
        break;
      case 'Ekonomi':
        icon = 'assets/icon/ekonomi.png';
        break;
      case 'Keamanan':
        icon = 'assets/icon/keamanan.png';
        break;
      case 'Transportasi':
        icon = 'assets/icon/transport.png';
        break;
      case 'Sosial':
        icon = 'assets/icon/sosial.png';
        break;
      case 'Layanan':
        icon = 'assets/icon/pelayanan.png';
        break;
      default:
        icon = 'blue';
        break;
    }

    return icon;
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(error.error);
  }
}
