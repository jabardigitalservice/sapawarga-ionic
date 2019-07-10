import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss']
})
export class OnboardingPage implements OnInit {
  slides = [
    {
      title: 'Selamat datang di Sapawarga',
      description: 'Menghubungkan Anda dengan Pemerintah Provinsi Jawa Barat',
      titleColor: '#000000'
    },
    {
      title: 'Aspirasi',
      description:
        'Sampaikan saran, keluhan, dan ide Anda melalui fitur polling, survei, dan pelaporan kepada pemerintah daerah.',
      titleColor: '#3ca96b'
    },
    {
      title: 'Informasi',
      description:
        'Dapatkan broadcast informasi penting dan terbaru dari pemerintah.',
      titleColor: '#fecb38'
    },
    {
      title: 'Pelayanan Publik',
      description:
        'Nikmati pelayanan publik dan proses administrasi yang lebih mudah dan efisien.',
      titleColor: '#00b7f0'
    }
  ];

  slideCaptionStyle = ['slide-caption bottom', 'slide-caption top'];

  constructor(
    private router: Router,
    private screenOrientation: ScreenOrientation
  ) {}

  ngOnInit() {
    // set to portrait
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  getSlideBackgroundStyle(index) {
    const verticalPos = index % 2 ? 'center' : 'bottom';

    return {
      width: '100%',
      height: '100%',
      position: 'relative',
      background: `url("../../assets/img/onboarding/onboarding${index}.png") no-repeat`,
      backgroundPosition: `center ${verticalPos}`,
      backgroundSize: 'cover'
    };
  }

  goToLogin() {
    localStorage.setItem('has-onboarding', 'true');
    this.router.navigate(['/login']);
    // allow user rotate
    this.screenOrientation.unlock();
  }
}
