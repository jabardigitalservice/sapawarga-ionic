import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  slides = [
    {
      title: "Selamat datang di Sapa Warga",
      description: "Menghubungkan Anda dengan Pemerintah Provinsi Jawa Barat",
      titleColor: "#000000"    
    },
    {
      title: "Aspirasi",
      description: "Sampaikan saran, keluhan, dan ide Anda melalui fitur polling, survei, dan pelaporan kepada pemerintah daerah.",
      titleColor: "green"    
    },
    {
      title: "Informasi",
      description: "Dapatkan broadcast informasi penting dan terbaru dari pemerintah.",
      titleColor: "yellow"    
    },
    {
      title: "Pelayanan Publik",
      description: "Nikmati pelayanan publik dan proses administrasi yang lebih mudah dan efisien.",
      titleColor: "blue"    
    }
  ]

  slideCaptionStyle = [
    'slide-caption bottom',
    'slide-caption top'
  ]
  
  constructor() { }

  ngOnInit() {
  }

  getSlideBackgroundStyle(index) {
    return {
      width: '100%',
      height: '100%',
      position: 'relative',
      background: `url("../../assets/img/onboarding/onboarding${index}.png") no-repeat`,
      backgroundSize: 'cover'
    };
  }
}
