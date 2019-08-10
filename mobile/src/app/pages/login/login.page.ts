import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NavController,
  MenuController,
  ToastController,
  AlertController,
  LoadingController,
  Platform
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

  public app_version = null;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
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
    private profileService: ProfileService
  ) {
    this.appVersion
      .getVersionNumber()
      .then(res => {
        this.app_version = res;
      })
      .catch(err => {});
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
      password: ['', [Validators.required, Validators.minLength(6)]],
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

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Lupa Kata Sandi?',
      message: Dictionary.forgot_password,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlert(param: string, message?: string) {
    let messageData = {
      header: '',
      message: '',
      buttons: null
    };

    if (param === 'forgot') {
      messageData = {
        header: 'Lupa Kata Sandi?',
        message: Dictionary.forgot_password,
        buttons: ['OK']
      };
    } else if (param === 'error') {
      messageData = {
        header: 'Error',
        message: message,
        buttons: ['OK']
      };
    }

    const alert = await this.alertCtrl.create(messageData);

    await alert.present();
  }

  async login() {
    this.submitted = true;
    // check form if invalid
    if (this.onLoginForm.invalid) {
      return;
    }

    // check internet
    if (!navigator.onLine) {
      this.showToast('Offline', Dictionary.offline);
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

    await this.auth.login(this.onLoginForm.value).subscribe(
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
        this.presentAlert('error', err.data.password[0]);
      }
    );

    this.submitted = false;
    this.onLoginForm.reset();
  }

  downloadPdf() {
    // check internet
    if (!navigator.onLine) {
      this.showToast('Offline', Dictionary.offline);
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
        .then((location: string) =>
          this.showToast('Unduh Panduan', Dictionary.success_download)
        )
        .catch((error: any) =>
          this.showToast('Unduh Panduan', Dictionary.unsuccess_download)
        );
    });
  }

  // open browser in app
  launchweb(name: string) {
    // check internet
    if (!navigator.onLine) {
      this.showToast('Offline', Dictionary.offline);
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

  async showToast(title: string, msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async getDataProfile() {
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();
    this.profileService.getProfile().subscribe(
      res => {
        // save to local storage
        localStorage.setItem('PROFILE', JSON.stringify(res['data']));
        loader.dismiss();
        this.navCtrl.navigateRoot(['/tabs']['home']);
      },
      err => {
        loader.dismiss();
      }
    );
  }
}
