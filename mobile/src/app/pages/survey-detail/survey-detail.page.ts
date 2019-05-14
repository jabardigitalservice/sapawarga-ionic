import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastController, NavController } from '@ionic/angular';

import records from '../../../assets/data/survey';

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.page.html',
  styleUrls: ['./survey-detail.page.scss'],
})
export class SurveyDetailPage implements OnInit {
  id: number;
  record = {};

  constructor(
      private route: ActivatedRoute,
      public toastCtrl: ToastController,
      private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.getData(this.id);
  }

  getData(id) {
    this.record = records[id - 1];
  }

  submit() {
    const message =
        'Terima kasih atas partisipasi anda dalam pengisian survey ini.';
    this.showToast(message);
    this.navCtrl.back();
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
