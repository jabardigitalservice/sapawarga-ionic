import { Component, OnInit } from '@angular/core';
import { NavController, Platform, LoadingController } from '@ionic/angular';

import { Pages } from '../../interfaces/pages';
import { ProfileService } from '../../services/profile.service';
import { NotifikasiService } from '../../services/notifikasi.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';
import { Dictionary } from '../../helpers/dictionary';
import { HumasJabar } from '../../interfaces/humas-jabar';

@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss']
})
export class HomeResultsPage implements OnInit {
  public appPages: Array<Pages>;
  interval: any;
  themeCover = [
    {
      slide: 'assets/img/banner-01.png'
    },
    {
      slide: 'assets/img/banner-02.png'
    },
    {
      slide: 'assets/img/banner-03.png'
    }
  ];

  logoApp = 'assets/icon/logo.png';
  slideOpts = {
    effect: 'flip',
    autoplay: {
      delay: 3000
    },
    zoom: false
  };

  sliderConfigHumas = {
    slidesPerView: 1.2,
    centeredSlides: true
  };

  unreadNotif: 0;
  isLoading = false;
  dataNews: News[];
  dataHumas: HumasJabar[];

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private profileService: ProfileService,
    private notifikasiService: NotifikasiService,
    private newsService: NewsService,
    public loadingCtrl: LoadingController,
    private inAppBrowser: InAppBrowser
  ) {
    this.appPages = [
      {
        title: 'E-samsat',
        url: '',
        icon: 'assets/icon/SW-E-samsat.png'
      },
      {
        title: 'Perizinan',
        url: 'https://dpmptsp.jabarprov.go.id/sicantik/main/pendaftaranbaru ',
        icon: 'assets/icon/SW-IJIN.png'
      },
      {
        title: 'Administrasi',
        url: '',
        icon: 'assets/icon/SW-ADMINISTRASI.png'
      },
      {
        title: 'Nomor penting',
        url: '',
        icon: 'assets/icon/SW-NOPENTING.png'
      },
      {
        title: 'Info harga',
        url: 'id.bigio.priangan',
        icon: 'assets/icon/SW-Info-harga.png'
      },
      {
        title: 'Info lelang',
        url: 'https://lpse.jabarprov.go.id/eproc4',
        icon: 'assets/icon/SW-LELANG.png'
      },
      {
        title: 'Lapor',
        url: '',
        icon: 'assets/icon/SW-LAPOR.png'
      },
      {
        title: 'Aspirasi',
        url: '',
        icon: 'assets/icon/SW-ASPIRASI.png'
      },
      {
        title: 'Survey',
        url: '',
        icon: 'assets/icon/SW-SURVEY.png'
      },
      {
        title: 'Polling',
        url: '',
        icon: 'assets/icon/SW-POLLING.png'
      }
    ];

    if (!localStorage.getItem('PROFILE')) {
      this.getDataProfile();
    }
  }

  ngOnInit() {
    this.notifikasiService.getNotifikasi().subscribe(
      res => {
        this.unreadNotif = this.notifikasiService.getNotifikasiNumber();
      },
      err => {
        this.unreadNotif = this.notifikasiService.getNotifikasiNumber();
      }
    );
    this.unreadNotif = this.notifikasiService.getNotifikasiNumber();
    this.getDataHumas();
  }

  ionViewDidEnter() {
    // get data headlines berita
    // this.getNewsFeatured();

    this.interval = setInterval(() => {
      this.unreadNotif = this.notifikasiService.getNotifikasiNumber();
    }, 3000);
  }

  ionViewWillLeave() {
    window.clearInterval(this.interval);
    this.isLoading = false;
  }

  // Go to layanan
  goToLayanan(app: string, layananUrl: string) {
    switch (app) {
      case 'E-samsat':
        this.goSamsat();
        break;
      case 'Perizinan':
        this.launchweb(layananUrl);
        break;
      case 'Info harga':
        this.launchApp(layananUrl);
        break;
      case 'Info lelang':
        this.launchweb(layananUrl);
        break;
      case 'Nomor penting':
        this.goNomorPenting();
        break;
      case 'Lapor':
        this.goLapor();
        break;
      case 'Aspirasi':
        this.goAspirasi();
        break;
      case 'Administrasi':
        this.goAdministrasi();
        break;
      case 'Aspirasi':
        this.goAspirasi();
        break;
      case 'Polling':
        this.goPolling();
        break;
      case 'Survey':
        this.goSurvey();
        break;
      default:
        break;
    }
  }

  // open page nomor penting
  goNomorPenting() {
    this.navCtrl.navigateForward('nomor-penting');
  }

  // open page lapor
  goLapor() {
    this.navCtrl.navigateForward('lapor');
  }

  goAspirasi() {
    this.navCtrl.navigateForward('aspirasi');
  }

  goNotifikasi() {
    this.navCtrl.navigateForward('notifikasi');
  }

  goSamsat() {
    this.navCtrl.navigateForward('e-samsat');
  }

  goPolling() {
    this.navCtrl.navigateForward('polling');
  }

  goSurvey() {
    this.navCtrl.navigateForward('survey');
  }

  goAdministrasi() {
    this.navCtrl.navigateForward('administrasi');
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

  // open browser
  private launchweb(webUrl: string) {
    // check if the platform is ios or android, else open the web url
    this.platform.ready().then(() => {
      this.inAppBrowser.create(webUrl, '_system');
    });
  }

  async getDataProfile() {
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();
    this.profileService.getProfile().subscribe(
      res => {
        // save to local storage
        localStorage.setItem('PROFILE', JSON.stringify(res['data']));
        loader.dismiss();
      },
      err => {
        loader.dismiss();
      }
    );
  }

  getNewsFeatured() {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    this.isLoading = true;
    this.newsService.getNewsFeatured(3).subscribe(
      res => {
        if (res['status'] === 200) {
          this.dataNews = res['data']['items'];
        }
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  getDataHumas() {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    this.isLoading = true;
    this.newsService.getNewsHumas().subscribe(
      res => {
        if (res['status'] === 200) {
          this.dataHumas = res['data']['items'];
        }
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  goTohumas() {}
}
