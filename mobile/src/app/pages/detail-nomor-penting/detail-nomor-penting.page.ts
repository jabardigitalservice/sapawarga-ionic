import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  LoadingController,
  ToastController,
  NavController
} from '@ionic/angular';
import { NomorPentingService } from '../../services/nomor-penting.service';
import { NomorPenting } from '../../interfaces/nomor-penting';

@Component({
  selector: 'app-detail-nomor-penting',
  templateUrl: './detail-nomor-penting.page.html',
  styleUrls: ['./detail-nomor-penting.page.scss']
})
export class DetailNomorPentingPage implements OnInit {
  id: number;
  dataNomorPenting: NomorPenting;
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
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.nomorPentingService.getDetailNomorPenting(this.id).subscribe(
      res => {
        this.dataNomorPenting = res['data'];
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

  goToMap(title: string, lat: number, long: number, category: string) {
    if (lat && long) {
      let navigationExtras: NavigationExtras = {
        state: {
          latlng: {
            lat: lat,
            lng: long
          },
          title: title,
          icon: {
            url: this.iconMarker(category),
            size: {
              width: 32,
              height: 42
            }
          }
        }
      };
      this.router.navigate(['map-locations'], navigationExtras);
    }
  }

  iconMarker(category: string) {
    switch (category) {
      case 'Kesehatan': {
        return 'assets/icon/kesehatan.png';
      }
      case 'Ekonomi': {
        return 'assets/icon/ekonomi.png';
      }
      case 'Keamanan': {
        return 'assets/icon/keamanan.png';
      }
      case 'Transportasi': {
        return 'assets/icon/transport.png';
      }
      case 'Sosialisasi': {
        return 'assets/icon/sosial.png';
      }
      case 'Layanan': {
        return 'assets/icon/pelayanan.png';
      }
      default: {
        return 'blue';
      }
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
