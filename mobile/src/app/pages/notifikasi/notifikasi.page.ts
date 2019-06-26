import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Notifikasi } from '../../interfaces/notifikasi';
import { NotifikasiService } from '../../services/notifikasi.service';
import { Dictionary } from '../../helpers/dictionary';
import { Constants } from '../../helpers/constants';

@Component({
  selector: 'app-notifikasi',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss']
})
export class NotifikasiPage implements OnInit {
  dataNotifikasi: Notifikasi[];
  interval: any;

  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    private inAppBrowser: InAppBrowser,
    private notifikasiService: NotifikasiService,
    private platform: Platform,
    private router: Router,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public constants: Constants
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getNotifikasi();

    // listen and render component
    this.interval = setInterval(() => {
      this.dataNotifikasi = this.notifikasiService.getLocalNotifikasi() || [];
    }, 3000);
  }

  ionViewWillLeave() {
    window.clearInterval(this.interval);
  }

  goToDetail(index: number, meta: any) {
    if (meta.target === 'polling') {
      let navigationParams = [];
      navigationParams = [`/${meta.target}`, meta.id];
      this.router.navigate(navigationParams);
    } else if (meta.target === 'survey' || meta.target === 'url') {
      this.launchWeb(meta.url);
    }
    this.dataNotifikasi[index].read = true;
    this.notifikasiService.saveLocalNotifikasi(
      JSON.stringify(this.dataNotifikasi)
    );
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
    const target = '_self';
    this.platform.ready().then(() => {
      this.inAppBrowser.create(url, target, this.constants.inAppBrowserOptions);
    });
  }

  async getNotifikasi() {
    // get local
    const localNotifikasi = this.notifikasiService.getLocalNotifikasi();

    // check internet
    if (!navigator.onLine) {
      if (localNotifikasi.length > 0) {
        this.dataNotifikasi = localNotifikasi;
      } else {
        this.msgResponse = {
          type: 'offline',
          msg: Dictionary.offline
        };
      }
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.notifikasiService.getListNotifikasi().subscribe(
      res => {
        const listNotifikasi = res['data']['items'];
        if (listNotifikasi.length) {
          // Update API data with local data
          this.dataNotifikasi = listNotifikasi.map(notifikasi => {
            const oldNotifikasi = localNotifikasi.find(
              elmt => elmt.id === notifikasi.id
            );
            notifikasi['read'] = oldNotifikasi ? oldNotifikasi.read : false;
            return notifikasi;
          });

          // save to local
          this.notifikasiService.saveLocalNotifikasi(
            JSON.stringify(this.dataNotifikasi)
          );
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
        if (err) {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
      }
    );
  }
}
