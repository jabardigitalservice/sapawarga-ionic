import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ToastController,
  NavController,
  LoadingController,
  Platform,
  AlertController
} from '@ionic/angular';
import { PollingService } from '../../services/polling.service';
import { Polling } from '../../interfaces/polling';

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

  constructor(
    private route: ActivatedRoute,
    public toastCtrl: ToastController,
    private navCtrl: NavController,
    private pollingService: PollingService,
    public loadingCtrl: LoadingController,
    private platform: Platform,
    private alertController: AlertController
  ) {}

  id: number;
  ngOnInit() {
    // get id detail polling
    this.route.params.subscribe(params => {
      this.id = params['id'];
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
      this.showToast('Tidak ada koneksi internet');
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
            this.showToast('Terima kasih anda sudah mengisi polling');
            this.navCtrl.back();
          } else {
            this.showToast('Data gagal tersimpan');
          }
          loader.dismiss();
        },
        err => {
          loader.dismiss();
          // check if status 422
          if (err.status === 422) {
            // get data from server
            this.showToast('Anda sudah melakukan polling ini sebelumnya');
          } else {
            this.showToast(
              'Data gagal tersimpan periksa kembali koneksi internet anda'
            );
          }
        }
      );
  }

  async confirmation() {
    // check if vote ischecked
    if (!this.dataAnswer) {
      this.navCtrl.back();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message:
        'Anda belum mengisi polling. Apakah anda ingin meninggalkan halaman polling?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Lanjut',
          handler: () => {
            this.navCtrl.back();
          }
        }
      ]
    });

    await alert.present();
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
