import { Component, OnInit } from '@angular/core';
import {
  NavController,
  LoadingController,
  ToastController
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Broadcast } from '../../interfaces/broadcast';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'app-broadcast-detail',
  templateUrl: './broadcast-detail.page.html',
  styleUrls: ['./broadcast-detail.page.scss']
})
export class BroadcastDetailPage implements OnInit {
  idBroadcast: number;
  dataBroadcast: Broadcast;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private broadcastService: BroadcastService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // get id detail Broadcast
    this.route.params.subscribe(params => {
      this.idBroadcast = params['id'];
    });

    if (this.idBroadcast) {
      this.getDetaiBroadcast();
    }
  }

  // get data nomor penting
  async getDetaiBroadcast() {
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.broadcastService.getDetailBroadCast(this.idBroadcast).subscribe(
      res => {
        this.dataBroadcast = res['data'];
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

  // Called when view is left
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.navCtrl.navigateForward('/tabs/broadcasts');
  }

  backButton() {
    this.navCtrl.navigateForward('/tabs/broadcasts');
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
