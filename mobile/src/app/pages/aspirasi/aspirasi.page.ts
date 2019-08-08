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
  lastComponent: string;

  constructor(
    public loadingCtrl: LoadingController,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    if (this.lastComponent) {
      this.segmentChanged('', this.lastComponent);
    }
  }

  ionViewDidLeave() {
    this.lastComponent = this.currentComponent;
    this.currentComponent = null;
  }

  segmentChanged(ev: any, current?: string) {
    this.currentComponent = ev ? ev.detail.value : current;
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
