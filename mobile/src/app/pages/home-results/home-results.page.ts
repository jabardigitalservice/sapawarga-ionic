import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, LoadingController, IonSlides } from '@ionic/angular';
import { Pages } from '../../interfaces/pages';
import { NotifikasiService } from '../../services/notifikasi.service';
import { Constants } from '../../helpers/constants';
import { UtilitiesService } from '../../services/utilities.service';
import { NewsService } from 'src/app/services/news.service';
import { Dictionary } from 'src/app/helpers/dictionary';
import { Banner } from '../../interfaces/banner';
import { Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';

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

  bannersList: Banner[];

  logoApp = 'assets/icon/logo.png';

  slideOpts = {
    effect: 'flip',
    autoplay: {
      delay: 3000
    },
    zoom: false
  };

  unreadNotif: 0;

  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    public navCtrl: NavController,
    private notifikasiService: NotifikasiService,
    public loadingCtrl: LoadingController,
    public constants: Constants,
    private util: UtilitiesService,
    private newsService: NewsService,
    private router: Router,
    private surveyService: SurveyService
  ) {
    this.appPages = [
      {
        title: 'Lapor',
        url: '',
        icon: 'assets/icon/SW-LAPOR.png',
        path: 'lapor'
      },
      {
        title: 'Usulan',
        url: '',
        icon: 'assets/icon/SW-ASPIRASI.png',
        path: 'aspirasi'
      },
      {
        title: 'Survei',
        url: '',
        icon: 'assets/icon/SW-SURVEY.png',
        path: 'survey'
      },
      {
        title: 'Polling',
        url: '',
        icon: 'assets/icon/SW-POLLING.png',
        path: 'polling'
      },
      {
        title: 'Nomor\npenting',
        url: '',
        icon: 'assets/icon/SW-NOPENTING.png',
        path: 'nomor-penting'
      },
      {
        title: 'E-samsat',
        url: '',
        icon: 'assets/icon/SW-E-samsat.png',
        path: 'question-and-answer'
      },
      {
        title: 'Jabar Saber Hoaks',
        url: '',
        icon: 'assets/icon/saber_hoax.png',
        path: 'saber-hoax'
      },
      {
        title: 'Lainnya',
        url: '',
        icon: 'assets/icon/other.png',
        path: ''
      }
    ];

    this.otherPages = [
      {
        text: 'Administrasi',
        handler: () => {
          this.navigationForward('administrasi', 'tapped_administrasi');
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
    this.getListBanners();
  }

  async getListBanners() {
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });

    this.newsService.getBanners().subscribe(
      res => {
        if (res['data']['items'].length) {
          this.bannersList = res['data']['items'];
        }
      },
      err => {
        if (err.name === 'TimeoutError') {
          this.msgResponse = {
            type: 'offline',
            msg: Dictionary.offline
          };
        } else {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
      }
    );
  }

  goToBanner(banner: Banner) {
    const action = 'tapped_detail_banner';

    if (banner.type === 'external') {
      this.util.launchweb(banner.link_url);
    } else if (
      banner.type === 'internal' &&
      banner.internal_category === 'survey'
    ) {
      this.getDetailSurvey(banner.internal_entity_id);
    } else if (banner.type === 'internal') {
      this.router.navigate([
        `/${banner.internal_category}`,
        banner.internal_entity_id
      ]);
    }

    // add event
    this.util.trackEvent(
      this.constants.pageName.home_pages,
      action,
      banner.title,
      1
    );
  }

  swipeSlide() {
    const action = 'swipe_banners';

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
  goToLayanan(app: string, path: string) {
    switch (app) {
      case 'E-samsat':
        this.navigationForward(path, 'tapped_e_Samsat');
        break;
      case 'Nomor\npenting':
        this.navigationForward(path, 'tapped_nomor');
        break;
      case 'Lapor':
        this.navigationForward(path, 'tapped_lapor');
        break;
      case 'Usulan':
        this.navigationForward(path, 'tapped_usulan');
        break;
      case 'Polling':
        this.navigationForward(path, 'tapped_polling');
        break;
      case 'Survei':
        this.navigationForward(path, 'tapped_survei');
        break;
      case 'Jabar Saber Hoaks':
        // check if offline
        if (!navigator.onLine) {
          alert(Dictionary.offline);
          return;
        }

        this.navigationForward(path, 'tapped_saber_hoax');
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

  navigationForward(path: string, event: string) {
    this.navCtrl.navigateForward(path);

    // google event analytics
    this.util.trackEvent(this.constants.pageName.home_pages, event, '', 1);
  }

  async getDetailSurvey(id: number) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.surveyService.getDetailSurvey(id).subscribe(
      res => {
        if (res['status'] === 200) {
          const external_url = res['data'].external_url;
          this.util.launchweb(external_url);
        }
        loader.dismiss();
      },
      _ => {
        loader.dismiss();
        this.util.showToast(Dictionary.terjadi_kesalahan);
      }
    );
  }
}
