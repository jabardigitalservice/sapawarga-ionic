import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsAnimation,
  ILatLng,
  BaseArrayClass,
  Marker,
  GoogleMapsEvent
} from '@ionic-native/google-maps';
import { Platform, NavController, LoadingController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { Router } from '@angular/router';
import { NomorPentingService } from '../../services/nomor-penting.service';
import { NomorPenting } from '../../interfaces/nomor-penting';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

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
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private nomorPentingService: NomorPentingService,
    private router: Router,
    private openNativeSettings: OpenNativeSettings,
    public loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private util: UtilitiesService,
    public constants: Constants
  ) {}

  async ngOnInit() {
    // event google analytics
    this.util.trackEvent(
      this.constants.pageName.nomorPenting,
      'view_nearby_nomor',
      '',
      1
    );

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
          // get location user
          this.geolocation
            .getCurrentPosition()
            .then(resp => {
              // call API with params coords user
              this.getLocationsNearby(
                resp.coords.latitude,
                resp.coords.longitude
              );
            })
            .catch(error => {
              this.navCtrl.back();
            });
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

  loadMap(markers: object) {
    const POINTS: BaseArrayClass<any> = new BaseArrayClass<any>(markers);

    const bounds: ILatLng[] = POINTS.map((data: any, idx: number) => {
      return data.position;
    });

    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: bounds,
        zoom: 18
      },
      controls: {
        compass: true,
        myLocation: true,
        myLocationButton: true,
        mapToolbar: true,
        zoom: true
      }
    });
    POINTS.forEach((data: any) => {
      const marker: Marker = this.map.addMarkerSync(data);
      marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(respon => {
        // get data marker
        const markerData: Marker = <Marker>respon[1];
        this.router.navigate(['/nomor-penting', markerData.get('id')]);
      });
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

  // get data lokasi terdekat
  async getLocationsNearby(latitude: number, longitude: number) {
    let markers = [];
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
      .getNomorPentingByNearby(latitude, longitude)
      .subscribe(
        res => {
          if (res['data']['items'].length) {
            this.dataEmpty = false;
            this.dataLokasiTerdekat = res['data']['items'];

            // create marker
            markers = this.createMarkers(this.dataLokasiTerdekat);

            // call map
            this.loadMap(markers);
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

  // create dynamic markers
  createMarkers(data: object) {
    const markers = [];
    for (const index in data) {
      if (data) {
        const marker = {
          id: data[index].id,
          position: {
            lat: data[index].latitude,
            lng: data[index].longitude
          },
          animation: GoogleMapsAnimation.BOUNCE,
          title: data[index].name,
          icon: {
            url: this.iconMarker(data[index].category),
            size: {
              width: 32,
              height: 42
            }
          }
        };
        markers.push(marker);
      }
    }
    return markers;
  }

  iconMarker(category: string) {
    return this.util.iconMarker(category);
  }
}
