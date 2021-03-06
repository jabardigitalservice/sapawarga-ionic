import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NavController,
  MenuController,
  LoadingController,
  Platform,
  ModalController
} from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Dictionary } from '../../helpers/dictionary';

import { Constants } from '../../helpers/constants';
// plugin
import { AppVersion } from '@ionic-native/app-version/ngx';
import {
  Downloader,
  DownloadRequest,
  NotificationVisibility
} from '@ionic-native/downloader/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ProfileService } from '../../services/profile.service';
import { UtilitiesService } from '../../services/utilities.service';
import { ForceChangePasswordComponent } from '../../shared/force-change-password/force-change-password.component';
import { ForceUpdateService } from '../../services/force-update.service';
import { ForceChangeProfileComponent } from 'src/app/shared/force-change-profile/force-change-profile.component';
import { ForgotPasswordComponent } from '../../shared/forgot-password/forgot-password.component';
import { InformationPopupService } from '../../services/information-popup.service';
import { DidNotRegisterComponent } from 'src/app/shared/did-not-register/did-not-register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;
  submitted = false;

  // show password
  type = 'password';
  passwordShown = false;
  token_fcm: string;
  hakCipta = Dictionary.hak_cipta;

  isKeyboardOpen: boolean;

  public app_version = null;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public router: Router,
    private network: Network,
    private fcm: FCM,
    private platform: Platform,
    public appVersion: AppVersion,
    private downloader: Downloader,
    private constants: Constants,
    private inAppBrowser: InAppBrowser,
    private profileService: ProfileService,
    private util: UtilitiesService,
    private modalController: ModalController,
    private forceUpdateService: ForceUpdateService,
    private informationPopupService: InformationPopupService
  ) {
    this.appVersion
      .getVersionNumber()
      .then(res => {
        this.app_version = res;
      })
      .catch(err => {});

    // listen keyboard
    window.addEventListener('keyboardDidShow', () => {
      console.log('Keyboard is Shown');
      this.isKeyboardOpen = true;
    });
    window.addEventListener('keyboardDidHide', () => {
      console.log('Keyboard is Hidden');
      this.isKeyboardOpen = false;
    });
  }

  public showPassword() {
    this.passwordShown = !this.passwordShown;

    if (this.passwordShown) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: [''],
      push_token: ['']
    });

    // get FCM token
    this.fcm.getToken().then(token => {
      this.f.push_token.setValue(token);
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.onLoginForm.controls;
  }

  async presentAlert(param: string, message?: string) {
    let header = '';
    let buttons = null;
    let msg = '';

    if (param === 'error') {
      header = '';
      msg = message;
      buttons = ['OK'];
    }

    this.util.alertConfirmation(msg, buttons, header);
  }

  async login() {
    this.submitted = true;
    // check form if invalid
    if (this.onLoginForm.invalid) {
      return;
    }

    // check internet
    if (!navigator.onLine) {
      this.util.showToast(Dictionary.offline);
      return;
    }

    const disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      alert(Dictionary.disconnected);
    });

    // stop disconnect watch
    disconnectSubscription.unsubscribe();

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.auth.login(this.onLoginForm.value).subscribe(
      res => {
        if (res.success === true) {
          loader.dismiss();
          this.auth.saveToken(res.data.access_token);
          this.getDataProfile();
        } else {
          loader.dismiss();
          this.presentAlert('error', Dictionary.confirmation_login);
        }
      },
      err => {
        loader.dismiss();
        if (err.status === 422) {
          if (err.data.password) {
            this.presentAlert('error', err.data.password[0]);
          } else if (err.data.status) {
            this.presentAlert('error', err.data.status[0]);
          }
        } else {
          this.presentAlert('error', Dictionary.terjadi_kesalahan);
        }
      }
    );

    this.submitted = false;
    this.onLoginForm.reset();
  }

  downloadPdf() {
    // check internet
    if (!navigator.onLine) {
      this.util.showToast(Dictionary.offline);
      return;
    }

    // check if the platform is ios or android, else open the web url
    this.platform.ready().then(() => {
      const request: DownloadRequest = {
        uri: this.constants.URL.userGuide,
        title: 'User Manual Sapawarga',
        description: '',
        mimeType: '',
        visibleInDownloadsUi: true,
        notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
        destinationInExternalPublicDir: {
          dirType: 'Download',
          subPath: 'user_manual_sapawarga.pdf'
        }
      };

      this.downloader
        .download(request)
        .then((_: string) => this.util.showToast(Dictionary.success_download))
        .catch((_: any) => this.util.showToast(Dictionary.unsuccess_download));
    });
  }

  // open browser in app
  launchweb(name: string) {
    // check internet
    if (!navigator.onLine) {
      this.util.showToast(Dictionary.offline);
      return;
    }

    // check if the platform is ios or android, else open the web url
    this.platform.ready().then(() => {
      const target = '_self';
      this.inAppBrowser.create(
        name === 'tos'
          ? this.constants.URL.termOfService
          : this.constants.URL.privacyPolicy,
        target,
        this.constants.inAppBrowserOptions
      );
    });
  }

  async getDataProfile() {
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();
    this.profileService.getProfile().subscribe(
      res => {
        // save to local storage
        this.profileService.saveProfile(res['data']);
        loader.dismiss();

        // check password is update
        if (
          res['data'].password_updated_at !== null &&
          res['data'].profile_updated_at !== null
        ) {
          this.navCtrl.navigateRoot(['/tabs']['home']);

          // check information popup
          this.informationPopupService.checkInformationPopup();
        } else {
          // check which should be update
          let isForceUpdate;
          if (res['data'].password_updated_at) {
            isForceUpdate = 1;
          } else if (res['data'].profile_updated_at) {
            isForceUpdate = 2;
          }
          // insert all datas force update to false
          this.forceUpdateService.setDataForceChange(isForceUpdate);

          const dataCheckUpdate = this.forceUpdateService.checkForceUpdate();
          if (dataCheckUpdate === 1) {
            this.showModalUpdate(1);
          } else if (dataCheckUpdate === 2) {
            this.showModalUpdate(2);
          }
        }
      },
      err => {
        loader.dismiss();
      }
    );
  }

  async showModalUpdate(data: number) {
    const modal = await this.modalController.create({
      component:
        data === 1 ? ForceChangePasswordComponent : ForceChangeProfileComponent,
      keyboardClose: false
    });
    return await modal.present();
  }

  async showForgotPassword() {
    const modal = await this.modalController.create({
      component: ForgotPasswordComponent
    });
    return await modal.present();
  }

  async didNotRegister() {
    const modal = await this.modalController.create({
      component: DidNotRegisterComponent,
      componentProps: {
        message: Dictionary.not_register
      },
      cssClass: 'popup-not-register',
      backdropDismiss: false
    });
    return await modal.present();
  }
}
