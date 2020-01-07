import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Dictionary } from 'src/app/helpers/dictionary';

@Component({
  selector: 'app-activity-rw-form',
  templateUrl: './activity-rw-form.component.html',
  styleUrls: ['./activity-rw-form.component.scss']
})
export class ActivityRwFormComponent implements OnInit {
  public UserPostForm: FormGroup;
  submitted = false;

  image = {
    type: null,
    path: null,
    url: null
  };

  aaa: any;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private util: UtilitiesService
  ) {
    this.image = this.navParams.get('image');

    this.UserPostForm = this.formBuilder.group({
      text: ['', [Validators.required]]
    });
  }

  ngOnInit() {}

  dismiss() {
    // dismiss modal
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  getUrl() {
    return `url(${this.image.url})`;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.UserPostForm.controls;
  }

  sendPost() {
    this.submitted = true;
    // check form if invalid
    if (this.UserPostForm.invalid) {
      return;
    }

    // check internet
    if (!navigator.onLine) {
      this.util.showToast(Dictionary.offline);
      return;
    }

    // data send to server
    // const bodyPost = {
    //   user_post_id: this.dataUserPost.id,
    //   text: this.inputComment,
    //   status: 10
    // };

    // // data local
    // const dataNewComment: any = {
    //   id: this.dataUserPost.id,
    //   text: this.inputComment,
    //   user: {
    //     id: this.dataProfile.id,
    //     name: this.dataProfile.name,
    //     photo_url_full: this.dataProfile.photo_url
    //   },
    //   created_at: Date.now().valueOf() / 1000
    // };

    // // insert new comment to list comments
    // this.dataUserPostComents.push(dataNewComment);

    // // set null input text
    // this.inputComment = null;
    // setTimeout(() => {
    //   this.content.scrollToBottom(100);
    // }, 10);

    // this.userPostService.PostComment(bodyPost).subscribe(
    //   res => {
    //     if (res['success'] === true) {
    //       // google event analytics
    //       this.util.trackEvent(
    //         this.constants.pageName.postRW,
    //         'create_comment_post_rw',
    //         `${this.dataProfile.name}: ${this.inputComment}`,
    //         1
    //       );
    //     } else {
    //       this.util.alertConfirmation(Dictionary.terjadi_kesalahan, ['OK']);
    //     }
    //   },
    //   _ => {
    //     this.util.alertConfirmation(Dictionary.terjadi_kesalahan, ['OK']);
    //   }
    // );
  }
}
