import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  NavParams,
  PopoverController,
  ToastController
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AspirasiService } from '../../services/aspirasi.service';
import { Dictionary } from '../../helpers/dictionary';

@Component({
  selector: 'app-menu-navbar-aspirasi',
  templateUrl: './menu-navbar-aspirasi.component.html',
  styleUrls: ['./menu-navbar-aspirasi.component.scss']
})
export class MenuNavbarAspirasiComponent implements OnInit {
  constructor(
    private navParams: NavParams,
    private router: Router,
    private popover: PopoverController,
    private aspirasiService: AspirasiService,
    private toastCtrl: ToastController,
    public alertController: AlertController
  ) {}

  ngOnInit() {}

  editAspirasi() {
    // check internet
    if (!navigator.onLine) {
      this.showToast(Dictionary.offline);
      return;
    }

    this.router.navigate(['aspirasi-form'], {
      queryParams: {
        data: JSON.stringify(this.navParams.get('dataAspirasi'))
      }
    });
    this.popover.dismiss();
  }

  deleteAspirasi() {
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    const id = this.navParams.get('dataAspirasi').id;
    this.aspirasiService.deleteAspirasi(id).subscribe(
      res => {
        this.showToast(Dictionary.aspirasi_success_delete);

        this.router.navigate(['aspirasi-user']);
        this.popover.dismiss();
      },
      err => {
        this.showToast(Dictionary.aspirasi_failed);
        this.popover.dismiss();
      }
    );
  }

  async confirmDeleteAspirasi() {
    const alert = await this.alertController.create({
      message: Dictionary.aspirasi_confirm,
      buttons: [
        {
          text: 'Batalkan',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.popover.dismiss();
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.deleteAspirasi();
          }
        }
      ]
    });
    await alert.present();
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
