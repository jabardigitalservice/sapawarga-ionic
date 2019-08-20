import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
  public pageName = {
    home: 'Home',
    usulan: 'Usulan',
    usulanList: 'Usulan Umum',
    myUsulan: 'Usulan Saya',
    broadcast: 'Pesan',
    help: 'Bantuan',
    myAccount: 'Akun Saya',
    account: 'Akun',
    report: 'Lapor',
    survey: 'Survei',
    polling: 'Polling',
    nomorPenting: 'Nomor Penting',
    eSamsat: 'E-Samsat',
    administration: 'Administrasi',
    news: 'Berita',
    humas: 'Humas Jabar',
    videoList: 'Video List'
  };

  public inAppBrowserOptions: any = {
    location: 'yes', // Or 'no'
    hidden: 'no', // Or  'yes'
    hideurlbar: 'yes',
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'no', // Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', // Android only
    closebuttoncaption: 'Close', // iOS only
    disallowoverscroll: 'no', // iOS only
    toolbar: 'yes', // iOS only
    enableViewportScale: 'no', // iOS only
    allowInlineMediaPlayback: 'no', // iOS only
    presentationstyle: 'pagesheet', // iOS only
    fullscreen: 'yes', // Windows only
    toolbartranslucent: 'yes'
  };

  public URL: any = {
    userGuide:
      'https://drive.google.com/uc?export=download&id=1rFPMmLGHpK0X6c1NftzdSrYQAHcPIzSU',
    termOfService:
      'https://digitalservice.jabarprov.go.id/index.php/term-of-service/',
    privacyPolicy:
      'https://digitalservice.jabarprov.go.id/index.php/privacy-policy-2/'
  };

  public trackIdGoogleAnalytics = 'UA-140018658-3';
}
