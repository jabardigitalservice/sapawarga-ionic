import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  GoogleMaps,
  GoogleMap,
  Marker,
  GoogleMapOptions,
  GoogleMapsAnimation
} from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
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
    private diagnostic: Diagnostic
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
    await this.platform.ready();
    await this.loadMap();
  }

  isLocationAvailable() {
    this.diagnostic
      .isLocationEnabled()
      .then(isAvailable => {
        alert(isAvailable);
        //     this._GEO.getCurrentPosition()
        //     .then((data : any) =>
        //     {
        //   this.isLocationEnabled 	= true;
        //   this.latitude 		        = data.coords.latitude;
        //   this.longitude		        = data.coords.longitude;

        //     })
        //     .catch((error : any) =>
        //     {
        //    console.log('Error getting location', error);
        // });
      })
      .catch((error: any) => {
        alert('Location is:error');
      });
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
      animation: GoogleMapsAnimation.BOUNCE,
      position: this.latlong
    });
  }
}
