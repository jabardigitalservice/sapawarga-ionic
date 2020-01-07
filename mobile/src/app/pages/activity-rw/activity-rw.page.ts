import { Component, OnInit } from '@angular/core';
import { UserPost } from '../../interfaces/user-post';
import { UserPostService } from '../../services/user-post.service';
import { Router } from '@angular/router';
import { Dictionary } from '../../helpers/dictionary';
import { Constants } from '../../helpers/constants';
import { UtilitiesService } from '../../services/utilities.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { ActivityRwFormComponent } from 'src/app/shared/activity-rw-form/activity-rw-form.component';

const TOKEN_KEY = 'auth-token';

@Component({
  selector: 'app-activity-rw',
  templateUrl: './activity-rw.page.html',
  styleUrls: ['./activity-rw.page.scss']
})
export class ActivityRwPage implements OnInit {
  dataEmpty = false;
  isLoading = false;
  msgResponse = {
    type: '',
    msg: ''
  };
  dataUserPosts: UserPost[];
  currentPage = 1;
  maximumPages: number;
  isNewUserPost = false;
  imageData: any;

  constructor(
    private userPostService: UserPostService,
    private constants: Constants,
    private util: UtilitiesService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private camera: Camera,
    private transfer: FileTransfer,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.postRW);

    this.util.trackEvent(
      this.constants.pageName.postRW,
      'view_list_post_rw',
      '',
      1
    );
  }

  ionViewWillEnter() {
    this.getListUserPosts();
  }

  getListUserPosts(infiniteScroll?) {
    // check internet
    if (!navigator.onLine) {
      if (infiniteScroll) {
        infiniteScroll.target.complete();
      }
      return;
    }

    this.dataEmpty = false;

    if (!infiniteScroll) {
      this.isLoading = true;
    }

    this.userPostService.getListUserPosts(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          if (infiniteScroll) {
            this.dataUserPosts = this.dataUserPosts.concat(
              res['data']['items']
            );
          } else {
            this.dataUserPosts = res['data']['items'];
          }
        } else {
          this.dataEmpty = true;
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.polling_empty
          };
        }

        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
        this.isLoading = false;
      },
      err => {
        if (err.name === 'TimeoutError') {
          this.msgResponse = {
            type: 'offline',
            msg: Dictionary.offline
          };
        } else {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }

        this.isLoading = false;
      }
    );
  }

  detailUserPost(id: number) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    this.router.navigate(['/activity-rw', id]);
  }

  // infinite scroll
  doInfinite(event: any) {
    if (this.currentPage === this.maximumPages) {
      event.target.disabled = true;
      return;
    }
    // increase page
    this.currentPage++;

    setTimeout(() => {
      this.getListUserPosts(event);
    }, 2000);
  }

  showMore() {}

  /**
   *
   *
   * @param {number} index
   * @param {number} id
   * @param {boolean} isLiked
   * @memberof ActivityRwPage
   */
  doLike(index: number, id: number, isLiked: boolean) {
    if (isLiked === true) {
      this.dataUserPosts[index].likes_count =
        this.dataUserPosts[index].likes_count - 1;
      this.dataUserPosts[index].is_liked = false;

      // google analytics
      this.util.trackEvent(
        this.constants.pageName.postRW,
        'unlike_post_rw',
        this.dataUserPosts[index].text,
        1
      );
    } else {
      this.dataUserPosts[index].likes_count =
        this.dataUserPosts[index].likes_count + 1;
      this.dataUserPosts[index].is_liked = true;

      // google analytics
      this.util.trackEvent(
        this.constants.pageName.postRW,
        'like_post_rw',
        this.dataUserPosts[index].text,
        1
      );
    }

    // save like to server
    this.userPostService.PostLiked(id).subscribe();
  }

  async addPostRW() {
    this.showForm('asd');
    return;
    const buttons = [
      {
        text: 'Ambil foto',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          this.getImage(1);
        }
      },
      {
        text: 'Ambil dari gallery',
        icon: 'images',
        handler: () => {
          this.getImage(0);
        }
      },
      {
        text: 'Batal',
        icon: 'close',
        role: 'cancel',
        handler: () => {}
      }
    ];

    this.util.actionSheet(buttons, 'Pilihan');
  }

  // get native camera / gallery
  getImage(sourceType: number) {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType
    };

    this.camera.getPicture(options).then(
      imageData => {
        // check internet
        if (!navigator.onLine) {
          this.util.showToast(Dictionary.offline);
          return;
        }

        this.imageData = imageData;
        console.log(this.imageData);
        this.uploadImage(imageData);
      },
      err => {}
    );
  }

  // upload image to server
  async uploadImage(imageData) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading...'
    });
    await loading.present();

    const fileTransfer: FileTransferObject = this.transfer.create();

    // format file name using regex
    const fileNameFormat = imageData
      .substr(imageData.lastIndexOf('/') + 1)
      .split(/[?#]/)[0];

    const options: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileNameFormat,
      chunkedMode: false,
      mimeType: 'image/jpeg',
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
      }
    };

    options.params = {
      type: 'user_post_photo'
    };

    fileTransfer
      .upload(imageData, `${environment.API_URL}/attachments`, options)
      .then(
        data => {
          const response = JSON.parse(data.response);
          // success
          loading.dismiss();
          if (response['success'] === true) {
            const image = {
              type: 'photo',
              path: response['data']['path'],
              url: response['data']['url']
            };

            console.log(image);

            // this.images.push(image);

            // insert array images to form attachments
            // this.f.attachments.setValue(this.images);
          } else {
            this.util.showToast(Dictionary.max_upload_photo);
          }
        },
        err => {
          loading.dismiss();
          const data = JSON.parse(err.body);
          if (data.data.file[0]) {
            this.util.showToast(data.data.file[0]);
          } else {
            this.util.showToast(Dictionary.check_internal);
          }
        }
      );
  }

  async showForm(image: any) {
    const imagess = {
      type: 'photo',
      path: 'general/asdsa.png',
      url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwW_3ZEVJMdc1sBRD11aN5SgzqP53zj5vW3qvxTZRTxflSzB7_oQ&s'
    };

    const modal = await this.modalController.create({
      component: ActivityRwFormComponent,
      componentProps: {
        image: imagess
      },
      backdropDismiss: false
    });
    return await modal.present();
  }
}
