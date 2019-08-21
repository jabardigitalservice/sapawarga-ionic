import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

@Component({
  selector: 'app-e-samsat',
  templateUrl: './e-samsat.page.html',
  styleUrls: ['./e-samsat.page.scss']
})
export class ESamsatPage implements OnInit {
  items = [
    {
      nameInit: 'sambara',
      name: 'Pembayaran Pajak via Sambara',
      url: 'id.go.bapenda.sambara',
      logo: 'assets/icon/sambara.png'
    },
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
    }
  ];

  constructor(
    private platform: Platform,
    private inAppBrowser: InAppBrowser,
    private util: UtilitiesService,
    public constants: Constants
  ) {}

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.eSamsat);

    this.createEventAnalytics('view_list_e_Samsat', '');
  }

  createEventAnalytics(action: string, label?: string) {
    this.util.trackEvent(this.constants.pageName.eSamsat, action, label, 1);
  }

  selectLapor(name: string, url: string) {
    switch (name) {
      case 'tokopedia':
        this.launchweb(url, name);
        break;
      case 'bukalapak':
        this.launchweb(url, name);
        break;
      case 'sambara':
        this.launchSambara(url, name);
        break;
      default:
        break;
    }
  }

  // direct to service E-samsat
  launchweb(url: string, name?: string) {
    // check if the platform is ios or android, else open the web url
    this.platform.ready().then(() => {
      this.inAppBrowser.create(url, '_system');

      // event google analytics
      this.createEventAnalytics('view_detail_e_Samsat', name);
    });
  }

  // call service launchApp to open external app
  private launchSambara(appUrl: string, name?: string) {
    // check if the platform is ios or android, else open the web url
    if (this.platform.is('android')) {
      this.util.launchApp(appUrl);

      // event google analytics
      this.createEventAnalytics('view_detail_e_Samsat', name);
    }
  }
}
