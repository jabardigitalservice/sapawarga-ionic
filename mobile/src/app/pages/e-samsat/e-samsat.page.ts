import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-e-samsat',
  templateUrl: './e-samsat.page.html',
  styleUrls: ['./e-samsat.page.scss']
})
export class ESamsatPage implements OnInit {
  items = [
    {
      nameInit: 'tokopedia',
      name: 'Pembayaran Pajak via Tokopedia',
      url: 'https://www.tokopedia.com/pajak/samsat/jawa-barat',
      logo: 'assets/icon/tokopedia.png'
    },
    {
      nameInit: 'bukalapak',
      name: 'Pembayaran Pajak via Bukalapak',
      url: 'https://www.bukalapak.com/bukajabar/e-samsat',
      logo: 'assets/icon/bukalapak.svg'
    },
    {
      nameInit: 'sambara',
      name: 'Pembayaran Pajak via Sambara',
      url: 'id.go.bapenda.sambara',
      logo: 'assets/icon/sambara.png'
    }
  ];

  constructor(private platform: Platform, private inAppBrowser: InAppBrowser) {}

  ngOnInit() {}

  selectLapor(name: string, url: string) {
    switch (name) {
      case 'tokopedia':
        this.launchweb(url);
        break;
      case 'bukalapak':
        this.launchweb(url);
        break;
      case 'sambara':
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
