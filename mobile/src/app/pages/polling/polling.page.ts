import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Polling } from '../../interfaces/polling';
import { PollingService } from '../../services/polling.service';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

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
  isLoading = false;

  msgResponse = {
    type: '',
    msg: ''
  };
  isPushNotification = false;

  constructor(
    private pollingService: PollingService,
    private router: Router,
    private util: UtilitiesService,
    public constants: Constants,
    private route: ActivatedRoute
  ) {
    this.dataPolling = [];
  }

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.polling);

    this.route.queryParamMap.subscribe(params => {
      this.isPushNotification = params['params']['isPushNotification'];
    });

    this.util.trackEvent(
      this.constants.pageName.polling,
      'view_list_polling',
      '',
      1
    );
  }

  backButton() {
    this.util.backButton(this.isPushNotification);
  }

  ionViewDidEnter() {
    this.currentPage = 1;
    this.getListPolling();
  }

  getListPolling(infiniteScroll?) {
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

    this.dataEmpty = false;

    if (!infiniteScroll) {
      this.isLoading = true;
    }

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
            msg: Dictionary.polling_empty
          };
        }
        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
        this.isLoading = false;
      },
      err => {
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

        this.isLoading = false;
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
}
