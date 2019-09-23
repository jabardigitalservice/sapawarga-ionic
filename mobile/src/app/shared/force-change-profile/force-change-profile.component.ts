import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Dictionary } from 'src/app/helpers/dictionary';
import { ForceUpdateService } from '../../services/force-update.service';
import { UtilitiesService } from '../../services/utilities.service';
import {
  LoadingController,
  NavController,
  ModalController,
  Platform
} from '@ionic/angular';
import { Constants } from '../../helpers/constants';

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
    private modalCtrl: ModalController,
    private constants: Constants,
    private platform: Platform
  ) {
    this.changeProfileForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(4),
          Validators.pattern(/^[A-Za-z `'.]+$/)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            // tslint:disable-next-line:max-line-length
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{3,}@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
          )
        ]
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(13),
          Validators.pattern(/^(^62\s?|^0)(\d{5,13})$/)
        ]
      ],
      address: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      document.addEventListener(
        'backbutton',
        function(event) {
          event.preventDefault();
          event.stopPropagation();
        },
        false
      );
    });
  }

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

    await this.forceUpdateService
      .PostForceChangeProfile(this.changeProfileForm.value)
      .subscribe(
        res => {
          if (res.success === true) {
            loader.dismiss();
            localStorage.removeItem('auth-token');
            this.navCtrl.navigateRoot(['/login']);
            localStorage.removeItem(this.constants.localStorage.forceChange);
            this.dismiss();
          } else {
            loader.dismiss();
            this.util.alertConfirmation(Dictionary.confirmation_login, ['OK']);
          }
        },
        err => {
          loader.dismiss();
          if (err.status === 422) {
            if (err.data.email) {
              this.util.alertConfirmation(err.data.email[0], ['OK']);
            }
            if (err.data.phone) {
              this.util.alertConfirmation(err.data.phone[0], ['OK']);
            }
            if (err.data.name) {
              this.util.alertConfirmation(err.data.name[0], ['OK']);
            }
          } else {
            this.util.alertConfirmation(Dictionary.terjadi_kesalahan, ['OK']);
          }
        }
      );

    this.submitted = false;
  }
}
