import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  LoadingController,
  ToastController,
  NavController
} from '@ionic/angular';
import { NomorPentingService } from '../../services/nomor-penting.service';
import { NomorPenting } from '../../interfaces/nomor-penting';
import { Dictionary } from '../../helpers/dictionary';

@Component({
  selector: 'app-detail-nomor-penting',
  templateUrl: './detail-nomor-penting.page.html',
  styleUrls: ['./detail-nomor-penting.page.scss']
})
export class DetailNomorPentingPage implements OnInit {
  id: number;
  dataNomorPenting: NomorPenting;
  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    private route: ActivatedRoute,
    private nomorPentingService: NomorPentingService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    // get id detail instansion
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.getDetailNomorPenting();
  }

  // get data nomor penting
  async getDetailNomorPenting() {
    // check internet
    if (!navigator.onLine) {
      this.msgResponse = {
        type: 'offline',
        msg: Dictionary.offline
      };
      return;
    }
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.nomorPentingService.getDetailNomorPenting(this.id).subscribe(
      res => {
        if (res['data']) {
          this.dataNomorPenting = res['data'];
        } else {
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty
          };
        }
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

  goToMap(title: string, lat: number, long: number) {
    if (lat && long) {
      let navigationExtras: NavigationExtras = {
        state: {
          latlng: {
            lat: lat,
            lng: long
          },
          title: title
        }
      };
      this.router.navigate(['map-locations'], navigationExtras);
    }
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
