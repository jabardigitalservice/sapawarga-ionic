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
        'Aspirasi dan aduan pengawasan pembangunan dan pelayanan publik.'
    },
    {
      nameInit: 'qlue',
      name: 'Lapor via Qlue',
      url: 'org.qluein.android',
      logo: 'assets/icon/lapor-qlue.jpg',
      description: 'Aduan permasalahan di lingkungan sekitar.'
    },
    {
      nameInit: 'jqr',
      name: 'Lapor via Jabar Quick Respon',
      url: 'https://jabarqr.id',
      logo: 'assets/icon/jqr.png',
      description: 'Aduan kemanusiaan bagi masyarakat Jawa Barat.'
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
