import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  GoogleMapsAnimation
} from '@ionic-native/google-maps';
import { Platform, NavController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
@Component({
  selector: 'app-map-locations',
  templateUrl: './map-locations.page.html',
  styleUrls: ['./map-locations.page.scss']
})
export class MapLocationsPage implements OnInit {
  map: GoogleMap;
  latlong: any;
  title: string;
  icon: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private platform: Platform,
    private diagnostic: Diagnostic,
    private openNativeSettings: OpenNativeSettings,
    private navCtrl: NavController,
    private util: UtilitiesService
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.latlong = this.router.getCurrentNavigation().extras.state.latlng;
        this.title = this.router.getCurrentNavigation().extras.state.title;
        this.icon = this.router.getCurrentNavigation().extras.state.icon;
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
          this.presentAlertConfirm(Dictionary.confirm_gps);
        }
      })
      .catch((error: any) => {});
  }

  loadMap() {
    // load map
    const options: GoogleMapOptions = {
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
    this.map.addMarkerSync({
      title: this.title,
      animation: GoogleMapsAnimation.BOUNCE,
      position: this.latlong,
      icon: this.icon
    });
  }

  async presentAlertConfirm(msg: string) {
    const buttons = [
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
    ];

    this.util.alertConfirmation(msg, buttons);
  }

  // open native GPS setting
  openSetting() {
    this.openNativeSettings.open('location');
  }
}
