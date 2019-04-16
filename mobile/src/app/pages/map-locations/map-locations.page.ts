import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  GoogleMaps,
  GoogleMap,
  Marker,
  GoogleMapOptions,
  GoogleMapsAnimation
} from '@ionic-native/google-maps';
import { Platform, ToastController, AlertController } from '@ionic/angular';
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
    public alertController: AlertController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.latlong = this.router.getCurrentNavigation().extras.state.latlng;
        this.title = this.router.getCurrentNavigation().extras.state.title;
      }
    });

    this.platform.ready().then(() => {
      this.isLocationAvailable();
    });
  }

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    // await this.platform.ready();
    // await this.loadMap();
  }

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

    let marker: Marker = this.map.addMarkerSync({
      title: this.title,
      icon: 'blue',
      disableAutoPan: true,
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
          handler: blah => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.openSetting();
          }
        }
      ]
    });

    await alert.present();
  }

  openSetting() {
    this.openNativeSettings.open('location');
  }
}
