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
      url: '',
      logo: '',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
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
}
