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
    this.getListSaberHoax();
  }

  ionViewWillLeave() {
    this.dataSaberHoax = [];
  }

  async getListSaberHoax(infiniteScroll?: number) {
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });

    if (!infiniteScroll) {
      loader.present();
    }

    this.saberHoaxService.getListSaberHoax(this.currentPage).subscribe(
      res => {
        console.log(res);
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
            msg: Dictionary.msg_news
          };
        }
        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;
        loader.dismiss();
        // stop infinite scroll
        // if (infiniteScroll) {
        //   infiniteScroll.target.complete();
        // }
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
  // doInfinite(event: any) {
  //   if (this.currentPage === this.maximumPages) {
  //     event.target.disabled = true;
  //     return;
  //   }
  //   // increase page
  //   this.currentPage++;

  //   setTimeout(() => {
  //     this.getListSaberHoax(event);
  //   }, 2000);
  // }

  checkStatus(status: number) {
    let color: string;
    switch (status) {
      case 5:
        color = 'primary';
        break;
      case 10:
        color = 'success';
        break;
      case 3:
        color = 'danger';
        break;
      case 0:
        color = 'warning';
        break;
      case -1:
        color = 'danger';
        break;
      default:
        color = '';
        break;
    }
    return color;
  }

  sendMessage() {
    const openWa = `whatsapp://send?phone=${this.telpSaberHoax}`;
    return openWa;
  }
}
