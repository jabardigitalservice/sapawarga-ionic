import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

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

  constructor(private platform: Platform, private inAppBrowser: InAppBrowser) {}

  ngOnInit() {}

  selectLapor(name: string, url: string) {
    switch (name) {
      case 'lapor':
        this.launchweb(url);
        break;
      case 'qlue':
        this.launchApp(url);
        break;
      case 'jqr':
        this.launchweb(url);
        break;
      default:
        break;
    }
  }

  // direct to service lapor
  launchweb(url: string) {
    // check if the platform is ios or android, else open the web url
    this.platform.ready().then(() => {
      this.inAppBrowser.create(url, '_system');
    });
  }

  // call function launchApp to open external app
  private launchApp(appUrl: string) {
    // check if the platform is ios or android, else open the web url
    if (this.platform.is('android')) {
      const appId = appUrl;
      const appStarter = (window as any).startApp.set({ application: appId });
      appStarter.start(
        function(msg) {},
        function(err) {
          window.open(`market://details?id=${appId}`, '_system');
        }
      );
    }
  }
}
