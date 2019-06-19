import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Notifikasi } from '../../interfaces/notifikasi';
import { NotifikasiService } from '../../services/notifikasi.service';

@Component({
  selector: 'app-notifikasi',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss']
})
export class NotifikasiPage implements OnInit {
  dataNotifikasi: Notifikasi[];
  interval: any;

  constructor(
    private inAppBrowser: InAppBrowser,
    private notifikasiService: NotifikasiService,
    private platform: Platform,
    private router: Router,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.dataNotifikasi = this.notifikasiService.getLocalNotifikasi() || [];

    // listen and render component
    this.interval = setInterval(() => {
      this.dataNotifikasi = this.notifikasiService.getLocalNotifikasi() || [];
    }, 3000);
  }

  ionViewWillLeave() {
    window.clearInterval(this.interval);
  }

  goToDetail(meta: any) {
    if (meta.target === 'survey' || meta.target === 'polling') {
      let navigationParams = [];
      navigationParams = [`/${meta.target}`, meta.id];
      this.router.navigate(navigationParams);
    } else if (meta.target === 'url') {
      this.launchWeb(meta.url);
    }
  }

  getImageURL(targetName: string) {
    const prefix = '../../../assets/icon';
    switch (targetName) {
      case 'survey':
        return `${prefix}/SW-SURVEY.png`;
        break;
      case 'polling':
        return `${prefix}/SW-POLLING.png`;
        break;
      case 'url':
        return `${prefix}/SW-NOPENTING.png`;
        break;
      default:
        return `${prefix}/SW-ASPIRASI.png`;
        break;
    }
  }

  launchWeb(url: string) {
    // check if the platform is ios or android, else open the web url
    this.platform.ready().then(() => {
      this.inAppBrowser.create(url, '_system');
    });
  }
}
