import { Component, OnInit } from '@angular/core';
import { AspirasiService } from 'src/app/services/aspirasi.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Aspirasi } from '../../interfaces/aspirasi';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

@Component({
  selector: 'app-my-aspirasi',
  templateUrl: './my-aspirasi.component.html',
  styleUrls: ['./my-aspirasi.component.scss']
})
export class MyAspirasiComponent implements OnInit {
  dataAspirasi: Aspirasi[];
  dataEmpty = false;
  currentPage = 1;
  maximumPages: number;

  msgResponse = {
    type: '',
    msg: ''
  };

  isLoading = false;

  constructor(
    private aspirasiService: AspirasiService,
    public loadingCtrl: LoadingController,
    private router: Router,
    private util: UtilitiesService,
    private constants: Constants
  ) {
    this.dataAspirasi = [];
  }

  ngOnInit() {
    // google analytics
    this.util.trackEvent(
      this.constants.pageName.usulan,
      'view_list_my_usulan',
      '',
      1
    );

    this.getListAspirasi();
  }

  ionViewDidEnter() {
    this.msgResponse = {
      type: '',
      msg: ''
    };
    this.getListAspirasi();
  }

  ionViewWillLeave() {
    this.msgResponse = {
      type: '',
      msg: ''
    };
    this.dataAspirasi = [];
    this.dataEmpty = false;
    this.currentPage = 1;
    this.maximumPages = null;
  }

  // get data broadcasts
  getListAspirasi(infiniteScroll?: any) {
    // check internet
    if (!navigator.onLine) {
      // stop infinite scroll
      if (infiniteScroll) {
        infiniteScroll.target.complete();
      }
      // get local
      this.getLocalMyAspirasi();
      return;
    }

    this.dataEmpty = false;

    if (!infiniteScroll) {
      this.isLoading = true;
    }

    this.getDataMyAspirasi(infiniteScroll);
  }

  private getDataMyAspirasi(infiniteScroll: any) {
    this.aspirasiService.getMyListAspirasi(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataAspirasi = this.dataAspirasi.concat(res['data']['items']);
          // save to local
          this.aspirasiService.saveLocalAspirasiUser(this.dataAspirasi);
        } else {
          this.dataEmpty = true;
          this.messageResponse('empty', Dictionary.empty_aspirasi);
        }
        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
        this.isLoading = false;
      },
      err => {
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
        if (err.name === 'TimeoutError') {
          this.msgResponse = {
            type: 'offline',
            msg: Dictionary.offline
          };
        } else {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
        this.isLoading = false;
      }
    );
  }

  private messageResponse(type: string, message: string) {
    this.msgResponse = {
      type: type,
      msg: message
    };
  }

  private getLocalMyAspirasi() {
    if (this.aspirasiService.getLocalAspirasiUser()) {
      this.dataAspirasi = JSON.parse(
        this.aspirasiService.getLocalAspirasiUser()
      );
    } else {
      this.messageResponse('offline', Dictionary.offline);
    }
  }

  // go to detail with param id
  goDetail(id: number) {
    this.router.navigate(['/aspirasi', id], {
      queryParams: {
        myaspirasi: true
      }
    });
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
}
