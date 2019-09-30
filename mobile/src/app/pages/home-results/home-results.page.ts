import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, LoadingController, IonSlides } from '@ionic/angular';
import { Pages } from '../../interfaces/pages';
import { NotifikasiService } from '../../services/notifikasi.service';
import { Constants } from '../../helpers/constants';
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

  unreadNotif: 0;

  constructor(
    public navCtrl: NavController,
    private notifikasiService: NotifikasiService,
    public loadingCtrl: LoadingController,
    public constants: Constants,
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
      {
        title: 'E-samsat',
        url: '',
        icon: 'assets/icon/SW-E-samsat.png'
      },
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
  goToLayanan(app: string, layananUrl: string) {
    switch (app) {
      case 'E-samsat':
        this.goSamsat();
        break;
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
}
