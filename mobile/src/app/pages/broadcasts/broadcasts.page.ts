import { Component, OnInit } from '@angular/core';
import { BroadcastService } from '../../services/broadcast.service';
import { LoadingController } from '@ionic/angular';
import { Broadcast } from '../../interfaces/broadcast';
import { Router } from '@angular/router';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';
import { ProfileService } from '../../services/profile.service';

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

  idUser: number;

  isIndeterminate: boolean;
  masterCheck: boolean;
  checkBoxList: any;

  isPressDelete = false;

  constructor(
    private broadcastService: BroadcastService,
    public loadingCtrl: LoadingController,
    private router: Router,
    private util: UtilitiesService,
    private constants: Constants,
    private profileService: ProfileService
  ) {
    this.idUser = this.profileService.getLocalProfile().id;
  }

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.broadcast);

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.broadcast,
      'view_list_broadcast',
      '',
      1
    );

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

    this.currentPage = 1;
    this.maximumPages = null;

    this.dataRead = this.broadcastService.getBroadcast() || [];

    // listen and render component
    this.interval = setInterval(() => {
      this.dataRead = this.broadcastService.getBroadcast() || [];
    }, 1000);
    if (this.dataRead && this.dataBroadcast) {
      this.checkLenghtRead();
    }

    this.isPressDelete = false;
    this.isIndeterminate = false;
  }

  // Called when view is left
  ionViewWillLeave() {
    window.clearInterval(this.interval);
  }

  // get data broadcasts
  getNomorBroadcasts(infiniteScroll?: any) {
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

    this.dataEmpty = false;

    this.broadcastService.getListBroadCasts(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          if (infiniteScroll) {
            this.dataBroadcast = this.dataBroadcast.concat(
              res['data']['items']
            );
          } else {
            this.dataBroadcast = res['data']['items'];
          }

          // add new element isChecked for identify delete broadcast
          this.dataBroadcast.forEach(key => {
            key['isChecked'] = false;
          });

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
      }
    );

    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }
  }

  // go to detail broadcast with param id
  goDetail(broadcast: Broadcast) {
    if (this.isPressDelete) {
      return;
    }
    // add to list dataRead
    if (this.checkRead(broadcast.id) === false) {
      const data = {
        id: broadcast.id,
        iduser: this.idUser,
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
        author: broadcast.sender_name,
        title: broadcast.title,
        category_name: broadcast.category_name,
        description: broadcast.content,
        updated_at: broadcast.created_at
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
  checkRead(id: string) {
    return this.dataRead.filter(x => x.id === id).length > 0;
  }

  checkEvent() {
    const totalItems = this.dataBroadcast.length;
    const itemSelected = [];
    let checked = 0;
    this.dataBroadcast.map(obj => {
      if (obj.isChecked) {
        checked++;
        // add object to list
        itemSelected.push(obj);
      }
    });

    if (checked > 0 && checked < totalItems) {
      // If even one item is checked but not all
      this.isIndeterminate = true;
      this.masterCheck = false;
    } else {
      // If none is checked
      this.isIndeterminate = false;
      this.masterCheck = false;
    }
  }

  confirmDelete() {
    const buttons = [
      {
        text: 'Batal',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {}
      },
      {
        text: 'Hapus',
        handler: () => {
          this.deleteBroadcast();
        }
      }
    ];

    this.util.alertConfirmation(
      Dictionary.delete_broadcast,
      buttons,
      Dictionary.header_broadcast
    );
  }

  async deleteBroadcast() {
    const dataDeleteBroadcast = [];
    this.dataBroadcast.map(obj => {
      if (obj.isChecked) {
        dataDeleteBroadcast.push(obj.id);
      }
    });

    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.broadcastService.deleteBroadcast(dataDeleteBroadcast).subscribe(
      _ => {
        // remove data selected
        const getDataBroadcast = this.dataBroadcast.filter(
          item => !dataDeleteBroadcast.includes(item.id)
        );

        this.dataBroadcast = getDataBroadcast;

        this.clearChecked();
        this.isPressDelete = false;

        this.util.alertConfirmation(Dictionary.success_delete_broadcast, [
          'OK'
        ]);
      },
      err => {
        if (err.name === 'TimeoutError') {
          this.util.alertConfirmation(Dictionary.offline, ['OK']);
        } else {
          this.util.alertConfirmation(Dictionary.terjadi_kesalahan, ['OK']);
        }
      }
    );

    loader.dismiss();
  }

  eventDelete($event) {
    if (this.isPressDelete === false) {
      this.isPressDelete = true;
    } else {
      this.isPressDelete = false;
      this.clearChecked();
    }
  }

  clearChecked() {
    this.isIndeterminate = false;
    // clear checked
    this.dataBroadcast.map(obj => {
      obj.isChecked = false;
    });
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
      this.getNomorBroadcasts(event);
    }, 2000);
  }
}
