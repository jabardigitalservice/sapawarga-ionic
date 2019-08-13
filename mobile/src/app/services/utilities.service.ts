import { Injectable } from '@angular/core';

// plugin moment js
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  constructor(private toastCtrl: ToastController) {}

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
}
