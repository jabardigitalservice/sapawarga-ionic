import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AspirasiService } from '../../services/aspirasi.service';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment';
// plugin
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { Aspirasi } from '../../interfaces/aspirasi';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../interfaces/profile';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

const TOKEN_KEY = 'auth-token';
@Component({
  selector: 'app-aspirasi-form',
  templateUrl: './aspirasi-form.page.html',
  styleUrls: ['./aspirasi-form.page.scss']
})
export class AspirasiFormPage implements OnInit {
  formAddAspirasi: FormGroup;
  CategoriesAspirasi: Aspirasi[];
  dataProfile: Profile;
  submitted = false;
  imageData: any;
  images = [];
  urlStorage = `${environment.API_STORAGE}/image/`;

  dataAspirasi: Aspirasi;

  isEdit = false;

  backButton: any;

  constructor(
    private formBuilder: FormBuilder,
    private aspirasiService: AspirasiService,
    private profileService: ProfileService,
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private camera: Camera,
    private transfer: FileTransfer,
    private navCtrl: NavController,
    private platform: Platform,
    private util: UtilitiesService,
    private constants: Constants
  ) {}

  ionViewDidEnter() {
    // handle hardware backbutton
    this.backButton = this.platform.backButton.subscribeWithPriority(1, () => {
      this.backMyAspirasi();
    });
  }

  // unsubscribe backButton
  ionViewWillLeave() {
    this.backButton.unsubscribe();
  }

  ngOnInit() {
    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.usulan,
      'view_form_usulan',
      '',
      1
    );

    this.formAddAspirasi = this.formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.minLength(10),
          Validators.pattern(/^[A-Za-z0-9 ]+$/)
        ]
      ],
      description: ['', [Validators.required]],
      category_id: [null, [Validators.required]],
      kabkota_id: [null],
      kec_id: [null],
      kel_id: [null],
      status: [null],
      attachments: []
    });

    // get data categories aspirasi
    this.getCategories();

    // get data profile user
    this.dataProfile = this.profileService.getLocalProfile();

    // set data kab / kota
    this.f.kabkota_id.setValue(this.dataProfile.kabkota_id);

    // set data kecamatan
    this.f.kec_id.setValue(this.dataProfile.kec_id);

    // set data kelurahan
    this.f.kel_id.setValue(this.dataProfile.kel_id);

    // get query param from detail aspirasi user
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.params.data) {
        this.isEdit = true;
        this.dataAspirasi = JSON.parse(params.params.data);

        // set data title
        this.f.title.setValue(this.dataAspirasi.title);

        // set data description
        this.f.description.setValue(this.dataAspirasi.description);

        // set data category_id
        this.f.category_id.setValue(this.dataAspirasi.category_id);

        // set data attachments
        this.images = this.dataAspirasi.attachments
          ? this.dataAspirasi.attachments
          : [];
        this.f.attachments.setValue(this.images);
      }
    });
  }

  backMyAspirasi() {
    if (this.formAddAspirasi.dirty) {
      this.confirmationDraft();
    } else {
      this.navCtrl.back();
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.formAddAspirasi.controls;
  }

  // get data kab/kota
  async getCategories() {
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.aspirasiService.getCategories().subscribe(
      res => {
        this.CategoriesAspirasi = res['data']['items'];
        loader.dismiss();
      },
      err => {
        this.util.showToast(Dictionary.check_internal);
        loader.dismiss();
      }
    );
  }

  createEventAnalytics(action: string, label?: string) {
    this.util.trackEvent(this.constants.pageName.usulan, action, label, 1);
  }

  prosesAspirasi() {
    this.submitted = true;

    // check form if invalid
    if (this.formAddAspirasi.invalid) {
      return;
    }

    // check internet
    if (!navigator.onLine) {
      this.util.showToast(Dictionary.offline);
      return;
    }

    if (this.isEdit) {
      this.editAspirasi();
    } else {
      this.addAspirasi();
    }
  }

  async addAspirasi() {
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();
    this.aspirasiService.PostAspirasi(this.formAddAspirasi.value).subscribe(
      res => {
        if (res.status === 201) {
          this.util.showToast(Dictionary.success_save);
          this.navCtrl.back();

          // create event google analytics
          this.createEventAnalytics('create_usul_answer', this.f.title.value);
        } else {
          this.util.showToast(Dictionary.failed_save);
        }
        loader.dismiss();
      },
      err => {
        loader.dismiss();
        // check if status 422
        if (err.status === 422) {
          // get data from server
        } else {
          this.util.showToast(Dictionary.external_error);
        }
      }
    );
  }

  async editAspirasi() {
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();
    this.aspirasiService
      .editAspirasi(this.dataAspirasi.id, this.formAddAspirasi.value)
      .subscribe(
        res => {
          if (res.status === 200) {
            this.util.showToast(Dictionary.success_save);
            this.navCtrl.back();

            // edit event google analytics
            this.createEventAnalytics(
              'edit_own_usulan_draft',
              this.f.title.value
            );
          } else {
            this.util.showToast(Dictionary.failed_save);
          }
          loader.dismiss();
        },
        err => {
          loader.dismiss();
          // check if status 422
          if (err.status === 422) {
            // get data from server
          } else {
            this.util.showToast(Dictionary.external_error);
          }
        }
      );
  }

  async uploadAspirasi() {
    if (this.images.length >= 5) {
      this.util.showToast(Dictionary.aspirasi_limit_upload);
      return;
    }

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
      type: 'aspirasi_photo'
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
              path: response['data']['path']
            };

            this.images.push(image);

            // insert array images to form attachments
            this.f.attachments.setValue(this.images);
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

  removeImage(index) {
    // remove object from array images
    this.images.splice(index, 1);

    // insert new array images to form attachments
    this.f.attachments.setValue(this.images);
  }

  async confirmationSend() {
    const buttons = [
      {
        text: 'Batal',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {}
      },
      {
        text: 'Setuju',
        handler: () => {
          // set status 5 = waiting confirmation
          this.f.status.setValue(5);
          this.prosesAspirasi();
        }
      }
    ];

    this.util.alertConfirmation(Dictionary.aspirasi_msg_send, buttons);
  }

  async confirmationDraft() {
    const buttons = [
      {
        text: 'Batal',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          this.navCtrl.back();
        }
      },
      {
        text: 'Setuju',
        handler: () => {
          // set status 5 = waiting confirmation
          this.f.status.setValue(0);
          this.prosesAspirasi();
        }
      }
    ];

    this.util.alertConfirmation(Dictionary.aspirasi_msg_draft, buttons);
  }

  saveDraft() {
    // set status 0 = draft
    this.f.status.setValue(0);
    this.prosesAspirasi();
  }
}
