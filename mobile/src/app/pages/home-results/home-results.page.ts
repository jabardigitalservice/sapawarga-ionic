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
        path: 'e-samsat'
      },
      {
        title: 'Saber Hoaks',
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
      case 'Saber Hoaks':
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
}

