import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ToastController,
  NavController,
  LoadingController
} from '@ionic/angular';
import { PollingService } from '../../services/polling.service';
import { Polling } from 'src/app/interfaces/polling';

@Component({
  selector: 'app-polling-detail',
  templateUrl: './polling-detail.page.html',
  styleUrls: ['./polling-detail.page.scss']
})
export class PollingDetailPage implements OnInit {
  public items: any = [];
  dataPolling: Polling;

  constructor(
    private route: ActivatedRoute,
    public toastCtrl: ToastController,
    private navCtrl: NavController,
    private pollingService: PollingService,
    public loadingCtrl: LoadingController
  ) {
    this.items = [
      {
        id: 1,
        title:
          'Seberapa puaskah anda terhadap pelayanan yang ada dari Pemerintah Provinsi Jawa Barat?',
        pollings: [
          {
            id: 1,
            name: 'Puas'
          },
          {
            id: 2,
            name: 'Biasa saja'
          },
          {
            id: 3,
            name: 'Kurang puas'
          }
        ],
        votes: 30
      },
      {
        id: 2,
        title:
          'Menurut anda apakah peran Pemerintah Daerah Provinsi Jawa Barat sudah cukup baik dalam mengelola harga bahan pokok?',
        pollings: [
          {
            id: 1,
            name: 'Baik'
          },
          {
            id: 2,
            name: 'Cukup'
          },
          {
            id: 3,
            name: 'Kurang'
          }
        ],
        votes: 30
      },
      {
        id: 3,
        title:
          'Menurut anda apakah implementasi teknologi pada layanan Pemerintah Provinsi Jawa Barat dapat memberikan pengaruh yang baik dalam peningkatan layanan pemerintahan terhadap masyarakat?',
        pollings: [
          {
            id: 1,
            name: 'Ya, sangat berpengaruh'
          },
          {
            id: 2,
            name: 'Tidak berpengaruh'
          }
        ],
        votes: 30
      }
    ];
  }

  id: number;
  ngOnInit() {
    // get id detail polling
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
    });

    this.getDetailPolling();
  }

  async getDetailPolling() {
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.pollingService.getDetailPolling(this.id).subscribe(
      res => {
        this.dataPolling = res['data'];
        console.log(this.dataPolling);
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

  submitPolling() {
    const message =
      'Terima kasih atas partisipasi anda dalam pengisian polling ini';
    this.showToast(message);
    this.navCtrl.back();
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
