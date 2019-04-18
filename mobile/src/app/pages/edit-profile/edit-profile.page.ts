import { Component, OnInit } from '@angular/core';
import {
  NavController,
  LoadingController,
  ToastController,
  ActionSheetController
} from '@ionic/angular';
import { ProfileService } from '../../services/profile.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Profile } from '../../interfaces/profile';
import { ActivatedRoute } from '@angular/router';
import { AreasService } from '../../services/areas.service';
import { Areas } from '../../interfaces/areas';

// plugin
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'auth-token';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss']
})
export class EditProfilePage implements OnInit {
  onEditForm: FormGroup;
  submitted = false;
  dataProfile: Profile;
  dataKabkota: Areas;
  dataKecamatan: Areas;
  dataKelurahan: Areas;

  imageData: any;
  image: any;
  imageFileName: any;

  constructor(
    private route: ActivatedRoute,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private profileService: ProfileService,
    private areasService: AreasService,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private transfer: FileTransfer,
    private actionsheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    // defined directive form
    this.onEditForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(4)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(12)]
      ],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      kabkota_id: ['', Validators.required],
      kec_id: ['', Validators.required],
      kel_id: ['', Validators.required],
      rw: [{ value: '', disabled: true }],
      rt: ['', [Validators.required, Validators.maxLength(3)]],
      role: [{ value: '', disabled: true }],
      instagram: [''],
      facebook: [''],
      twitter: ['']
    });

    // get query param from view profile
    this.route.queryParamMap.subscribe(params => {
      this.dataProfile = params['params'];

      if (this.dataProfile.photo_url) {
        // get image
        this.image = this.dataProfile.photo_url;
      }
    });

    // update data from query param to form input
    this.onEditForm.patchValue({
      name: this.dataProfile.name,
      email: this.dataProfile.email,
      phone: this.dataProfile.phone,
      address: this.dataProfile.address,
      kabkota_id: this.dataProfile.kabkota_id,
      kec_id: this.dataProfile.kec_id,
      kel_id: this.dataProfile.kel_id,
      rw: this.convertNumber(this.dataProfile.rw),
      role: this.dataProfile.role,
      instagram: this.dataProfile.instagram,
      facebook: this.dataProfile.facebook,
      twitter: this.dataProfile.twitter
    });

    this.getKabKota();
    this.getKecamatan(this.dataProfile.kabkota_id);
    this.getKelurahan(this.dataProfile.kec_id);
  }

  ionViewDidEnter() {}

  // detect form onchange
  onChanges(type: string) {
    switch (type) {
      case 'kabkota':
        this.getKecamatan(this.f.kabkota_id.value);
        // clear old value
        this.f.kec_id.setValue(0);
      case 'kecamatan':
        this.getKelurahan(this.f.kec_id.value);
        // clear old value
        this.f.kel_id.setValue(0);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.onEditForm.controls;
  }

  async onFormSubmit(form: NgForm) {
    this.submitted = true;
    // check form if invalid
    if (this.onEditForm.invalid) {
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
    this.profileService.editProfile(form).subscribe(
      res => {
        if (res.success === true) {
          this.showToast('Data berhasil tersimpan');
        } else {
          this.showToast('Data gagal tersimpan');
        }
        loader.dismiss();
      },
      err => {
        loader.dismiss();
        this.showToast(
          'Data gagal tersimpan periksa kembali koneksi internet anda'
        );
      }
    );
  }

  async sendData() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();
    loader.onWillDismiss().then(async l => {
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        cssClass: 'bg-profile',
        message: 'Your Data was Edited!',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
      this.navCtrl.navigateForward('/home-results');
    });
  }

  // get data kab/kota
  async getKabKota() {
    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.areasService.getKabKota().subscribe(
      res => {
        this.dataKabkota = res['data']['items'];
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

  // get data kecamatan
  getKecamatan(kabkota: number) {
    this.areasService.getKecamatan(kabkota).subscribe(
      res => {
        this.dataKecamatan = res['data']['items'];
      },
      err => {
        this.showToast(
          'Terjadi kesalahan periksa kembali koneksi internet anda'
        );
      }
    );
  }

  // get data kelurahan
  getKelurahan(kecamatan: number) {
    this.areasService.getKelurahan(kecamatan).subscribe(
      res => {
        this.dataKelurahan = res['data']['items'];
      },
      err => {
        this.showToast(
          'Terjadi kesalahan periksa kembali koneksi internet anda'
        );
      }
    );
  }

  async openEditProfile() {
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
      err => {
        console.log(err);
      }
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
      fileKey: 'image',
      fileName: fileNameFormat,
      chunkedMode: false,
      mimeType: 'image/jpeg',
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
      }
    };

    fileTransfer
      .upload(imageData, `${environment.API_URL}/user/me/photo`, options)
      .then(
        data => {
          console.log(data);
          let response = JSON.parse(data.response);
          // success
          loading.dismiss();
          console.log(response);
          if (response['success'] === true) {
            this.showToast('Foto berhasil disimpan');
            this.image = response['data']['photo_url'];
          } else {
            this.showToast(
              'Foto profile yang diupload melebihi batas max. file'
            );
          }
        },
        err => {
          loading.dismiss();
          this.showToast('Foto profile yang diupload melebihi batas max. file');
        }
      );
  }
  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  convertNumber(value) {
    let str = '' + value;
    let pad = '000';
    let ans = pad.substring(0, pad.length - str.length) + str;
    return ans;
  }
}
