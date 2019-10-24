import { Component, ViewChild } from '@angular/core';
import {
  Platform,
  NavController,
  IonRouterOutlet,
  ModalController
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Dictionary } from './helpers/dictionary';
import { Pages } from './interfaces/pages';
import { AuthService } from './services/auth.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';
import { BroadcastService } from './services/broadcast.service';
import { NotifikasiService } from './services/notifikasi.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { UtilitiesService } from './services/utilities.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Constants } from './helpers/constants';
import { ProfileService } from './services/profile.service';
import { AppUpdateService } from './services/app-update.service';
import { ForceChangePasswordComponent } from './shared/force-change-password/force-change-password.component';
import { ForceChangeProfileComponent } from './shared/force-change-profile/force-change-profile.component';
import { ForceUpdateService } from './services/force-update.service';
import { InformationPopupService } from './services/information-popup.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  showSplash = true; // <-- show animation
  public appPages: Array<Pages>;
  public counter = 0;
  public isPushNotification = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private authService: AuthService,
    private fcm: FCM,
    private screenOrientation: ScreenOrientation,
    private googleAnalytics: GoogleAnalytics,
    private router: Router,
    private broadcastService: BroadcastService,
    private notifikasiService: NotifikasiService,
    private inAppBrowser: InAppBrowser,
    private util: UtilitiesService,
    private constants: Constants,
    private profileService: ProfileService,
    private appUpdateService: AppUpdateService,
    private forceUpdateService: ForceUpdateService,
    private modalController: ModalController,
    private informationPopupService: InformationPopupService
  ) {
    this.initializeApp();

    this.platform.backButton.subscribe(() => {
      const isModalOpened = this.modalController.getTop();
      if (
        this.routerOutlet &&
        this.routerOutlet.canGoBack() &&
        this.router.url !== '/aspirasi-form'
      ) {
        this.routerOutlet.pop();
      } else if (router.url === '/tabs' && isModalOpened) {
        this.exitApp();
      } else if (this.router.url === '/aspirasi-form') {
        return;
      } else {
        // check if has push notification
        if (this.isPushNotification) {
          this.navCtrl.navigateRoot('/');
          this.isPushNotification = false;
        } else {
          this.exitApp();
        }
      }
    });
  }

  private exitApp() {
    if (this.counter === 0) {
      this.counter++;
      this.util.showToast(Dictionary.msg_exit_app);
      setTimeout(() => {
        this.counter = 0;
      }, 3000);
    } else {
      navigator['app'].exitApp();
    }
  }

  initializeApp() {
    this.platform
      .ready()
      .then(() => {
        this.statusBar.styleBlackTranslucent();
        this.splashScreen.hide();

        // set to portrait
        this.screenOrientation.lock(
          this.screenOrientation.ORIENTATIONS.PORTRAIT
        );

        // check app is up to date / not
        this.appUpdateService.checkAppUpdate();

        // integration google analytics
        this.googleAnalytics
          .startTrackerWithId(this.constants.trackIdGoogleAnalytics)
          .then(() => {})
          .catch(e => console.log('GoogleAnalytics == ' + e));

        this.authService.authenticationState.subscribe(state => {
          if (state) {
            // check if user has edit password / edit profile
            const dataCheckUpdate = this.forceUpdateService.checkForceUpdate();
            if (dataCheckUpdate === 1) {
              // show component modal force password
              this.showModalUpdate(1);
            } else if (dataCheckUpdate === 2) {
              // show component modal force profile
              this.showModalUpdate(2);
            }

            this.navCtrl.navigateRoot('/');

            //  get ID user
            const dataUser = this.profileService.getLocalProfile()
              ? this.profileService.getLocalProfile()
              : null;

            if (dataUser) {
              // set user ID google analytics
              this.googleAnalytics.setUserId(dataUser.id);

              // set role
              this.googleAnalytics.addCustomDimension(1, dataUser.role_label);

              // set kabkota
              this.googleAnalytics.addCustomDimension(2, dataUser.kabkota.name);

              // set kecamatan
              this.googleAnalytics.addCustomDimension(
                3,
                dataUser.kecamatan.name
              );

              // set kelurahan
              this.googleAnalytics.addCustomDimension(
                4,
                dataUser.kelurahan.name
              );

              // set rt
              this.googleAnalytics.addCustomDimension(5, dataUser.rt);

              // set rw
              this.googleAnalytics.addCustomDimension(6, dataUser.rw);

              // set username
              this.googleAnalytics.addCustomDimension(7, dataUser.username);

              // set name
              this.googleAnalytics.addCustomDimension(8, dataUser.name);

              // set user id
              this.googleAnalytics.addCustomDimension(9, dataUser.id);

              if (dataUser.password_updated_at) {
                // check information popup
                this.informationPopupService.checkInformationPopup();
              }
            }
          } else {
            const hasOnboarding = localStorage.getItem('has-onboarding');
            if (hasOnboarding) {
              this.navCtrl.navigateRoot('/login');
            } else {
              this.navCtrl.navigateRoot('/onboarding');
            }
          }
        });

        this.fcm.onNotification().subscribe(data => {
          const meta = JSON.parse(data.meta);
          if (data.wasTapped) {
            if (data.target === 'url') {
              this.inAppBrowser.create(meta.url, '_system'); // call webview in app
            } else if (
              data.target === 'notifikasi' &&
              meta.target === 'survey'
            ) {
              this.util.launchweb(meta.url); // call webview external
            } else if (data.target === 'notifikasi' && meta.target === 'url') {
              this.inAppBrowser.create(meta.url, '_system'); // call yotube app
            } else if (
              data.target === 'notifikasi' &&
              meta.target === 'home-results'
            ) {
              this.navCtrl.navigateRoot('/');
            } else {
              // save state
              this.isPushNotification = data.push_notification;

              // check if meta.id === null then direct to list
              if (!meta.id) {
                this.router.navigate([`/${meta.target}`], {
                  queryParams: {
                    isPushNotification: this.isPushNotification
                  }
                });
              } else {
                this.router.navigate([`/${meta.target}`, meta.id], {
                  queryParams: {
                    isPushNotification: this.isPushNotification
                  }
                });
              }
            }
          } else {
            // Received in foreground
            if (data.target === 'broadcast') {
              // set notification true to call state
              this.broadcastService.setNotification(true);
            }
          }

          if (data.target === 'notifikasi' || data.target === 'url') {
            this.notifikasiService.saveReceivedNotifikasi(data);
          }
        });
      })
      .catch(() => {});
  }

  logout() {
    this.navCtrl.navigateRoot('/');
  }

  async showModalUpdate(data: number) {
    const modal = await this.modalController.create({
      component:
        data === 1 ? ForceChangePasswordComponent : ForceChangeProfileComponent,
      keyboardClose: false
    });
    return await modal.present();
  }
}
