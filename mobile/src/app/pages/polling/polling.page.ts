import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Polling } from '../../interfaces/polling';
import { PollingService } from '../../services/polling.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Dictionary } from '../../helpers/dictionary';

@Component({
  selector: 'app-polling',
  templateUrl: './polling.page.html',
  styleUrls: ['./polling.page.scss']
})
export class PollingPage implements OnInit {
  public items: any = [];

  dataPolling: Polling[];
  currentPage = 1;
  maximumPages: number;

  dataEmpty = false;

  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    private pollingService: PollingService,
    public loadingCtrl: LoadingController,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.getListPolling();
  }

  async getListPolling(infiniteScroll?) {
    // check internet
    if (!navigator.onLine) {
      // get local
      if (this.pollingService.getLocalPolling()) {
        this.dataPolling = this.pollingService.getLocalPolling();
      } else {
        this.msgResponse = {
          type: 'offline',
          msg: Dictionary.offline
        };
      }
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });

    if (!infiniteScroll) {
      loader.present();
    }

    this.dataEmpty = false;

    this.pollingService.getListPolling(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataPolling = res['data']['items'];

          // save to local
          this.pollingService.saveLocalPolling(this.dataPolling);
        } else {
          this.dataEmpty = true;
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty_aspirasi
          };
        }
        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;
        loader.dismiss();
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

  goDetail(id: number) {
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    this.router.navigate(['/polling', id]);
  }

  // infinite scroll
  doInfinite(event) {
    if (this.currentPage === this.maximumPages) {
      event.target.disabled = true;
      return;
    }
    // increase page
    this.currentPage++;

    setTimeout(() => {
      this.getListPolling(event);
    }, 2000);
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
