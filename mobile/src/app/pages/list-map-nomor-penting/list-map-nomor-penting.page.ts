import { Component, OnInit } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  Marker,
  GoogleMapOptions,
  GoogleMapsAnimation
} from '@ionic-native/google-maps';
import {
  Platform,
  AlertController,
  NavController,
  LoadingController
} from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { Router } from '@angular/router';
import { NomorPentingService } from '../../services/nomor-penting.service';
import { NomorPenting } from '../../interfaces/nomor-penting';

@Component({
  selector: 'app-list-map-nomor-penting',
  templateUrl: './list-map-nomor-penting.page.html',
  styleUrls: ['./list-map-nomor-penting.page.scss']
})
export class ListMapNomorPentingPage implements OnInit {
  map: GoogleMap;
  latlong: any;
  title: string;
  dataEmpty = false;

  dataLokasiTerdekat: NomorPenting[];
  constructor(
    private platform: Platform,
    private diagnostic: Diagnostic,
    private openNativeSettings: OpenNativeSettings,
    private nomorPentingService: NomorPentingService,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    private navCtrl: NavController,
    private router: Router
  ) {}

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    await this.isLocationAvailable();
  }

  isLocationAvailable() {
    this.diagnostic
      .isGpsLocationEnabled()
      .then(isAvailable => {
        if (isAvailable === true) {
          this.loadMap();
          this.getLocationsNearby();
        } else {
          this.presentAlertConfirm(
            'Untuk melanjutkan, mohon untuk mengaktifkan gps anda'
          );
        }
      })
      .catch((error: any) => {
        this.navCtrl.back();
      });
  }

  loadMap() {
    // this.map = GoogleMaps.create('map_canvas', {
    //   camera: {
    //     target: {
    //       lat: 43.0741704,
    //       lng: -89.3809802
    //     },
    //     zoom: 18,
    //     tilt: 30
    //   }
    // });

    let options: GoogleMapOptions = {
      center: {
        lat: 43.0741704,
        lng: -89.3809802
      },
      camera: {
        target: {
          lat: 43.0741704,
          lng: -89.3809802
        },
        zoom: 13
      },
      controls: {
        compass: true,
        myLocation: true,
        myLocationButton: true,
        mapToolbar: true,
        zoom: true
      }
    };
    this.map = GoogleMaps.create('map_canvas', options);
  }

  async presentAlertConfirm(msg: string) {
    const alert = await this.alertController.create({
      message: msg,
      buttons: [
        {
          text: 'Batalkan',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.navCtrl.back();
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.openSetting();
            this.navCtrl.back();
          }
        }
      ]
    });

    await alert.present();
  }

  // open native GPS setting
  openSetting() {
    this.openNativeSettings.open('location');
  }

  segmentChanged(value: string) {
    switch (value) {
      case 'telepon':
        this.router.navigate(['nomor-penting']);
        break;
      default:
        break;
    }
  }

  // get data lokasi terdekat
  async getLocationsNearby() {
    // check internet
    if (!navigator.onLine) {
      alert('Tidak ada jaringan internet');
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.nomorPentingService
      .getNomorPentingByNearby(-6.902474, 107.618803)
      .subscribe(
        res => {
          if (res['data']['items'].length) {
            this.dataEmpty = false;
            this.dataLokasiTerdekat = res['data']['items'];
            console.log(this.dataLokasiTerdekat);
            // this.loadMap();
          } else {
            this.dataEmpty = true;
          }
          loader.dismiss();
        },
        err => {
          loader.dismiss();
        }
      );
  }
}
