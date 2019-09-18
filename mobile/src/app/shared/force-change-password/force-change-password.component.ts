import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  ModalController,
  LoadingController,
  NavController,
  NavParams
} from '@ionic/angular';
import { ForceUpdateService } from '../../services/force-update.service';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { ProfileService } from '../../services/profile.service';
import { ForceChangeProfileComponent } from '../force-change-profile/force-change-profile.component';

@Component({
  selector: 'app-force-change-password',
  templateUrl: './force-change-password.component.html',
  styleUrls: ['./force-change-password.component.scss']
})
export class ForceChangePasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;

  profilePassword: boolean;

  passwordShow = [
    {
      show: false,
      type: 'password'
    },
    {
      show: false,
      type: 'password'
    },
    {
      show: false,
      type: 'password'
    }
  ];
  submitted = false;

  validations = {
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', [Validators.required, Validators.minLength(6)]]
  };

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private forceUpdateService: ForceUpdateService,
    private util: UtilitiesService,
    private profileService: ProfileService,
    public navCtrl: NavController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.profilePassword = this.navParams.get('profilePassword') || false;
    if (this.profilePassword) {
      this.validations['password_old'] = [
        '',
        [Validators.required, Validators.minLength(6)]
      ];
    }

    this.changePasswordForm = this.formBuilder.group(this.validations, {
      validator: this.MatchPassword
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.changePasswordForm.controls;
  }

  private MatchPassword(form: FormGroup) {
    const newPassword = form.get('password').value; // to get value in input tag
    const confirmPassword = form.get('password_confirmation').value; // to get value in input tag
    if (newPassword !== confirmPassword) {
      form.get('password_confirmation').setErrors({ MatchPassword: true });
    } else {
      form.get('password_confirmation').setErrors(null);
    }
  }

  dismiss() {
    // dismiss modal
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  public showPassword(index: number) {
    this.passwordShow[index].show = !this.passwordShow[index].show;

    if (this.passwordShow[index].show) {
      this.passwordShow[index].type = 'text';
    } else {
      this.passwordShow[index].type = 'password';
    }
  }

  async changePassword() {
    this.submitted = true;
    // check form if invalid
    if (this.changePasswordForm.invalid) {
      return;
    }

    // check internet
    if (!navigator.onLine) {
      this.util.showToast(Dictionary.offline);
      return;
    }
    const buttons = ['OK'];
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.profileService.changePassword(this.changePasswordForm.value).subscribe(
      res => {
        if (res.success === true) {
          loader.dismiss();
          if (this.profilePassword) {
            this.util.alertConfirmation(Dictionary.msg_change_password, ['OK']);
            this.dismiss();
          } else {
            this.forceUpdateService.setDataForceChange(1);
            localStorage.removeItem('auth-token');
            this.navCtrl.navigateRoot(['/login']);
            this.dismiss();
          }
        } else {
          loader.dismiss();
          this.util.alertConfirmation(Dictionary.terjadi_kesalahan, buttons);
        }
      },
      err => {
        loader.dismiss();
        if (err.status === 422) {
          if (err.data.password) {
            this.util.alertConfirmation(err.data.password[0], buttons);
          }
        } else {
          this.util.alertConfirmation(Dictionary.terjadi_kesalahan, buttons);
        }
      }
    );

    this.submitted = false;
    this.changePasswordForm.reset();

    if (this.profilePassword === false) {
      this.navCtrl.navigateRoot('/login');
    }
  }

  async showEditProfile() {
    const modal = await this.modalController.create({
      component: ForceChangeProfileComponent
    });
    return await modal.present();
  }
}
