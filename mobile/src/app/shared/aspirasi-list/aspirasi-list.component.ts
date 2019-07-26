import { Component, OnInit } from '@angular/core';
import { AspirasiService } from '../../services/aspirasi.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Aspirasi } from '../../interfaces/aspirasi';
import { Dictionary } from '../../helpers/dictionary';

@Component({
  selector: 'app-aspirasi-list',
  templateUrl: './aspirasi-list.component.html',
  styleUrls: ['./aspirasi-list.component.scss']
})
export class AspirasiListComponent implements OnInit {
  idUser: number;
  dataAspirasi: Aspirasi[];
  dataEmpty = false;
  currentPage = 1;
  maximumPages: number;
  dataLikes = [];

  offline = false;

  defaut_img = 'assets/img/placeholder_image.png';

  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    private aspirasiService: AspirasiService,
    public loadingCtrl: LoadingController,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.dataAspirasi = [];
    this.idUser = JSON.parse(localStorage.getItem('PROFILE')).id;
    this.getListAspirasi();
  }

  // get data broadcasts
  async getListAspirasi(infiniteScroll?: any) {
    this.offline = false;
    // check internet
    if (!navigator.onLine) {
      // stop infinite scroll
      this.offline = true;

      if (infiniteScroll) {
        infiniteScroll.target.complete();
      }

      // get local
      if (
        this.aspirasiService.getLocalAspirasi() &&
        this.aspirasiService.getLocalLikes()
      ) {
        this.dataAspirasi = JSON.parse(this.aspirasiService.getLocalAspirasi());
        this.dataLikes = JSON.parse(this.aspirasiService.getLocalLikes());
      } else {
        this.msgResponse = {
          type: 'offline',
          msg: Dictionary.offline
        };
      }

      return;
    }

    this.dataEmpty = false;

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });

    if (!infiniteScroll) {
      loader.present();
    }

    this.aspirasiService.getListAspirasi(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataAspirasi = this.dataAspirasi.concat(res['data']['items']);

          this.dataLikes = this.initState(this.dataAspirasi);

          // save data aspirasi to local
          this.aspirasiService.saveLocalAspirasi(this.dataAspirasi);

          // save likes to local
          this.aspirasiService.saveLocalLikes(this.dataLikes);
        } else {
          this.dataEmpty = true;
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty
          };
        }
        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;

        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
        loader.dismiss();
      },
      err => {
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
        if (err) {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
      }
    );
  }

  initState(data: any) {
    const datas = [];
    for (const index in data) {
      if (data.length) {
        const data_like = {
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
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

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

    // save like to server
    this.aspirasiService.likeAspirasi(id).subscribe(res => {}, err => {});

    // save likes to local
    this.aspirasiService.saveLocalLikes(this.dataLikes);
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
