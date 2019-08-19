import { Component, OnInit } from '@angular/core';
import { BroadcastService } from '../../services/broadcast.service';
import { LoadingController } from '@ionic/angular';
import { Broadcast } from '../../interfaces/broadcast';
import { Router } from '@angular/router';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

@Component({
  selector: 'app-broadcasts',
  templateUrl: './broadcasts.page.html',
  styleUrls: ['./broadcasts.page.scss']
})
export class BroadcastsPage implements OnInit {
  dataBroadcast: Broadcast[];
  dataRead = [];
  dataEmpty = false;
  currentPage = 1;
  maximumPages: number;

  interval: any;

  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    private broadcastService: BroadcastService,
    public loadingCtrl: LoadingController,
    private router: Router,
    private util: UtilitiesService,
    private constants: Constants
  ) {}

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.broadcast);

    // set notification false remove notif
    this.dataRead = this.broadcastService.getBroadcast() || [];
    this.getNomorBroadcasts();
    if (this.dataRead && this.dataBroadcast) {
      this.checkLenghtRead();
    }
  }

  ionViewDidEnter() {
    this.dataEmpty = false;
    this.msgResponse = {
      type: '',
      msg: ''
    };

    this.dataRead = this.broadcastService.getBroadcast() || [];
    this.getNomorBroadcasts();

    // listen and render component
    this.interval = setInterval(() => {
      this.dataRead = this.broadcastService.getBroadcast() || [];
    }, 1000);
    if (this.dataRead && this.dataBroadcast) {
      this.checkLenghtRead();
    }
  }

  // Called when view is left
  ionViewWillLeave() {
    window.clearInterval(this.interval);
  }

  // get data broadcasts
  async getNomorBroadcasts() {
    // check internet
    if (!navigator.onLine) {
      // get local
      if (this.broadcastService.getLocalBroadcast()) {
        this.dataBroadcast = JSON.parse(
          this.broadcastService.getLocalBroadcast()
        );
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
    loader.present();

    this.dataEmpty = false;

    this.broadcastService.getListBroadCasts().subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataBroadcast = res['data']['items'];

          // save to local
          this.broadcastService.saveLocalBroadcast(this.dataBroadcast);
        } else {
          this.dataEmpty = true;
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty
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

  // go to detail broadcast with param id
  goDetail(broadcast: Broadcast) {
    // add to list dataRead
    if (this.checkRead(broadcast.id) === false) {
      const data = {
        id: broadcast.id,
        read: true
      };
      this.dataRead.push(data);

      // to dataRead to local storage
      this.broadcastService.saveBroadcast(JSON.stringify(this.dataRead));
    }

    this.checkLenghtRead();

    this.router.navigate(['/broadcast', broadcast.id], {
      queryParams: {
        id: broadcast.id,
        author: broadcast.author.name,
        title: broadcast.title,
        category_name: broadcast.category.name,
        description: broadcast.description,
        updated_at: broadcast.updated_at
      }
    });
  }

  // check if length data broadCast === dataRead
  checkLenghtRead() {
    if (this.dataRead.length === this.dataBroadcast.length) {
      this.broadcastService.setNotification(false);
    } else {
      this.broadcastService.setNotification(true);
    }
  }

  // check if data isRead/UnRead
  checkRead(id: number) {
    return this.dataRead.filter(x => x.id === id).length > 0;
  }
}
