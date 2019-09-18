import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { Dictionary } from '../../helpers/dictionary';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup;
  submitted = false;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private util: UtilitiesService
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  dismiss() {
    // dismiss modal
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async submitForgotPassword() {
    this.submitted = true;
    // check form if invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.util.alertConfirmation(
      Dictionary.msg_forgot_password,
      ['OK'],
      'Selamat'
    );

    console.log(this.forgotPasswordForm.value);

    // check internet
    // if (!navigator.onLine) {
    //   this.util.showToast(Dictionary.offline);
    //   return;
    // }

    // const loader = await this.loadingCtrl.create({
    //   duration: 10000
    // });
    // loader.present();

    // console.log(this.changeProfileForm.value);

    // await this.auth.login(this.onLoginForm.value).subscribe(
    //   res => {
    //     if (res.success === true) {
    //       loader.dismiss();
    //       this.auth.saveToken(res.data.access_token);
    //       this.getDataProfile();
    //     } else {
    //       loader.dismiss();
    //       this.presentAlert('error', Dictionary.confirmation_login);
    //     }
    //   },
    //   err => {
    //     loader.dismiss();
    //     this.presentAlert('error', err.data.password[0]);
    //   }
    // );

    this.submitted = false;
    this.forgotPasswordForm.reset();
  }
}
