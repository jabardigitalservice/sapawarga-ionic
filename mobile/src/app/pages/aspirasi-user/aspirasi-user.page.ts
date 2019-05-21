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

  ngOnInit() {
    setTimeout(() => {
      this.dataAspirasi = [];
      this.getListAspirasi();
    }, 2000);
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
      this.dataAspirasi = JSON.parse(this.aspirasiService.getLocalAspirasi());
      return;
    }

    this.dataEmpty = false;

    this.aspirasiService.getListAspirasi(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataAspirasi = this.dataAspirasi.concat(res['data']['items']);
          console.log(this.dataAspirasi);
          // save to local
          // this.aspirasiService.saveLocalAspirasi(this.dataAspirasi);
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
}
