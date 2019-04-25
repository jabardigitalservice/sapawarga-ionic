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
      name: 'Lapor via Website',
      url: 'https://www.lapor.go.id',
      logo: 'assets/icon/lapor-icon.jpg',
      description:
        'LAPOR! merupakan kepanjangan dari Layanan Aspirasi dan Pengaduan Online Rakyat, layanan ini melayani pengaduan dan aspirasi yang disampaikan pada pemerintah maupun lembaga terkait.'
    },
    {
      nameInit: 'qlue',
      name: 'Lapor via Qlue',
      url: 'org.qluein.android',
      logo: 'assets/icon/lapor-qlue.jpg',
      description:
        'Qlue adalah aplikasi media sosial untuk melaporkan permasalahan kota kepada pemerintah, pihak swasta ataupun saling berbagi informasi sesama warga di lingkungan sekitarmu demi terciptanya Smart City.'
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
      let appId = appUrl;
      let appStarter = (window as any).startApp.set({ application: appId });
      appStarter.start(
        function(msg) {},
        function(err) {
          window.open(`market://details?id=${appId}`, '_system');
        }
      );
    }
  }
}
