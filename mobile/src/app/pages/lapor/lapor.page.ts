import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

@Component({
  selector: 'app-lapor',
  templateUrl: './lapor.page.html',
  styleUrls: ['./lapor.page.scss']
})
export class LaporPage implements OnInit {
  contentsLapor = [
    {
      nameInit: 'lapor',
      name: 'Laporan via Lapor',
      url: 'https://www.lapor.go.id',
      logo: 'assets/icon/lapor-icon.jpg',
      description:
        // tslint:disable-next-line:max-line-length
        'Sarana aspirasi dan pengaduan berbasis media sosial bertujuan agar masyarakat dapat berpartisipasi untuk pengawasan program dan kinerja pemerintah dalam penyelenggaraan pembangunan dan pelayanan publik.'
    },
    {
      nameInit: 'jqr',
      name: 'Laporan via Jabar Quick Response',
      url: 'https://jabarqr.id',
      logo: 'assets/icon/jqr.png',
      description:
        // tslint:disable-next-line:max-line-length
        'Layanan aduan kemanusiaan bagi masyarakat Jawa Barat yang akan diterima oleh tim Jabar Quick Response dan diseleksi berdasarkan skala prioritas masalah. Laporan yang dikirim dapat berupa aduan atau permintaan bantuan kemanusiaan.'
    }
  ];

  constructor(
    private platform: Platform,
    private inAppBrowser: InAppBrowser,
    private util: UtilitiesService,
    private constants: Constants
  ) {}

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.report);

    this.createEventAnalytics('view_all_lapor', '');
  }

  createEventAnalytics(action: string, label?: string) {
    this.util.trackEvent(this.constants.pageName.report, action, label, 1);
  }

  selectLapor(name: string, url: string) {
    switch (name) {
      case 'lapor':
        this.launchweb(url, name);
        break;
      case 'qlue':
        this.launchQlue(url, name);
        break;
      case 'jqr':
        this.launchweb(url, name);
        break;
      default:
        break;
    }
  }

  // direct to service lapor
  launchweb(url: string, name?: string) {
    // check if the platform is ios or android, else open the web url
    this.platform.ready().then(() => {
      this.inAppBrowser.create(url, '_system');
    });

    // event google analytics
    this.createEventAnalytics('view_detail_lapor', name);
  }

  // call function launchApp to open external app
  private launchQlue(appUrl: string, name?: string) {
    // check if the platform is ios or android, else open the web url
    if (this.platform.is('android')) {
      this.util.launchApp(appUrl);

      // event google analytics
      this.createEventAnalytics('view_detail_lapor', name);
    }
  }
}
