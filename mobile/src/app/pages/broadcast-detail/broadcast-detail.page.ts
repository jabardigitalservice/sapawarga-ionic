import { Component, OnInit } from '@angular/core';
import {
  NavController,
  LoadingController,
  ToastController
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Broadcast } from '../../interfaces/broadcast';

@Component({
  selector: 'app-broadcast-detail',
  templateUrl: './broadcast-detail.page.html',
  styleUrls: ['./broadcast-detail.page.scss']
})
export class BroadcastDetailPage implements OnInit {
  dataBroadcast: Broadcast;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // get data detail Broadcast
    this.route.queryParamMap.subscribe(params => {
      this.dataBroadcast = params['params'];
    });
  }

  // Called when view is left
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    if (!this.dataBroadcast['push_notification']) {
      this.navCtrl.navigateForward('/tabs/broadcasts');
    } else {
      this.navCtrl.navigateRoot('/tabs/broadcasts');
    }
  }

  backButton() {
    // check navigate before, from push notification or not
    if (!this.dataBroadcast['push_notification']) {
      this.navCtrl.navigateForward('/tabs/broadcasts');
    } else {
      this.navCtrl.navigateRoot('/tabs/broadcasts');
    }
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
