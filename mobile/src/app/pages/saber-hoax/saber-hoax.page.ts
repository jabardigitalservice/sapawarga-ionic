import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Dictionary } from '../../helpers/dictionary';
import { SaberHoaxService } from 'src/app/services/saber-hoax.service';
import { SaberHoax } from 'src/app/interfaces/saber-hoax';

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
  title =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque blanditiis in officia esse? Accusamus tempora molestias enim dolores molestiae obcaecati dolore amet sit magnam, ullam maxime delectus! Culpa, facere sed?';
  constructor(
    private saberHoaxService: SaberHoaxService,
    private loadingCtrl: LoadingController
  ) {}

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
}
