import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { Dictionary } from '../../helpers/dictionary';
import { SaberHoaxService } from 'src/app/services/saber-hoax.service';
import { SaberHoax } from 'src/app/interfaces/saber-hoax';
import { Constants } from '../../helpers/constants';
import { UtilitiesService } from '../../services/utilities.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-saber-hoax',
  templateUrl: './saber-hoax.page.html',
  styleUrls: ['./saber-hoax.page.scss']
})
export class SaberHoaxPage implements OnInit {
  dataSaberHoax: SaberHoax[];
  currentPage = 1;
  maximumPages: number;
  msgResponse = {
    type: '',
    msg: ''
  };
  isPushNotification = false;

  public telpSaberHoax: string;
  constructor(
    private saberHoaxService: SaberHoaxService,
    private loadingCtrl: LoadingController,
    private constants: Constants,
    private util: UtilitiesService,
    private platform: Platform,
    private inAppBrowser: InAppBrowser,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.telpSaberHoax = this.constants.telpSaberHoax;
  }

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.saberHoax);

    this.route.queryParamMap.subscribe(params => {
      this.isPushNotification = params['params']['isPushNotification'];
    });

    this.getListSaberHoax();
  }

  backButton() {
    this.util.backButton(this.isPushNotification);
  }

  ionViewWillLeave() {
    // clear state
    this.maximumPages = null;
    this.currentPage = 1;
    this.msgResponse = {
      type: '',
      msg: ''
    };
  }

  async getListSaberHoax(infiniteScroll?: any) {
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });

    // clear state
    this.msgResponse = {
      type: '',
      msg: ''
    };

    if (!infiniteScroll) {
      loader.present();
    }

    this.saberHoaxService.getListSaberHoax(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          if (infiniteScroll) {
            this.dataSaberHoax = this.dataSaberHoax.concat(
              res['data']['items']
            );
          } else {
            this.dataSaberHoax = res['data']['items'];
          }
        } else {
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.msg_saber_hoax
          };
        }
        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;
        loader.dismiss();
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
      },
      err => {
        loader.dismiss();
        if (err) {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
      }
    );
  }

  // infinite scroll
  doInfinite(event: any) {
    if (this.currentPage === this.maximumPages) {
      event.target.disabled = true;
      return;
    }
    // increase page
    this.currentPage++;

    setTimeout(() => {
      this.getListSaberHoax(event);
    }, 2000);
  }

  checkStatus(status: string) {
    let color: string;
    switch (status) {
      case 'Klarifikasi':
        color = 'dark';
        break;
      case 'Disinformasi':
        color = 'warning';
        break;
      case 'Misinformasi':
        color = 'primary';
        break;
      case 'Fakta':
        color = 'dark';
        break;
      case 'Berita':
        color = 'dark';
        break;
      default:
        color = 'dark';
        break;
    }
    return color;
  }

  sendMessage() {
    // check if the platform is ios or android, else open the web url
    this.platform.ready().then(() => {
      this.inAppBrowser.create(
        `https://wa.me/${this.telpSaberHoax}`,
        '_system'
      );

      // event google analytics
      this.util.trackEvent(
        this.constants.pageName.saberHoax,
        'tapped_view_WA_saber_hoax',
        '',
        1
      );
    });
  }

  goToDetailSaberHoax(id: number) {
    // check internet
    if (!navigator.onLine) {
      this.util.showToast(Dictionary.offline);
      return;
    }

    this.router.navigate(['/saber-hoax', id]);
  }
}
