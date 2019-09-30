import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NavController,
  Platform,
  LoadingController,
  IonSlides
} from '@ionic/angular';
import { Pages } from '../../interfaces/pages';
import { ProfileService } from '../../services/profile.service';
import { NotifikasiService } from '../../services/notifikasi.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NewsService } from '../../services/news.service';
import { Router } from '@angular/router';
import { Dictionary } from '../../helpers/dictionary';
import { HumasJabar } from '../../interfaces/humas-jabar';
import { Constants } from '../../helpers/constants';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { VideoPost } from '../../interfaces/video-post';
import { VideoPostService } from '../../services/video-post.service';
import { Profile } from '../../interfaces/profile';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss']
})
export class HomeResultsPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  public appPages: Array<Pages>;
  public otherPages: Array<any>;
  interval: any;
  themeCover = [
    {
      slide: 'assets/img/banner-01.jpg'
    },
    {
      slide: 'assets/img/banner-02.jpg'
    },
    {
      slide: 'assets/img/banner-03.jpg'
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
    centeredSlides: true,
    spaceBetween: 10,
    zoom: false
  };

  unreadNotif: 0;
  isLoading = {
    humas: false
  };
  dataHumas: HumasJabar[];
  humas_URL = 'http://humas.jabarprov.go.id/terkini';

  // name local storage
  HUMAS = 'humas-headlines';

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private profileService: ProfileService,
    private notifikasiService: NotifikasiService,
    private newsService: NewsService,
    public loadingCtrl: LoadingController,
    private inAppBrowser: InAppBrowser,
    private router: Router,
    public constants: Constants,
    private youtube: YoutubeVideoPlayer,
    private videoPostService: VideoPostService,
    private util: UtilitiesService
  ) {
    this.appPages = [
      {
        title: 'Lapor',
        url: '',
        icon: 'assets/icon/SW-LAPOR.png'
      },
      {
        title: 'Usulan',
        url: '',
        icon: 'assets/icon/SW-ASPIRASI.png'
      },
      {
        title: 'Survei',
        url: '',
        icon: 'assets/icon/SW-SURVEY.png'
      },
      {
        title: 'Polling',
        url: '',
        icon: 'assets/icon/SW-POLLING.png'
      },
      {
        title: 'Nomor\npenting',
        url: '',
        icon: 'assets/icon/SW-NOPENTING.png'
      },
      // {
      //   title: 'Info harga',
      //   url: 'id.bigio.priangan',
      //   icon: 'assets/icon/SW-Info-harga.png'
      // },
      {
        title: 'E-samsat',
        url: '',
        icon: 'assets/icon/SW-E-samsat.png'
      },
      // {
      //   title: 'Perizinan',
      //   url: 'https://dpmptsp.jabarprov.go.id/sicantik/main/pendaftaranbaru ',
      //   icon: 'assets/icon/SW-IJIN.png'
      // },
      {
        title: 'Saber Hoaks',
        url: '',
        icon: 'assets/icon/saber_hoax.png'
      },
      {
        title: 'Lainnya',
        url: '',
        icon: 'assets/icon/other.png'
      }
    ];

    this.otherPages = [
      {
        text: 'Administrasi',
        handler: () => {
          this.goAdministrasi();
        }
      },
      {
        text: 'Info Harga',
        handler: () => {
          // google event analytics
          this.util.trackEvent(
            this.constants.pageName.infoHarga,
            'view_info_harga',
            '',
            1
          );
        }
      },
      {
        text: 'Perizinan',
        handler: () => {
          // google event analytics
          this.util.trackEvent(
            this.constants.pageName.perizinan,
            'view_perizinan',
            '',
            1
          );
        }
      }
    ];
  }

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.home);

    this.notifikasiService.getNotifikasi().subscribe(
      res => {
        this.unreadNotif = this.notifikasiService.getNotifikasiNumber();
      },
      err => {
        this.unreadNotif = this.notifikasiService.getNotifikasiNumber();
      }
    );

    // get data humas
    this.getDataHumas();
  }

  swipeSlide(name: string) {
    let action: string;
    switch (name) {
      case 'banners':
        action = 'swipe_banners';
        break;
      case 'humas':
        action = 'swipe_humas_jabar';
        break;
      default:
        return;
        break;
    }

    this.slides.getActiveIndex().then(_ => {
      // google event analytics
      this.util.trackEvent(this.constants.pageName.home_pages, action, '', 1);
    });
  }

  ionViewDidEnter() {
    this.interval = setInterval(() => {
      this.unreadNotif = this.notifikasiService.getNotifikasiNumber();
    }, 3000);
  }

  ionViewWillLeave() {
    window.clearInterval(this.interval);
  }

  // Go to layanan
  goToLayanan(app: string, layananUrl: string) {
    switch (app) {
      case 'E-samsat':
        this.goSamsat();
        break;
      // case 'Perizinan':
      //   this.launchweb(layananUrl);
      //   break;
      // case 'Info harga':
      //   this.launchApp(layananUrl);
      //   break;
      case 'Nomor\npenting':
        this.goNomorPenting();
        break;
      case 'Lapor':
        this.goLapor();
        break;
      case 'Usulan':
        this.goAspirasi();
        break;
      case 'Administrasi':
        this.goAdministrasi();
        break;
      case 'Polling':
        this.goPolling();
        break;
      case 'Survei':
        this.goSurvey();
        break;
      case 'Saber Hoaks':
        this.goSaberHoax();
        break;
      case 'Lainnya':
        this.openOtherPages();
        break;
      default:
        break;
    }
  }

  // open action sheet open other pages
  async openOtherPages() {
    const header = 'Dalam Pengembangan';
    this.util.actionSheet(this.otherPages, header);

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_lainnya',
      '',
      1
    );
  }

  // open page nomor penting
  goNomorPenting() {
    this.navCtrl.navigateForward('nomor-penting');

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_nomor',
      '',
      1
    );
  }

  // open page lapor
  goLapor() {
    this.navCtrl.navigateForward('lapor');

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_lapor',
      '',
      1
    );
  }

  goAspirasi() {
    this.navCtrl.navigateForward('aspirasi');

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_usulan',
      '',
      1
    );
  }

  goNotifikasi() {
    this.navCtrl.navigateForward('notifikasi');

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_notification',
      '',
      1
    );
  }

  goSamsat() {
    this.navCtrl.navigateForward('e-samsat');

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_e_Samsat',
      '',
      1
    );
  }

  goPolling() {
    this.navCtrl.navigateForward('polling');

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_polling',
      '',
      1
    );
  }

  goSurvey() {
    this.navCtrl.navigateForward('survey');

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_survei',
      '',
      1
    );
  }

  goSaberHoax() {
    this.navCtrl.navigateForward('saber-hoax');
  }

  goAdministrasi() {
    this.navCtrl.navigateForward('administrasi');

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_administrasi',
      '',
      1
    );
  }

  // call function launchApp to open external app
  private launchApp(appUrl: string) {
    // check if the platform is ios or android, else open the web url
    if (this.platform.is('android')) {
      this.util.launchApp(appUrl);
    }
  }

  // open browser in app
  private launchweb(webUrl: string) {
    // check if the platform is ios or android, else open the web url
    this.platform.ready().then(() => {
      const target = '_self';
      this.inAppBrowser.create(
        webUrl,
        target,
        this.constants.inAppBrowserOptions
      );
    });
  }

  getDataHumas() {
    // check internet
    if (!navigator.onLine) {
      // get local
      if (this.newsService.getLocal(this.HUMAS)) {
        this.dataHumas = JSON.parse(this.newsService.getLocal(this.HUMAS));
      } else {
        alert(Dictionary.offline);
      }
      return;
    }

    this.isLoading.humas = true;
    this.newsService
      .getDataNativeHttp()
      .then(res => {
        if (res) {
          const respon = JSON.parse(res.data);
          this.dataHumas = Object.values(respon);
          // save to local
          this.newsService.saveLocal(this.HUMAS, this.dataHumas);
          this.isLoading.humas = false;
        }
      })
      .catch(err => {
        // get local
        if (this.newsService.getLocal(this.HUMAS)) {
          this.dataHumas = JSON.parse(this.newsService.getLocal(this.HUMAS));
          this.isLoading.humas = false;
        }
      });
  }

  goTohumas(url: string, type?: string) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    if (this.isLoading.humas) {
      alert(Dictionary.terjadi_kesalahan);
      return;
    }

    this.launchweb(url);

    if (type) {
      // google event analytics
      this.util.trackEvent(
        this.constants.pageName.humas,
        'view_list_humas_jabar',
        '',
        1
      );

      this.util.trackEvent(
        this.constants.pageName.home_pages,
        'tapped_view_all_humas_jabar',
        '',
        1
      );
    } else {
      // get title humas
      const getTitle = this.dataHumas.find(x => x.slug === url).post_title;

      // google event analytics
      this.util.trackEvent(
        this.constants.pageName.humas,
        'view_detail_humas_jabar',
        getTitle,
        1
      );

      this.util.trackEvent(
        this.constants.pageName.home_pages,
        'tapped_humas_jabar',
        getTitle,
        1
      );
    }
  }
}
