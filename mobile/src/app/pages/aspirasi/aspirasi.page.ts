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

  defaut_img = 'assets/img/placeholder_image.png';

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
      this.dataLikes = this.dataAspirasi;
      return;
    }

    this.dataEmpty = false;

    this.aspirasiService.getListAspirasi(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataAspirasi = this.dataAspirasi.concat(res['data']['items']);

          this.dataLikes = this.initState(this.dataAspirasi);

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

  initState(data: any) {
    let datas = [];
    for (let index in data) {
      if (data.length) {
        let data_like = {
          id: data[index].id,
          liked:
            data[index].likes_users.filter(x => x.id === this.idUser).length >
            0,
          likes_count: data[index].likes_count
        };
        datas.push(data_like);
      }
    }
    return datas;
  }
  // go to my aspirasi
  goMyAspirasi() {
    this.router.navigate(['/aspirasi-user']);
  }

  // go to my aspirasi
  goMyAspirasi() {
    this.router.navigate(['/aspirasi-user']);
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

  doLike(id: number, checkLike: boolean, totalLike: number) {
    if (checkLike) {
      // set unlike
      this.dataLikes.find(x => x.id === id).liked = false;
      // set total like
      this.dataLikes.find(x => x.id === id).likes_count--;
    } else {
      // set like
      this.dataLikes.find(x => x.id === id).liked = true;
      // set total like + 1
      this.dataLikes.find(x => x.id === id).likes_count++;
    }

    this.aspirasiService.likeAspirasi(id).subscribe(res => {}, err => {});
  }

  // check if data like/non
  checkStateLike(id: number) {
    return this.dataLikes.filter(x => x.id === id && x.liked).length > 0;
  }

  // check total likes
  checkCountLike(id: number) {
    return this.dataLikes.find(x => x.id === id).likes_count;
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
