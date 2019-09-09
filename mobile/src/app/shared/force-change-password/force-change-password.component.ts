import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { ForceUpdateService } from '../../services/force-update.service';

@Component({
  selector: 'app-force-change-password',
  templateUrl: './force-change-password.component.html',
  styleUrls: ['./force-change-password.component.scss']
})
export class ForceChangePasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;
  // show password
  type = 'password';
  passwordShown = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private forceUpdateService: ForceUpdateService
  ) {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  // convenience getter for easy access to form fields
  get f() {
    return this.changePasswordForm.controls;
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      dismissed: true
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

  async changePassword() {
    this.submitted = true;
    // check form if invalid
    if (this.changePasswordForm.invalid) {
      return;
    }

    // check internet
    // if (!navigator.onLine) {
    //   this.util.showToast(Dictionary.offline);
    //   return;
    // }

    // const loader = await this.loadingCtrl.create({
    //   duration: 10000
    // });
    // loader.present();

    console.log(this.changePasswordForm.value);

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
    this.changePasswordForm.reset();

    this.forceUpdateService.setDataForceChange(1);
  }
}
