import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Dictionary } from 'src/app/helpers/dictionary';
import { ForceUpdateService } from '../../services/force-update.service';
import { UtilitiesService } from '../../services/utilities.service';
import {
  LoadingController,
  NavController,
  ModalController
} from '@ionic/angular';

@Component({
  selector: 'app-force-change-profile',
  templateUrl: './force-change-profile.component.html',
  styleUrls: ['./force-change-profile.component.scss']
})
export class ForceChangeProfileComponent implements OnInit {
  public changeProfileForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private forceUpdateService: ForceUpdateService,
    private util: UtilitiesService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
    this.changeProfileForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(4),
          Validators.pattern(/^[A-Za-z ]+$/)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(12)]
      ],
      address: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit() {}

  // convenience getter for easy access to form fields
  get f() {
    return this.changeProfileForm.controls;
  }

  dismiss() {
    // dismiss modal
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async submitProfile() {
    this.submitted = true;
    // check form if invalid
    if (this.changeProfileForm.invalid) {
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

    console.log(this.changeProfileForm.value);

    await this.forceUpdateService
      .PostForceChangeProfile(this.changeProfileForm.value)
      .subscribe(
        res => {
          if (res.success === true) {
            loader.dismiss();
            localStorage.removeItem('auth-token');
            this.navCtrl.navigateRoot(['/login']);
            this.dismiss();
          } else {
            loader.dismiss();
            this.util.alertConfirmation(Dictionary.confirmation_login, ['OK']);
          }
        },
        err => {
          loader.dismiss();
          console.log(err);
          // this.util.alertConfirmation(Dictionary.confirmation_login, ['OK']);
        }
      );

    this.submitted = false;
    this.changeProfileForm.reset();
  }
}
