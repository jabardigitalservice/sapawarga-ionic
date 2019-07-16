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

// plugin
import { AppVersion } from '@ionic-native/app-version/ngx';
import {
  Downloader,
  DownloadRequest,
  NotificationVisibility
} from '@ionic-native/downloader/ngx';

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
    private downloader: Downloader
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
          this.navCtrl.navigateRoot(['/tabs']['home']);
        } else {
          loader.dismiss();
          this.showToast('Login', Dictionary.confirmation_login);
        }
      },
      err => {
        loader.dismiss();
        this.showToast('Login', err.data.password[0]);
      }
    );
  }

  downloadPdf() {
    const downloadUrl =
      'https://drive.google.com/uc?export=download&id=1T8Dq8L28LmivAppMaSPbIvznyzqihgbF';
    // const downloadUrl = 'https://www.axmag.com/download/pdfurl-guide.pdf';

    const request: DownloadRequest = {
      uri: downloadUrl,
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
      .then((location: string) => console.log('File downloaded at:' + location))
      .catch((error: any) => console.error(error));
  }

  async showToast(title: string, msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
