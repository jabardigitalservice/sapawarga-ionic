import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  ActionSheetController,
  Platform,
  ToastController
} from '@ionic/angular';
import { NomorPentingService } from '../../services/nomor-penting.service';
import { NomorPenting } from '../../interfaces/nomor-penting';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { Router } from '@angular/router';
import { Dictionary } from '../../helpers/dictionary';

@Component({
  selector: 'app-nomor-penting',
  templateUrl: './nomor-penting.page.html',
  styleUrls: ['./nomor-penting.page.scss']
})
export class NomorPentingPage implements OnInit {
  currentPage = 1;
  maximumPages: number;
  dataNomorPenting: NomorPenting[];
  dataLokasiTerdekat: NomorPenting[];
  phone_numbers = [];
  kabkota_id: number;
  kecamatan_id: number;
  kelurahan_id: number;
  dataEmpty = false;

  openSearch = false;

  currentContent = 'telepon';

  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    private nomorPentingService: NomorPentingService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public actionSheetController: ActionSheetController,
    private platform: Platform,
    private callNumber: CallNumber,
    private sms: SMS,
    private router: Router
  ) {
    this.dataNomorPenting = [];
    // get data kabkota
    this.kabkota_id = JSON.parse(localStorage.getItem('PROFILE')).kabkota_id;
    this.kecamatan_id = JSON.parse(localStorage.getItem('PROFILE')).kec_id;
    this.kelurahan_id = JSON.parse(localStorage.getItem('PROFILE')).kel_id;
  }

  ngOnInit() {
    this.getNomorPenting();
  }

  // Called when view is left
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.currentContent = 'telepon';
  }

  // get data nomor penting
  async getNomorPenting(infiniteScroll?) {
    // check internet
    if (!navigator.onLine) {
      this.msgResponse = {
        type: 'offline',
        msg: Dictionary.offline
      };
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    if (!infiniteScroll) {
      loader.present();
    }

    this.dataEmpty = false;

    this.nomorPentingService.getNomorPenting(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataNomorPenting = this.dataNomorPenting.concat(
            res['data']['items']
          );
        } else {
          this.dataEmpty = true;
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty
          };
        }
        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;
        loader.dismiss();
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
      },
      err => {
        loader.dismiss();
        if (err) {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
      }
    );
  }

  // get data lokasi terdekat
  async getLocationsNearby() {
    // check internet
    if (!navigator.onLine) {
      this.msgResponse = {
        type: 'offline',
        msg: Dictionary.offline
      };
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.nomorPentingService
      .getNomorPentingByNearby(-6.902474, 107.618803)
      .subscribe(
        res => {
          if (res['data']['items'].length) {
            this.dataEmpty = false;
            this.dataLokasiTerdekat = res['data']['items'];
          } else {
            this.dataEmpty = true;
            this.msgResponse = {
              type: 'empty',
              msg: Dictionary.empty
            };
          }
          loader.dismiss();
        },
        err => {
          loader.dismiss();
          if (err) {
            this.msgResponse = {
              type: 'server-error',
              msg: Dictionary.internalError
            };
          }
        }
      );
  }

  // get data nomor penting
  async filterNomorPenting(type: string, id: number) {
    // check internet
    if (!navigator.onLine) {
      this.msgResponse = {
        type: 'offline',
        msg: Dictionary.empty
      };
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.dataEmpty = false;

    this.nomorPentingService.filterNomorPenting(type, id).subscribe(
      res => {
        this.dataNomorPenting = [];
        if (res['data']['items'].length) {
          this.dataNomorPenting = res['data']['items'];
        } else {
          this.dataEmpty = true;
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty
          };
        }
        loader.dismiss();
      },
      err => {
        loader.dismiss();
        if (err) {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
      }
    );
  }

  filterAreas(data) {
    /*
      split berdasarkan type.
      dataArea[0] = type area
      dataArea[1] = id area
    */
    let dataArea = data.split(' ');
    let typeArea = dataArea[0];
    let idArea = dataArea[1];

    this.filterNomorPenting(typeArea, idArea);
  }

  // open action sheet open phone number
  async openPhone(type: string, phone: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Nomor Telepon',
      buttons: this.createButtons(type, phone)
    });
    await actionSheet.present();
  }

  // create dynamic phone numbers
  createButtons(type: string, data: any) {
    let buttons = [];
    for (let index in data) {
      // selection get only type phone
      if (type === 'call' && data[index].type === 'phone') {
        let button = {
          text: data[index].phone_number,
          icon: 'call',
          handler: () => {
            this.phoneCall(data[index].phone_number);
          }
        };
        buttons.push(button);
      } else if (type === 'message' && data[index].type === 'message') {
        // selection get only type message
        let button = {
          text: data[index].phone_number,
          icon: 'mail',
          handler: () => {
            this.goToSMS(data[index].phone_number);
          }
        };
        buttons.push(button);
      }
    }
    return buttons;
  }

  // call number direct to native
  phoneCall(phone: string) {
    this.platform
      .ready()
      .then(() => {
        this.callNumber
          .callNumber(phone, true)
          .then()
          .catch(err => this.showToast(Dictionary.terjadi_kesalahan));
      })
      .catch(() => {
        this.showToast(Dictionary.error_permission);
      });
  }

  // direct to native SMS
  goToSMS(phone: string) {
    const options = {
      replaceLineBreaks: false,
      android: {
        intent: 'INTENT'
      }
    };
    this.platform
      .ready()
      .then(() => {
        // Send a text message using default options
        this.sms.send(phone, '', options);
      })
      .catch(() => {
        this.showToast(Dictionary.error_permission);
      });
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
      this.getNomorPenting(event);
    }, 2000);
  }

  openSearchbar(value: boolean) {
    this.openSearch = value;
    if (value === false) {
      this.getNomorPenting();
    }
  }

  CariAreas(event: string) {
    // check internet
    if (!navigator.onLine) {
      this.msgResponse = {
        type: 'offline',
        msg: Dictionary.offline
      };
      return;
    }

    // handle if data empty
    if (!event) {
      this.dataNomorPenting = [];
      this.getNomorPenting();
      return;
    }

    this.dataEmpty = false;

    // get data nomor penting
    this.nomorPentingService.CariNomorPenting(event).subscribe(
      res => {
        this.dataNomorPenting = [];
        if (res['data']['items'].length) {
          this.dataNomorPenting = res['data']['items'];
        } else {
          this.dataEmpty = true;
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty
          };
        }
      },
      err => {
        if (err) {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
      }
    );
  }

  goToDetail(id: number) {
    this.router.navigate(['/nomor-penting', id]);
  }

  goToNearby() {
    this.router.navigate(['list-map-nomor-penting']);
  }

  // check count phone
  checkcount(type: string, data: any) {
    if (type === 'phone') {
      return data.filter(x => x.type === 'phone').length > 0;
    } else if (type === 'message') {
      return data.filter(x => x.type === 'message').length > 0;
    }
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
