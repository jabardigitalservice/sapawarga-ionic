import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, Platform } from '@ionic/angular';
import { PollingService } from '../../services/polling.service';
import { Polling } from '../../interfaces/polling';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-polling-detail',
  templateUrl: './polling-detail.page.html',
  styleUrls: ['./polling-detail.page.scss']
})
export class PollingDetailPage implements OnInit {
  public items: any = [];
  dataPolling: Polling;

  dataAnswer: any;
  backButton: any;

  msgResponse = {
    type: '',
    msg: ''
  };
  isPushNotification = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private pollingService: PollingService,
    public loadingCtrl: LoadingController,
    private platform: Platform,
    private util: UtilitiesService,
    private constants: Constants
  ) {}

  id: number;
  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.polling);

    this.util.trackEvent(
      this.constants.pageName.polling,
      'view_detail_polling',
      '',
      1
    );

    // get id detail polling
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.route.queryParamMap.subscribe(params => {
      this.isPushNotification = params['params']['isPushNotification'];
    });

    this.getDetailPolling();
  }

  ionViewDidEnter() {
    // handle hardware backbutton
    this.backButton = this.platform.backButton.subscribeWithPriority(1, () => {
      this.confirmation();
    });
  }

  // unsubscribe backButton
  ionViewWillLeave() {
    this.backButton.unsubscribe();
  }

  async getDetailPolling() {
    const currentDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    this.pollingService.getDetailPolling(this.id).subscribe(
      res => {
        const getCompare = this.compareDate(
          currentDate,
          res['data']['end_date']
        );

        if (getCompare > 0) {
          this.dataPolling = res['data'];
        } else {
          this.util.showToast(Dictionary.polling_not_found);

          // go back to previous page
          this.util.backButton(this.isPushNotification);
        }
      },
      err => {
        this.util.showToast(err.data.message);
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
      this.util.showToast(Dictionary.offline);
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
            this.util.showToast(Dictionary.success_polling);
            this.navCtrl.back();

            // google analytics
            this.util.trackEvent(
              this.constants.pageName.polling,
              'create_pollanswer',
              this.dataPolling.question,
              1
            );
          } else {
            this.util.showToast(Dictionary.failed_save);
          }
          loader.dismiss();
        },
        err => {
          loader.dismiss();
          // check if status 422
          if (err.status === 422) {
            // get data from server
            this.util.showToast(Dictionary.have_done_vote);
          } else {
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
        }
      );
  }

  async confirmation() {
    // check if vote ischecked
    if (!this.dataAnswer) {
      this.util.backButton(this.isPushNotification);
      return;
    }

    const header = 'Konfirmasi';
    const buttons = [
      {
        text: 'Batal',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {}
      },
      {
        text: 'Lanjut',
        handler: () => {
          this.util.backButton(this.isPushNotification);
        }
      }
    ];

    this.util.alertConfirmation(Dictionary.polling_leave, buttons, header);
  }

  compareDate(currentDate: any, endDate: any): number {
    // compare dates, create a new instance of Date with 'new Date()'
    const current = new Date(currentDate);
    const end = new Date(endDate);

    // Check if the currentDate is less than endDate
    if (current <= end) {
      return 1;
    } else {
      return 0;
    }
  }
}
