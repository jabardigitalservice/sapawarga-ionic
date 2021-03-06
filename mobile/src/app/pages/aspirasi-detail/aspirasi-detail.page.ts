import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverController, NavController } from '@ionic/angular';
import { AspirasiService } from '../../services/aspirasi.service';
import { Aspirasi } from '../../interfaces/aspirasi';
import { MenuNavbarAspirasiComponent } from '../../components/menu-navbar-aspirasi/menu-navbar-aspirasi.component';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

@Component({
  selector: 'app-aspirasi-detail',
  templateUrl: './aspirasi-detail.page.html',
  styleUrls: ['./aspirasi-detail.page.scss']
})
export class AspirasiDetailPage implements OnInit {
  id: number;
  idUser: number;
  dataAspirasi: Aspirasi;
  dataLike: {
    id: number;
    liked: boolean;
    likes_count: number;
  };

  myAspirasi = false;
  offline = false;
  isPushNotification = false;

  constructor(
    private route: ActivatedRoute,
    private aspirasiService: AspirasiService,
    public popoverCtrl: PopoverController,
    private navCtrl: NavController,
    private util: UtilitiesService,
    public constants: Constants
  ) {}

  ngOnInit() {
    // get iduser
    this.idUser = JSON.parse(localStorage.getItem('PROFILE')).id;

    this.route.params.subscribe(params => {
      this.id = parseInt(params['id'], 10);
    });

    // get data queryParam
    this.route.queryParamMap.subscribe(params => {
      this.myAspirasi = params['params']['myaspirasi'] ? true : false;

      this.isPushNotification = params['params']['isPushNotification'];
    });
  }

  backButton() {
    this.util.backButton(this.isPushNotification);
  }

  ionViewDidEnter() {
    this.getDetailAspirasi();
  }

  // get data nomor penting
  getDetailAspirasi() {
    this.offline = false;

    // check internet
    if (!navigator.onLine) {
      // stop infinite scroll
      this.offline = true;
      // get local data like
      this.dataLike = JSON.parse(this.aspirasiService.getLocalLikes()).filter(
        x => x.id === this.id
      );

      this.getDataLocal();
      return;
    }

    this.aspirasiService.getDetailAspirasi(this.id).subscribe(
      res => {
        this.dataAspirasi = res['data'];
        this.dataLike = this.initState(this.dataAspirasi);

        // save likes to local
        this.saveLocalLike(JSON.parse(this.aspirasiService.getLocalLikes()));

        // google analytics event
        this.util.trackEvent(
          this.constants.pageName.usulan,
          'view_detail_usulan',
          this.dataAspirasi.title,
          1
        );
      },
      err => {
        this.util.showToast(err.data.message);
        // jika data not found
        this.navCtrl.back();
      }
    );
  }

  getDataLocal() {
    // get data local aspirasi
    const dataLocal = JSON.parse(this.aspirasiService.getLocalAspirasi());

    this.dataAspirasi = dataLocal.find(x => x.id === this.id);

    if (!this.dataAspirasi) {
      const dataLocalUser = JSON.parse(
        this.aspirasiService.getLocalAspirasiUser()
      );
      this.dataAspirasi = dataLocalUser.find(x => x.id === this.id);
    }

    // initial data like
    this.dataLike = this.initState(this.dataAspirasi);
  }

  initState(data: any) {
    const dataLike = {
      id: this.id,
      liked: data.likes_users.filter(x => x.id === this.idUser).length > 0,
      likes_count: data.likes_count
    };
    return dataLike;
  }

  doLike() {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    if (this.checkStateLike()) {
      // set unlike
      this.dataLike.liked = false;
      // set total like
      this.dataLike.likes_count--;

      // google analytics
      this.util.trackEvent(
        this.constants.pageName.usulan,
        'unlike_usulan',
        this.dataAspirasi['title'],
        1
      );
    } else {
      // set like
      this.dataLike.liked = true;
      // set total like + 1
      this.dataLike.likes_count++;

      // google analytics
      this.util.trackEvent(
        this.constants.pageName.usulan,
        'like_usulan',
        this.dataAspirasi['title'],
        1
      );
    }

    // save like to server
    this.aspirasiService.likeAspirasi(this.id).subscribe(res => {}, err => {});

    // save likes to local
    this.saveLocalLike(JSON.parse(this.aspirasiService.getLocalLikes()));
  }

  // check if data like/non
  checkStateLike() {
    return this.dataLike.liked;
  }

  // check total likes
  checkCountLike() {
    return this.dataLike.likes_count;
  }

  saveLocalLike(localLikes) {
    const newLocalLikes = localLikes;
    const idx = newLocalLikes.findIndex(x => x.id === this.id);
    newLocalLikes[idx] = this.dataLike;
    this.aspirasiService.saveLocalLikes(newLocalLikes);
  }

  isMyAspirasi() {
    if (this.dataAspirasi) {
      return this.dataAspirasi.author_id === this.idUser;
    }
    return false;
  }

  isEditable() {
    if (this.isMyAspirasi()) {
      return (
        this.dataAspirasi.status !== 10 && this.dataAspirasi.status !== 5 // Dipublikasikan
      ); // Menunggu Persetujuan
    }
    return false;
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

  async navbarMore(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MenuNavbarAspirasiComponent,
      componentProps: {
        dataAspirasi: this.dataAspirasi
      },
      event: ev,
      cssClass: 'popover_class',
      animated: true,
      showBackdrop: true,
      translucent: true
    });

    popover.onDidDismiss();

    return await popover.present();
  }

  checkPublish() {
    let status: boolean;
    switch (this.dataAspirasi.status) {
      case 10:
        status = true;
        break;
      default:
        status = false;
        break;
    }

    return status;
  }
}
