import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Dictionary } from '../../helpers/dictionary';

@Component({
  selector: 'app-aspirasi',
  templateUrl: './aspirasi.page.html',
  styleUrls: ['./aspirasi.page.scss']
})
export class AspirasiPage implements OnInit {
  currentComponent: string;

  constructor(
    public loadingCtrl: LoadingController,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {}

  segmentChanged(ev: any) {
    this.currentComponent = ev.detail.value;
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  AddAspirasi() {
    // check internet
    if (!navigator.onLine) {
      this.showToast(Dictionary.offline);
      return;
    }
    this.router.navigate(['/aspirasi-form']);
  }
}
