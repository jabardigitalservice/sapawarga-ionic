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
import { News } from '../../interfaces/news';
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

  sliderConfigVideoPost = {
    slidesPerView: 1.2,
    spaceBetween: 5,
    zoom: false
  };

  sliderConfigNews = {
    slidesPerView: 1.3,
    spaceBetween: 5,
    zoom: false
  };

  unreadNotif: 0;
  isLoading = {
    humas: false,
    news: false,
    videoPost: false
  };
  dataNews: News[];
  dataNewsKabkota: News[];
  dataHumas: HumasJabar[];
  dataVideoPost: VideoPost[];
  humas_URL = 'http://humas.jabarprov.go.id/terkini';

  // name local storage
  NEWS = 'news-headlines';
  NEWS_KABKOTA = 'news-kabkota-headlines';
  HUMAS = 'humas-headlines';
  VIDEO_POST = 'video-post';
  data_profile: Profile;

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
        title: 'Administrasi',
        url: '',
        icon: 'assets/icon/SW-ADMINISTRASI.png'
      },
      {
        title: 'Lainnya',
        url: '',
        icon: 'assets/icon/other.png'
      }
    ];

    this.otherPages = [
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

    // get data news
    this.getNewsFeatured();

    // get data humas
    this.getDataHumas();

    // get data Video Post
    this.getVideoPost();

    // get data user using BehaviorSubject
    this.profileService.currentUser.subscribe((state: Profile) => {
      this.data_profile = state;
      this.getNewsFeatured(this.data_profile.kabkota_id);
    });
  }

  swipeSlide(name: string) {
    let action: string;
    switch (name) {
      case 'banners':
        action = 'swipe_banners';
        break;
      case 'news':
        action = 'swipe_news';
        break;
      case 'videos':
        action = 'swipe_videos';
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

  goToNews(id?: number, kabkota?: string) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    if (this.isLoading.news) {
      alert(Dictionary.terjadi_kesalahan);
      return;
    }
    if (id) {
      this.router.navigate(['news'], {
        queryParams: { id: id }
      });

      // transform Kabkota remove whitespace & transform to lower case
      const transformKabkota = kabkota.replace(/\s/g, '').toLowerCase();

      // google event analytics
      this.util.trackEvent(
        this.constants.pageName.news,
        `view_list_${transformKabkota}_news`,
        '',
        1
      );

      this.util.trackEvent(
        this.constants.pageName.home_pages,
        `tapped_view_all_${transformKabkota}_news`,
        '',
        1
      );
    } else {
      this.navCtrl.navigateForward('news');

      // google event analytics
      this.util.trackEvent(
        this.constants.pageName.news,
        'view_list_jabar_news',
        '',
        1
      );

      this.util.trackEvent(
        this.constants.pageName.home_pages,
        'tapped_view_all_jabar_news',
        '',
        1
      );
    }
  }

  goToDetailNews(id: number, title: string) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }
    this.router.navigate(['/news', id]);

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_detail_news',
      title,
      1
    );
  }
  getNewsFeatured(idkabkota?: number) {
    // check internet
    if (!navigator.onLine) {
      // get local
      if (this.newsService.getLocal(this.NEWS) && !idkabkota) {
        this.dataNews = JSON.parse(this.newsService.getLocal(this.NEWS));
      } else if (this.newsService.getLocal(this.NEWS) && idkabkota) {
        this.dataNewsKabkota = JSON.parse(
          this.newsService.getLocal(this.NEWS_KABKOTA)
        );
      } else {
        alert(Dictionary.offline);
      }
      return;
    }

    this.isLoading.news = true;
    this.newsService.getNewsFeatured(3, idkabkota).subscribe(
      res => {
        if (res['status'] === 200 && res['data'].length) {
          if (idkabkota) {
            this.dataNewsKabkota = res['data'];
          } else {
            this.dataNews = res['data'];
          }

          // save to local
          if (idkabkota) {
            this.newsService.saveLocal(this.NEWS_KABKOTA, this.dataNewsKabkota);
          } else {
            this.newsService.saveLocal(this.NEWS, this.dataNews);
          }
          this.isLoading.news = false;
        }
      },
      err => {
        setTimeout(() => {
          // get local
          if (this.newsService.getLocal(this.NEWS) && !idkabkota) {
            this.dataNews = JSON.parse(this.newsService.getLocal(this.NEWS));
          } else if (
            this.newsService.getLocal(this.NEWS_KABKOTA) &&
            idkabkota
          ) {
            this.dataNewsKabkota = JSON.parse(
              this.newsService.getLocal(this.NEWS_KABKOTA)
            );
          }
          this.isLoading.news = false;
        }, 3000);
      }
    );
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

  getVideoPost() {
    // check internet
    if (!navigator.onLine) {
      // get local
      if (this.videoPostService.getLocal(this.VIDEO_POST)) {
        this.dataVideoPost = JSON.parse(
          this.videoPostService.getLocal(this.VIDEO_POST)
        );
      } else {
        alert(Dictionary.offline);
      }
      return;
    }

    this.isLoading.videoPost = true;
    this.videoPostService.getListvideoPost('limit=5').subscribe(
      res => {
        if (res['status'] === 200 && res['data']['items'].length) {
          this.dataVideoPost = res['data']['items'];
          // save to local
          this.videoPostService.saveLocal(this.VIDEO_POST, this.dataVideoPost);
          this.isLoading.videoPost = false;
        }
      },
      err => {
        setTimeout(() => {
          // get local
          if (this.videoPostService.getLocal(this.VIDEO_POST)) {
            this.dataVideoPost = JSON.parse(
              this.videoPostService.getLocal(this.VIDEO_POST)
            );
            this.isLoading.videoPost = false;
          }
        }, 3000);
      }
    );
  }

  private parsingDataUrl(id: string) {
    return id.split('=')[1];
  }

  getThumbUrl(url: string) {
    return `https://img.youtube.com/vi/${this.parsingDataUrl(
      url
    )}/mqdefault.jpg`;
  }

  openYoutube(url: string, title?: string) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }
    this.youtube.openVideo(this.parsingDataUrl(url));

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.videoList,
      'view_detail_videos',
      title,
      1
    );

    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_videos',
      title,
      1
    );
  }
}
