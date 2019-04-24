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
        'LAPOR! merupakan kepanjangan dari Layanan Aspirasi dan Pengaduan Online Rakyat. Pengaduan serta aspirasi tersebut akan diteruskan kepada Presiden atau kementerian maupun lembaga terkait. Aplikasi LAPOR! telah terhubung dengan 81 kementerian dan lembaga, lima pemerintah daerah, dan 44 Badan Usaha Milik Negara dengan total lebih dari 800 unit kerja dalam kesatuan sistem.'
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
