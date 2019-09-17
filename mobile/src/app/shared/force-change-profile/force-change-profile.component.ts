import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-force-change-profile',
  templateUrl: './force-change-profile.component.html',
  styleUrls: ['./force-change-profile.component.scss']
})
export class ForceChangeProfileComponent implements OnInit {
  public changeProfileForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
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

  async submitProfile() {
    this.submitted = true;
    // check form if invalid
    if (this.changeProfileForm.invalid) {
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
    this.changeProfileForm.reset();
  }
}
