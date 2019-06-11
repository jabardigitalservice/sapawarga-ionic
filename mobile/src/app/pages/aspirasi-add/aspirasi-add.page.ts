import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { AspirasiService } from '../../services/aspirasi.service';
import {
  LoadingController,
  ToastController,
  ActionSheetController,
  NavController,
  AlertController
} from '@ionic/angular';
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

const TOKEN_KEY = 'auth-token';
@Component({
  selector: 'app-aspirasi-add',
  templateUrl: './aspirasi-add.page.html',
  styleUrls: ['./aspirasi-add.page.scss']
})
export class AspirasiAddPage implements OnInit {
  formAddAspirasi: FormGroup;
  CategoriesAspirasi: Aspirasi[];
  dataProfile: Profile;
  submitted = false;
  imageData: any;
  images = [];
  urlStorage = `${environment.API_STORAGE}/image/`;
  isChecked = false;

  constructor(
    private formBuilder: FormBuilder,
    private aspirasiService: AspirasiService,
    private profileService: ProfileService,
    public loadingCtrl: LoadingController,
    private actionsheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private camera: Camera,
    private transfer: FileTransfer,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.formAddAspirasi = this.formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.minLength(10),
          Validators.pattern(/^[a-z0-9 ]+$/)
        ]
      ],
      description: ['', [Validators.required, Validators.maxLength(280)]],
      category_id: ['', [Validators.required]],
      kabkota_id: [null],
      kec_id: [null],
      kel_id: [null],
      status: [null],
      attachments: [],
      isChecked: [false]
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
        this.showToast(
          'Terjadi kesalahan periksa kembali koneksi internet anda'
        );
        loader.dismiss();
      }
    );
  }

  async addAspirasi() {
    this.submitted = true;

    // check form if invalid
    if (this.formAddAspirasi.invalid) {
      return;
    }

    // check internet
    if (!navigator.onLine) {
      this.showToast('Tidak ada koneksi internet');
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();
    this.aspirasiService.PostAspirasi(this.formAddAspirasi.value).subscribe(
      res => {
        if (res.status === 201) {
          this.showToast('Data berhasil tersimpan');
          this.navCtrl.back();
        } else {
          this.showToast('Data gagal tersimpan');
        }
        loader.dismiss();
      },
      err => {
        loader.dismiss();
        // check if status 422
        if (err.status === 422) {
          // get data from server
        } else {
          this.showToast(
            'Data gagal tersimpan periksa kembali koneksi internet anda'
          );
        }
      }
    );
  }

  async uploadAspirasi() {
    const actionSheet = await this.actionsheetCtrl.create({
      header: 'Pilihan',
      buttons: [
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
      ]
    });
    await actionSheet.present();
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
    let fileNameFormat = imageData
      .substr(imageData.lastIndexOf('/') + 1)
      .split(/[?#]/)[0];

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileNameFormat,
      chunkedMode: false,
      mimeType: 'image/jpeg',
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
      }
    };

    options.params = {
      type: 'phonebook_photo'
    };

    fileTransfer
      .upload(imageData, `${environment.API_URL}/attachments`, options)
      .then(
        data => {
          // console.log(data);
          let response = JSON.parse(data.response);
          // success
          loading.dismiss();
          // console.log(response);
          if (response['success'] === true) {
            let image = {
              type: 'photo',
              path: response['data']['path']
            };

            this.images.push(image);

            // insert array images to form attachments
            this.f.attachments.setValue(this.images);
          } else {
            this.showToast(
              'Foto profile yang diupload melebihi batas max. file'
            );
          }
        },
        err => {
          loading.dismiss();
          this.showToast('Terjadi Kesalahan');
        }
      );
  }

  removeImage(index) {
    // remove object from array images
    this.images.splice(index, 1);

    // insert new array images to form attachments
    this.f.attachments.setValue(this.images);
  }

  async confirmationMsg() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: 'apakah anda setuju untuk memberikan aspirasi untuk jawa barat?',
      buttons: [
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
            this.addAspirasi();
          }
        }
      ]
    });

    await alert.present();
  }

  saveDraft() {
    // set status 0 = draft
    this.f.status.setValue(0);
    this.addAspirasi();
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
