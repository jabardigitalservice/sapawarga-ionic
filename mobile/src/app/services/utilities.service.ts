import { Injectable } from '@angular/core';

// plugin moment js
import * as moment from 'moment';
import {
  ToastController,
  AlertController,
  ActionSheetController,
  ModalController,
  NavController
} from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

// plugin
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { UpdateAppComponent } from '../shared/update-app/update-app.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Constants } from '../helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  constructor(
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private actionsheetCtrl: ActionSheetController,
    private modalController: ModalController,
    private googleAnalytics: GoogleAnalytics,
    private inAppBrowser: InAppBrowser,
    private sms: SMS,
    private constants: Constants,
    private navCtrl: NavController
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

  async actionSheet(buttons: any, header: string) {
    const actionSheet = await this.actionsheetCtrl.create({
      header: header,
      buttons: buttons
    });
    await actionSheet.present();
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

  // open external app
  launchApp(appUrl: string) {
    const appStarter = (window as any).startApp.set({ application: appUrl });
    appStarter.start(
      function() {},
      function() {
        window.open(`market://details?id=${appUrl}`, '_system');
      }
    );
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

  // initial event page
  trackPage(page: string) {
    this.googleAnalytics.trackView(page);
  }

  // initial event event
  trackEvent(category: string, action: string, label?: string, value?: number) {
    this.googleAnalytics.trackEvent(category, action, label, value);
  }

  goToSms(telp: string, message: string) {
    const options = {
      replaceLineBreaks: false,
      android: {
        intent: 'INTENT'
      }
    };

    // Send a text message
    this.sms.send(telp, message, options);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: UpdateAppComponent,
      cssClass: 'modal-update',
      backdropDismiss: false
    });
    return await modal.present();
  }

  launchweb(url: string) {
    const target = '_self';
    this.inAppBrowser.create(url, target, this.constants.inAppBrowserOptions);
  }

  backButton(isPushNotification: boolean) {
    if (isPushNotification) {
      this.navCtrl.navigateRoot('/');
    } else {
      this.navCtrl.back();
    }
  }
}
