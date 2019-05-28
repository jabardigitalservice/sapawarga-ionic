import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  NavController,
  NavParams,
  PopoverController,
  AlertController
} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-navbar',
  templateUrl: './menu-navbar.component.html',
  styleUrls: ['./menu-navbar.component.scss']
})
export class MenuNavbarComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
    private navParams: NavParams,
    private router: Router,
    private popover: PopoverController,
    public alertController: AlertController
  ) {}

  ngOnInit() {}

  logout() {
    // call service logout to clear local storage
    this.authService.logout();
    this.navCtrl.navigateRoot('/login');
    this.popover.dismiss();
  }

  editProfile() {
    this.router.navigate(['edit-profile'], {
      queryParams: this.navParams.get('dataUser')
    });
    this.popover.dismiss();
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      message: 'Apakah Anda yakin ingin keluar dari aplikasi Sapawarga?',
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
            this.logout();
          }
        }
      ]
    });
    await alert.present();
  }
}
