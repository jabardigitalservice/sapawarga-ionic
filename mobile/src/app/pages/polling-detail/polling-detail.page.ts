import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ToastController,
  NavController,
  LoadingController
} from '@ionic/angular';
import { PollingService } from '../../services/polling.service';
import { Polling } from '../../interfaces/polling';
import { Dictionary } from '../../helpers/dictionary';

@Component({
  selector: 'app-polling-detail',
  templateUrl: './polling-detail.page.html',
  styleUrls: ['./polling-detail.page.scss']
})
export class PollingDetailPage implements OnInit {
  public items: any = [];
  dataPolling: Polling;

  dataAnswer: any;

  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    private route: ActivatedRoute,
    public toastCtrl: ToastController,
    private navCtrl: NavController,
    private pollingService: PollingService,
    public loadingCtrl: LoadingController
  ) {}

  id: number;
  ngOnInit() {
    // get id detail polling
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.getDetailPolling();
  }

  async getDetailPolling() {
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.pollingService.getDetailPolling(this.id).subscribe(
      res => {
        this.dataPolling = res['data'];
        loader.dismiss();
      },
      err => {
        loader.dismiss();
        this.showToast(err.data.message);
        // jika data not found
        this.navCtrl.back();
      }
    );
  }

  radioChecked(data: object) {
    this.dataAnswer = data;
  }

  async submitPolling() {
    // check ischecked if invalid
    if (!this.dataAnswer) {
      return;
    }

    // check internet
    if (!navigator.onLine) {
      this.showToast(Dictionary.offline);
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();
    this.pollingService
      .putPollingAnswer(this.dataPolling.id, this.dataAnswer.id)
      .subscribe(
        res => {
          if (res.status === 200) {
            this.showToast(Dictionary.success_polling);
            this.navCtrl.back();
          } else {
            this.showToast(Dictionary.failed_save);
          }
          loader.dismiss();
        },
        err => {
          loader.dismiss();
          // check if status 422
          if (err.status === 422) {
            // get data from server
            this.showToast(Dictionary.have_done_vote);
          } else {
            this.msgResponse = {
              type: 'server-error',
              msg: Dictionary.internalError
            };
          }
        }
      );
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
