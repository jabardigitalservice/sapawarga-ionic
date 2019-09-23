import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Dictionary } from '../../helpers/dictionary';
import { SaberHoaxService } from 'src/app/services/saber-hoax.service';
import { SaberHoax } from 'src/app/interfaces/saber-hoax';
import { Constants } from '../../helpers/constants';
import { UtilitiesService } from '../../services/utilities.service';

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

  public telpSaberHoax: string;
  constructor(
    private saberHoaxService: SaberHoaxService,
    private loadingCtrl: LoadingController,
    private constants: Constants,
    private util: UtilitiesService
  ) {
    this.telpSaberHoax = this.constants.telpSaberHoax;
  }

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.saberHoax);

    this.getListSaberHoax();
  }

  ionViewWillLeave() {
    // clear state
    this.dataSaberHoax = [];
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
        color = 'warning';
        break;
      case 'Disinformasi':
        color = 'success';
        break;
      case 'Misinformasi':
        color = 'danger';
        break;
      default:
        color = 'primary';
        break;
    }
    return color;
  }

  sendMessage() {
    const openWa = `whatsapp://send?phone=${this.telpSaberHoax}`;
    return openWa;
  }
}
