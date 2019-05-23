import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  LoadingController,
  ToastController,
  NavController
} from '@ionic/angular';
import { AspirasiService } from '../../services/aspirasi.service';
import { Aspirasi } from '../../interfaces/aspirasi';

@Component({
  selector: 'app-aspirasi-detail',
  templateUrl: './aspirasi-detail.page.html',
  styleUrls: ['./aspirasi-detail.page.scss'],
})
export class AspirasiDetailPage implements OnInit {
  id: number;
  dataAspirasi: Aspirasi;
  constructor(
      private route: ActivatedRoute,
      private aspirasiService: AspirasiService,
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
      private navCtrl: NavController,
      private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.getDetailAspirasi();
  }

  // get data nomor penting
  async getDetailAspirasi() {
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.aspirasiService.getDetailAspirasi(this.id).subscribe(
      res => {
        this.dataAspirasi = res['data'];
        loader.dismiss();
      },
      err => {
        loader.dismiss();
        this.showToast(err.data.message);
        // jika data not found
        this.navCtrl.back();
      }
    );
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
