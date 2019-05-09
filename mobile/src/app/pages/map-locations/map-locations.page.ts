import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  GoogleMaps,
  GoogleMap,
  Marker,
  GoogleMapOptions,
  GoogleMapsAnimation
} from '@ionic-native/google-maps';
import {
  Platform,
  ToastController,
  AlertController,
  NavController
} from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
@Component({
  selector: 'app-map-locations',
  templateUrl: './map-locations.page.html',
  styleUrls: ['./map-locations.page.scss']
})
export class MapLocationsPage implements OnInit {
  map: GoogleMap;
  latlong: any;
  title: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private platform: Platform,
    private diagnostic: Diagnostic,
    private openNativeSettings: OpenNativeSettings,
    public alertController: AlertController,
    private navCtrl: NavController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.latlong = this.router.getCurrentNavigation().extras.state.latlng;
        this.title = this.router.getCurrentNavigation().extras.state.title;
      }
    });

    // executed before `deviceready` event
    this.platform.ready().then(() => {
      // check is available GPS
      this.isLocationAvailable();
    });
  }

  ngOnInit() {}

  isLocationAvailable() {
    this.diagnostic
      .isGpsLocationEnabled()
      .then(isAvailable => {
        if (isAvailable === true) {
          this.loadMap();
        } else {
          this.presentAlertConfirm(
            'Untuk melanjutkan, mohon untuk mengaktifkan gps anda'
          );
        }
      })
      .catch((error: any) => {});
  }

  loadMap() {
    // load map
    let options: GoogleMapOptions = {
      center: this.latlong,
      camera: {
        target: this.latlong,
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

    // add marker
    let marker: Marker = this.map.addMarkerSync({
      title: this.title,
      animation: GoogleMapsAnimation.BOUNCE,
      position: this.latlong
    });
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
}
