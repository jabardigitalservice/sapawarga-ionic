import { Component, OnInit } from '@angular/core';
import { AspirasiService } from 'src/app/services/aspirasi.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Aspirasi } from '../../interfaces/aspirasi';

@Component({
  selector: 'app-aspirasi-user',
  templateUrl: './aspirasi-user.page.html',
  styleUrls: ['./aspirasi-user.page.scss']
})
export class AspirasiUserPage implements OnInit {
  dataAspirasi: Aspirasi[];
  dataEmpty = false;
  currentPage = 1;
  maximumPages: number;

  constructor(
    private aspirasiService: AspirasiService,
    public loadingCtrl: LoadingController,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.dataAspirasi = [];
    this.getListAspirasi();
  }

  // get data broadcasts
  async getListAspirasi(infiniteScroll?: any) {
    // check internet
    if (!navigator.onLine) {
      // stop infinite scroll
      if (infiniteScroll) {
        alert('Tidak ada jaringan internet');
        infiniteScroll.target.complete();
      }
      // get local
      this.dataAspirasi = JSON.parse(
        this.aspirasiService.getLocalAspirasiUser()
      );
      return;
    }

    this.dataEmpty = false;

    this.aspirasiService.getMyListAspirasi(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataAspirasi = this.dataAspirasi.concat(res['data']['items']);
          // save to local
          this.aspirasiService.saveLocalAspirasiUser(this.dataAspirasi);
        } else {
          this.dataEmpty = true;
        }
        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;

        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
      },
      err => {
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
      }
    );
  }

  // go to detail with param id
  goDetail(id: number) {
    this.router.navigate(['/aspirasi', id]);
  }

  checkStatus(status: number) {
    switch (status) {
      case 5:
        return 'primary';
        break;
      case 10:
        return 'success';
        break;
      case 3:
        return 'danger';
        break;
      case 0:
        return 'warning';
        break;
      case -1:
        return 'danger';
      default:
        break;
    }
  }

  AddAspirasi() {
    // check internet
    if (!navigator.onLine) {
      this.showToast('Tidak ada koneksi internet');
      return;
    }
    this.router.navigate(['/aspirasi-form']);
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
