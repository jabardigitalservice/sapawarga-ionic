import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  NavParams,
  PopoverController,
  ToastController
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AspirasiService } from '../../services/aspirasi.service';

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
      this.showToast('Tidak ada koneksi internet');
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
      alert('Tidak ada jaringan internet');
      return;
    }

    const id = this.navParams.get('dataAspirasi').id;
    this.aspirasiService.deleteAspirasi(id).subscribe(
      res => {
        this.showToast('Aspirasi berhasil dihapus');

        this.router.navigate(['aspirasi-user']);
        this.popover.dismiss();
      },
      err => {
        this.showToast(
          'Aspirasi gagal dihapus, periksa kembali koneksi internet Anda'
        );
        this.popover.dismiss();
      }
    );
  }

  async confirmDeleteAspirasi() {
    const alert = await this.alertController.create({
      message: 'Apakah Anda yakin ingin menghapus aspirasi ini?',
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
