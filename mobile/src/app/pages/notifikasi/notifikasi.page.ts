import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Notifikasi } from '../../interfaces/notifikasi';
import { NotifikasiService } from '../../services/notifikasi.service';
import { Dictionary } from '../../helpers/dictionary';
import { Constants } from '../../helpers/constants';
import { UtilitiesService } from '../../services/utilities.service';

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
    public constants: Constants,
    private util: UtilitiesService
  ) {}

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.notification);

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.notification,
      'view_all_notif',
      '',
      1
    );
  }

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
      const navigationParams = [`/${meta.target}`];
      if (meta.id) {
        navigationParams.push(meta.id);
      }
      this.router.navigate(navigationParams);
    } else if (meta.target === 'survey' || meta.target === 'url') {
      if (meta.target === 'survey' && !meta.url) {
        this.router.navigate([`/${meta.target}`]);
      } else {
        this.launchWeb(meta);
      }
    }
    this.dataNotifikasi[index].read = true;
    this.notifikasiService.saveLocalNotifikasi(
      JSON.stringify(this.dataNotifikasi)
    );

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.notification,
      'view_detail_notif',
      meta.target,
      1
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

  launchWeb(meta: any) {
    this.platform.ready().then(() => {
      if (meta.target === 'url') {
        this.inAppBrowser.create(meta.url, '_system');
      } else {
        this.inAppBrowser.create(
          meta.url,
          '_self',
          this.constants.inAppBrowserOptions
        );
      }
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

    this.notifikasiService.getNotifikasi().subscribe(
      res => {
        this.dataNotifikasi = res;
        if (!this.dataNotifikasi.length && localNotifikasi.length === 0) {
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
