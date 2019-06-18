import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Polling } from '../../interfaces/polling';
import { PollingService } from '../../services/polling.service';
import { LoadingController, ToastController } from '@ionic/angular';

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

  constructor(
    private pollingService: PollingService,
    public loadingCtrl: LoadingController,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    // this.items = [
    //   {
    //     id: 1,
    //     title:
    //       'Seberapa puaskah anda terhadap pelayanan yang ada dari Pemerintah Provinsi Jawa Barat?',
    //     pollings: [
    //       {
    //         id: 1,
    //         name: 'Puas'
    //       },
    //       {
    //         id: 2,
    //         name: 'Biasa saja'
    //       },
    //       {
    //         id: 3,
    //         name: 'Kurang puas'
    //       }
    //     ],
    //     votes: 30
    //   },
    //   {
    //     id: 2,
    //     title:
    //       'Menurut anda apakah peran Pemerintah Daerah Provinsi Jawa Barat sudah cukup baik dalam mengelola harga bahan pokok?',
    //     pollings: [
    //       {
    //         id: 1,
    //         name: 'Baik'
    //       },
    //       {
    //         id: 2,
    //         name: 'Cukup'
    //       },
    //       {
    //         id: 3,
    //         name: 'Kurang'
    //       }
    //     ],
    //     votes: 30
    //   },
    //   {
    //     id: 3,
    //     title:
    //       'Menurut anda apakah implementasi teknologi pada layanan Pemerintah Provinsi Jawa Barat dapat memberikan pengaruh yang baik dalam peningkatan layanan pemerintahan terhadap masyarakat?',
    //     pollings: [
    //       {
    //         id: 1,
    //         name: 'Ya, sangat berpengaruh'
    //       },
    //       {
    //         id: 2,
    //         name: 'Tidak berpengaruh'
    //       }
    //     ],
    //     votes: 30
    //   }
    // ];
  }

  ngOnInit() {
    this.getListPolling();
  }

  async getListPolling(infiniteScroll?) {
    // check internet
    if (!navigator.onLine) {
      // get local
      // this.dataBroadcast = JSON.parse(
      //   this.broadcastService.getLocalBroadcast()
      // );
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });

    if (!infiniteScroll) {
      loader.present();
    }
    loader.present();

    // this.dataEmpty = false;

    this.pollingService.getListPolling(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataPolling = res['data']['items'];
          console.log(this.dataPolling);
          // save to local
          // this.broadcastService.saveLocalBroadcast(this.dataBroadcast);
        } else {
          // this.dataEmpty = true;
        }
        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;
        loader.dismiss();
      },
      err => {
        loader.dismiss();
      }
    );
  }

  goDetail(data: number) {
    this.router.navigate(['/polling', data]);
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
