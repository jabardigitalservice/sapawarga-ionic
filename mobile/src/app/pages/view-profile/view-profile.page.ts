import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { LoadingController, PopoverController, Platform } from '@ionic/angular';
import { Profile } from '../../interfaces/profile';
import { MenuNavbarComponent } from '../../components/menu-navbar/menu-navbar.component';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import {
  InAppBrowser,
  InAppBrowserObject
} from '@ionic-native/in-app-browser/ngx';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.page.html',
  styleUrls: ['./view-profile.page.scss']
})
export class ViewProfilePage implements OnInit {
  dataProfile: Profile;
  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    public loadingCtrl: LoadingController,
    private profileService: ProfileService,
    public popoverCtrl: PopoverController,
    private appAvailability: AppAvailability,
    private platform: Platform,
    private inAppBrowser: InAppBrowser,
    private util: UtilitiesService,
    private constants: Constants
  ) {}

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.myAccount);

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.account,
      'view_detail_user',
      '',
      1
    );

    if (!navigator.onLine) {
      // get data profile from local storage
      this.dataProfile = this.profileService.getLocalProfile();
    } else {
      this.getDataProfile(null);
    }
  }

  ionViewDidEnter() {
    this.msgResponse = {
      type: '',
      msg: ''
    };

    if (!navigator.onLine) {
      // get data profile from local storage
      this.dataProfile = this.profileService.getLocalProfile();
    } else {
      this.getDataProfile(null);
    }
  }

  // pass in the app name and the name of the user/page
  goToSosialMedia(app: string, name?: string, fbUrl?: string) {
    if (name) {
      switch (app) {
        case 'facebook':
          this.launchApp(
            'fb://',
            'com.facebook.katana',
            'fb://facewebmodal/f?href=' + fbUrl,
            // url fb
            fbUrl
          );
          break;
        case 'instagram':
          this.launchApp(
            'instagram://',
            'com.instagram.android',
            'instagram://user?username=' + name,
            'https://www.instagram.com/' + name
          );
          break;
        case 'twitter':
          this.launchApp(
            'twitter://',
            'com.twitter.android',
            'twitter://user?screen_name=' + name,
            'https://twitter.com/' + name
          );
          break;
        default:
          break;
      }
    }
  }

  private launchApp(
    iosApp: string,
    androidApp: string,
    appUrl: string,
    webUrl: string
  ) {
    let app: string;
    // check if the platform is ios or android, else open the web url
    if (this.platform.is('ios')) {
      app = iosApp;
    } else if (this.platform.is('android')) {
      app = androidApp;
    } else {
      const browser: InAppBrowserObject = this.inAppBrowser.create(
        webUrl,
        '_system'
      );
      return;
    }
    this.appAvailability.check(app).then(
      () => {
        // success callback, the app exists and we can open it
        const browser: InAppBrowserObject = this.inAppBrowser.create(
          appUrl,
          '_system'
        );
      },
      () => {
        // error callback, the app does not exist, open regular web url instead
        const browser: InAppBrowserObject = this.inAppBrowser.create(
          webUrl,
          '_system'
        );
      }
    );
  }

  async getDataProfile(event) {
    // check internet
    if (!navigator.onLine) {
      this.msgResponse = {
        type: 'offline',
        msg: Dictionary.offline
      };
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    if (event === null) {
      loader.present();
    }
    this.profileService.getProfile().subscribe(
      res => {
        this.dataProfile = res['data'];

        // save to local storage
        this.profileService.saveProfile(res['data']);
        loader.dismiss();
        if (
          !this.dataProfile.twitter ||
          !this.dataProfile.facebook ||
          !this.dataProfile.instagram
        ) {
          this.util.showToast(Dictionary.complete_sosmed);
        }
      },
      err => {
        loader.dismiss();
        if (err) {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
      }
    );
  }

  doRefresh(event) {
    // offline
    if (!navigator.onLine) {
      this.util.showToast(Dictionary.offline);
      event.target.complete();
      return;
    }
    this.getDataProfile('loading');
    // event.target.complete();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async navbarMore(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MenuNavbarComponent,
      componentProps: {
        dataUser: this.dataProfile
      },
      event: ev,
      cssClass: 'popover_class',
      animated: true,
      showBackdrop: true,
      translucent: true
    });

    popover.onDidDismiss();

    return await popover.present();
  }

  convertNumber(value) {
    const str = '' + value;
    const pad = '000';
    const ans = pad.substring(0, pad.length - str.length) + str;
    return ans;
  }

  checkInternet() {
    // check internet
    if (!navigator.onLine) {
      // offline
      return true;
    } else {
      // online
      return false;
    }
  }
}
