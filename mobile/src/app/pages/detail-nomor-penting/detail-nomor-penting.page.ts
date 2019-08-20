import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { NomorPentingService } from '../../services/nomor-penting.service';
import { NomorPenting } from '../../interfaces/nomor-penting';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

@Component({
  selector: 'app-detail-nomor-penting',
  templateUrl: './detail-nomor-penting.page.html',
  styleUrls: ['./detail-nomor-penting.page.scss']
})
export class DetailNomorPentingPage implements OnInit {
  id: string;
  dataNomorPenting: NomorPenting;
  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    private route: ActivatedRoute,
    private nomorPentingService: NomorPentingService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private router: Router,
    private util: UtilitiesService,
    public constants: Constants
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

          // event google analytics
          this.util.trackEvent(
            this.constants.pageName.nomorPenting,
            'view_detail_nomor',
            this.dataNomorPenting.name,
            1
          );
        } else {
          // jika data null
          this.navCtrl.back();
        }
        loader.dismiss();
      },
      err => {
        loader.dismiss();
        this.util.showToast(err.data.message);
        // jika data not found
        this.navCtrl.back();
      }
    );
  }

  goToMap(title: string, lat: number, long: number, category: string) {
    if (lat && long) {
      const navigationExtras: NavigationExtras = {
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
    return this.util.iconMarker(category);
  }
}
