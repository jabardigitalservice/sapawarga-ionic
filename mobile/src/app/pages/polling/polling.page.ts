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
  ) {
    this.dataPolling = [];
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.currentPage = 1;
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
          if (infiniteScroll) {
            this.dataPolling = this.dataPolling.concat(res['data']['items']);
          } else {
            this.dataPolling = res['data']['items'];
          }

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

  goDetail(id: number) {
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    this.CheckVote(id);
  }

  CheckVote(id: number) {
    // check internet
    if (!navigator.onLine) {
      this.msgResponse = {
        type: 'offline',
        msg: Dictionary.offline
      };
      return;
    }

    // check jika belum pernah vote polling
    this.pollingService.getCheckPolling(id).subscribe(
      res => {
        console.log(res);
        if (res['status'] === 200) {
          if (res['data']['is_voted'] === false) {
            this.router.navigate(['/polling', id]);
          } else {
            this.showToast(Dictionary.have_done_vote);
          }
        }
      },
      err => {
        if (err) {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
        // return null;
      }
    );
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
