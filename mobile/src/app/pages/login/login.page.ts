import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NavController,
  MenuController,
  ToastController,
  AlertController,
  LoadingController
} from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Network } from '@ionic-native/network/ngx';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;
  submitted = false;

  // show password
  type: string = 'password';
  passwordShown: boolean = false;
  token_fcm: string;
  // public onlineOffline: boolean = navigator.onLine;

  public app_version = environment.VERSION_APP;
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
    private fcm: FCM
  ) {}

  public showPassword() {
    this.passwordShown = !this.passwordShown;

    if (this.passwordShown) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
  // end of show password

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fcm_token: ['']
    });

    // get FCM token
    this.fcm.getToken().then(token => {
      this.f.fcm_token.setValue(token);
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.onLoginForm.controls;
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Lupa Kata Sandi?',
      message: 'Tuliskan email anda untuk mengatur ulang kata sandi',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'batal',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Konfirmasi',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Email was sended successfully.',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
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
      this.showToast('Offline', 'Tidak ada koneksi internet');
      return;
    }

    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      alert('network was disconnected :-(');
    });

    // stop disconnect watch
    disconnectSubscription.unsubscribe();

    await this.auth.login(this.onLoginForm.value).subscribe(
      res => {
        if (res.success === true) {
          this.auth.saveToken(res.data.access_token);
          this.navCtrl.navigateRoot(['/tabs']['home']);
        } else {
          this.showToast('Login', 'Pastikan input data terisi dengan benar');
        }
      },
      err => {
        // loader.dismiss();
        console.log(err);
        this.showToast('Login', err.data.password[0]);
      }
    );
  }

  async showToast(title: string, msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
