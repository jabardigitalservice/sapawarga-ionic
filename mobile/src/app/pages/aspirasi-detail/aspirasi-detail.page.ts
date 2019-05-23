import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  LoadingController,
  ToastController,
  NavController
} from '@ionic/angular';
import { AspirasiService } from '../../services/aspirasi.service';
import { Aspirasi } from '../../interfaces/aspirasi';

@Component({
  selector: 'app-aspirasi-detail',
  templateUrl: './aspirasi-detail.page.html',
  styleUrls: ['./aspirasi-detail.page.scss'],
})
export class AspirasiDetailPage implements OnInit {
  id: number;
  idUser: number;
  dataAspirasi: Aspirasi;
  dataLike: {
    liked: boolean,
    likes_count: number
  };
  constructor(
      private route: ActivatedRoute,
      private aspirasiService: AspirasiService,
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
      private navCtrl: NavController,
      private router: Router
  ) { }

  ngOnInit() {
    this.idUser = JSON.parse(localStorage.getItem('PROFILE')).id;
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.getDetailAspirasi();
  }

  // get data nomor penting
  async getDetailAspirasi() {
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.aspirasiService.getDetailAspirasi(this.id).subscribe(
      res => {
        this.dataAspirasi = res['data'];
        this.dataLike = this.initState(this.dataAspirasi);
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

  initState(data: any) {
    let dataLike = {
      liked:
        data.likes_users.filter(x => x.id === this.idUser).length >
        0,
      likes_count: data.likes_count
    };
    return dataLike;
  }

  doLike() {
    // check internet
    if (!navigator.onLine) {
      alert('Tidak ada koneksi internet');
      return;
    }

    if (this.checkStateLike()) {
      // set unlike
      this.dataLike.liked = false;
      // set total like
      this.dataLike.likes_count--;
    } else {
      // set like
      this.dataLike.liked = true;
      // set total like + 1
      this.dataLike.likes_count++;
    }

    // save like to server
    this.aspirasiService.likeAspirasi(this.id).subscribe(res => {}, err => {});

    // save likes to local
    // this.aspirasiService.saveLocalLikes(this.dataLikes);
  }

  // check if data like/non
  checkStateLike() {
    return this.dataLike.liked;
  }

  // check total likes
  checkCountLike() {
    return this.dataLike.likes_count;
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
