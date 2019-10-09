import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { Dictionary } from '../../helpers/dictionary';
import { ForgotPasswordService } from '../../services/forgot-password.service';

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
    private util: UtilitiesService,
    private loadingCtrl: LoadingController,
    private forgotPasswordService: ForgotPasswordService
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

    // check internet
    if (!navigator.onLine) {
      this.util.showToast(Dictionary.offline);
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    const buttons = [
      {
        text: 'OK',
        handler: () => {
          this.dismiss();
        }
      }
    ];

    this.forgotPasswordService
      .requestForgotPassword(this.forgotPasswordForm.value)
      .subscribe(
        res => {
          if (res.success === true) {
            loader.dismiss();
            this.util.alertConfirmation(
              Dictionary.msg_forgot_password,
              buttons,
              'Selamat'
            );
          } else {
            loader.dismiss();
            this.util.alertConfirmation(Dictionary.terjadi_kesalahan, ['OK']);
          }
        },
        err => {
          loader.dismiss();
          this.util.alertConfirmation(Dictionary.msg_error_forgot_password, [
            'OK'
          ]);
        }
      );

    this.submitted = false;
    this.forgotPasswordForm.reset();
  }
}
