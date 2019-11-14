import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  NavController,
  NavParams,
  PopoverController,
  ModalController
} from '@ionic/angular';
import { Router } from '@angular/router';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ForceChangePasswordComponent } from 'src/app/shared/force-change-password/force-change-password.component';

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
    private util: UtilitiesService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  async logout() {
    this.popover.dismiss();
    this.navCtrl.navigateRoot('/login');
    // call service logout to clear local storage
    this.authService.logout().subscribe(() => {}, () => {});
  }

  editProfile() {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    this.router.navigate(['edit-profile'], {
      queryParams: this.navParams.get('dataUser')
    });
    this.popover.dismiss();
  }

  async changePassword() {
    this.popover.dismiss();
    const modal = await this.modalController.create({
      component: ForceChangePasswordComponent,
      componentProps: {
        profilePassword: true
      }
    });
    return await modal.present();
  }

  async confirmLogout() {
    const buttons = [
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
    ];

    this.util.alertConfirmation(Dictionary.logout, buttons);
  }
}
