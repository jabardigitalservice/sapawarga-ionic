import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AspirasiService } from '../../services/aspirasi.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Aspirasi } from '../../interfaces/aspirasi';

@Component({
  selector: 'app-aspirasi',
  templateUrl: './aspirasi.page.html',
  styleUrls: ['./aspirasi.page.scss']
})
export class AspirasiPage implements OnInit {
  idUser: number;
  dataAspirasi: Aspirasi[];
  dataEmpty = false;
  currentPage = 1;
  maximumPages: number;
  dataLikes = [];

  constructor(
    private aspirasiService: AspirasiService,
    public loadingCtrl: LoadingController,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.idUser = JSON.parse(localStorage.getItem('PROFILE')).id;
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

          // save to local
          this.aspirasiService.saveLocalAspirasi(this.dataAspirasi);
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

  // infinite scroll
  doInfinite(event: any) {
    if (this.currentPage === this.maximumPages) {
      event.target.disabled = true;
      return;
    }
    // increase page
    this.currentPage++;

    setTimeout(() => {
      this.getListAspirasi(event);
    }, 2000);
  }

  doLike(id: number, checkLike: boolean) {
    if (checkLike) {
      // check index from state dataLikes if data match remove dataLikes by index
      let index = this.dataLikes.findIndex(x => x.id === id);
      this.dataLikes.splice(index, 1);
    } else {
      // save data to state
      this.savestateLikes(id);
    }

    this.aspirasiService.likeAspirasi(id).subscribe(
      res => {
        console.log(res);
      },
      err => {}
    );
  }

  // check user he ever likes
  checklike(data_likes: any) {
    return data_likes.filter(x => x.id === this.idUser).length > 0;
  }

  // check if data like/non
  checkStateLike(id: number) {
    return this.dataLikes.filter(x => x.id === id).length > 0;
  }

  savestateLikes(id: number) {
    let like = {
      id: id,
      liked: true
    };
    this.dataLikes.push(like);
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
