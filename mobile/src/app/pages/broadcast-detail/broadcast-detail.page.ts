import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Broadcast } from '../../interfaces/broadcast';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'app-broadcast-detail',
  templateUrl: './broadcast-detail.page.html',
  styleUrls: ['./broadcast-detail.page.scss']
})
export class BroadcastDetailPage implements OnInit {
  dataBroadcast: any;
  dataRead = [];
  constructor(
    private broadcastService: BroadcastService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    // get data detail Broadcast
    this.route.queryParamMap.subscribe(params => {
      this.dataBroadcast = params['params'];
    });
    // add to list dataRead
    this.dataRead = this.broadcastService.getBroadcast() || [];
  }

  // Called when view is left
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.backButton();
  }

  backButton() {
    // check navigate before, from push notification or not
    if (!this.dataBroadcast['push_notification']) {
      // set notification false remove notif
      // this.broadcastService.setNotification(false);
      this.navCtrl.navigateForward('/tabs/broadcasts');
    } else {
      this.SetRead(parseInt(this.dataBroadcast.id, 10));
      this.navCtrl.navigateRoot('/tabs/broadcasts');
    }
  }

  SetRead(id: number) {
    console.log('id parser' + id);
    if (this.checkRead(id) === false) {
      const data = {
        id: id,
        read: true
      };
      this.dataRead.push(data);

      // to dataRead to local storage
      this.broadcastService.saveBroadcast(JSON.stringify(this.dataRead));
    }
  }

  // check if data isRead/UnRead
  checkRead(id: number) {
    return this.dataRead.filter(x => x.id === id).length > 0;
  }
}
