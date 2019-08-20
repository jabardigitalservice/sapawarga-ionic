import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { ProfileService } from '../../services/profile.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Profile } from '../../interfaces/profile';
import { ActivatedRoute } from '@angular/router';
import { AreasService } from '../../services/areas.service';
import { Areas } from '../../interfaces/areas';
import { UtilitiesService } from '../../services/utilities.service';

// plugin
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { environment } from '../../../environments/environment';
import { Dictionary } from '../../helpers/dictionary';

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
  role_user: string;
  fb_validator = true;

  msg_server = {
    username: null,
    email: null
  };

  constructor(
    private route: ActivatedRoute,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private profileService: ProfileService,
    private areasService: AreasService,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private transfer: FileTransfer,
    private util: UtilitiesService
  ) {}

  ngOnInit() {
    // defined directive form
    this.onEditForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(4),
          Validators.pattern(/^[A-Za-z ]+$/)
        ]
      ],
      username: [
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
      kabkota_id: { value: '', disabled: true },
      kec_id: { value: '', disabled: true },
      kel_id: { value: '', disabled: true },
      rw: [{ value: '', disabled: true }],
      rt: [
        '',
        [
          Validators.pattern(/^[0-9]+$/),
          Validators.required,
          Validators.maxLength(3)
        ]
      ],
      role: [{ value: '', disabled: true }],
      instagram: ['', [Validators.pattern(/^[a-z0-9_.]+$/)]],
      facebook: [''],
      twitter: ['', [Validators.pattern(/^[a-z0-9_.]+$/)]],
      lat: [''],
      lon: ['']
    });
  }

  ionViewDidEnter() {
    // get query param from view profile
    this.route.queryParamMap.subscribe(params => {
      this.dataProfile = params['params'];

      // save state image
      if (this.dataProfile.photo_url) {
        // get image
        this.image = this.dataProfile.photo_url;
      }

      // mapping berdasarkan role_id
      switch (this.dataProfile.role_id) {
        case 'user':
          this.role_user = 'Pengguna';
          break;
        case 'staffRW':
          this.role_user = 'RW';
          break;
        case 'staffKel':
          this.role_user = 'Staf Kelurahan';
          break;
        case 'staffKec':
          this.role_user = 'Staf Kecamatan';
          break;
        case 'staffKabkota':
          this.role_user = 'Staf Kabupaten/Kota';
          break;
        case 'staffProv':
          this.role_user = 'Staf Provinsi';
          break;
        case 'admin':
          this.role_user = 'Administrator';
          break;
        default:
          break;
      }
    });

    // update data from query param to form input
    this.onEditForm.patchValue({
      username: this.dataProfile.username,
      name: this.dataProfile.name,
      email: this.dataProfile.email,
      phone: this.dataProfile.phone,
      address: this.dataProfile.address,
      kabkota_id: this.dataProfile.kabkota_id,
      kec_id: this.dataProfile.kec_id,
      kel_id: this.dataProfile.kel_id,
      rw: this.convertNumber(this.dataProfile.rw),
      rt: this.dataProfile.rt ? this.convertNumber(this.dataProfile.rt) : '',
      role: this.role_user,
      instagram: this.dataProfile.instagram,
      facebook: this.dataProfile.facebook,
      twitter: this.dataProfile.twitter
    });

    this.getKabKota();
    this.getKecamatan(this.dataProfile.kabkota_id);
    this.getKelurahan(this.dataProfile.kec_id);
  }

  // Called when view is left
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.navCtrl.navigateForward('/tabs/akun');
  }

  // detect form onchange
  onChanges(type: string) {
    switch (type) {
      case 'kabkota':
        this.getKecamatan(this.f.kabkota_id.value);
        // clear old value
        this.f.kec_id.setValue(0);
        break;
      case 'kecamatan':
        this.getKelurahan(this.f.kec_id.value);
        // clear old value
        this.f.kel_id.setValue(0);
        break;
    }
  }

  // validate facebook
  onChangeFB() {
    if (this.f.facebook.value.length === 21) {
      if (this.f.facebook.value === 'https://facebook.com/') {
        this.fb_validator = true;
      } else if (this.f.facebook.value !== 'https://facebook.com/') {
        this.fb_validator = false;
      }
    } else if (
      this.f.facebook.value.length > 1 &&
      this.f.facebook.value.length < 21
    ) {
      this.fb_validator = false;
    } else if (this.f.facebook.value.length === 0) {
      this.fb_validator = true;
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

    // check fb only https://facebook.com/
    if (this.f.facebook.value === 'https://facebook.com/') {
      this.fb_validator = false;
      return;
    }

    // check fb if not valid
    if (!this.fb_validator) {
      this.fb_validator = false;
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
    this.profileService.editProfile(form).subscribe(
      res => {
        if (res.status === 200) {
          this.util.showToast(Dictionary.success_save);
          this.navCtrl.navigateForward('/tabs/akun');
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
          const data = err.data;
          // check unvalid email / username
          if (data.username && data.email) {
            this.util.showToast(`${data.email[0]} & ${data.username[0]}`);
          } else if (data.email && !data.username) {
            this.msg_server.email = data.email[0];
            this.f.email.setErrors({ notValid: true });
          } else if (data.username && !data.email) {
            this.msg_server.username = data.username[0];
            this.f.username.setErrors({ notValid: true });
          }
        } else {
          this.util.showToast(Dictionary.external_error);
        }
      }
    );
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
        this.util.showToast(Dictionary.check_internal);
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
        this.util.showToast(Dictionary.check_internal);
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
        this.util.showToast(Dictionary.check_internal);
      }
    );
  }

  async openEditProfile() {
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
          const response = JSON.parse(data.response);
          // success
          loading.dismiss();
          if (response['success'] === true) {
            this.util.showToast('Foto berhasil disimpan');
            this.image = response['data']['photo_url'];
          } else {
            this.util.showToast(Dictionary.max_upload_photo);
          }
        },
        err => {
          loading.dismiss();
          this.util.showToast(Dictionary.max_upload_photo);
        }
      );
  }

  convertNumber(value) {
    const str = '' + value;
    const pad = '000';
    const ans = pad.substring(0, pad.length - str.length) + str;
    return ans;
  }

  backViewProfile() {
    this.navCtrl.navigateForward('/tabs/akun');
  }
}
