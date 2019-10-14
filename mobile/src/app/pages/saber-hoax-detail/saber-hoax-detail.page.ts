import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from 'src/app/helpers/dictionary';
import { LoadingController, NavController } from '@ionic/angular';
import { SaberHoax } from '../../interfaces/saber-hoax';
import { Constants } from '../../helpers/constants';
import { SaberHoaxService } from '../../services/saber-hoax.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-saber-hoax-detail',
  templateUrl: './saber-hoax-detail.page.html',
  styleUrls: ['./saber-hoax-detail.page.scss']
})
export class SaberHoaxDetailPage implements OnInit {
  id = 0;
  dataSaberHoax: SaberHoax;
  msgResponse = {
    type: '',
    msg: ''
  };
  isPushNotification = false;

  constructor(
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private constants: Constants,
    private saberHoaxService: SaberHoaxService,
    private util: UtilitiesService,
    private navCtrl: NavController
  ) {}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getDetailSaberHoax(this.id);
    });

    this.route.queryParamMap.subscribe(params => {
      this.isPushNotification = params['params']['isPushNotification'];
    });
  }

  backButton() {
    this.util.backButton(this.isPushNotification);
  }

  ionViewWillLeave() {
    this.msgResponse = {
      type: '',
      msg: ''
    };
  }

  async getDetailSaberHoax(id: number) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.dataSaberHoax = null;

    this.saberHoaxService.getDetailSaberHoax(id).subscribe(
      res => {
        if (res['status'] === 200) {
          this.dataSaberHoax = res['data'];

          // google event analytics
          this.util.trackEvent(
            this.constants.pageName.saberHoax,
            'view_detail_saber_hoax',
            this.dataSaberHoax.title,
            1
          );
        }
        loader.dismiss();
      },
      err => {
        loader.dismiss();

        if (err.status === 404) {
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty
          };
        }
      }
    );
  }
}
