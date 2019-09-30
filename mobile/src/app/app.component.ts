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
    private modalController: ModalController
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
        this.exitApp();
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

        // integrasi google analytics
        this.googleAnalytics
          .startTrackerWithId(this.constants.trackIdGoogleAnalytics)
          .then(() => {})
          .catch(e => console.log('GoogleAnalytics == ' + e));

        this.authService.authenticationState.subscribe(state => {
          if (state) {
            // check if user is done to edit password / edit profile
            const dataCheckUpdate = this.forceUpdateService.checkForceUpdate();
            if (dataCheckUpdate === 1) {
              // show modal force password
              this.showModalUpdate(1);
            } else if (dataCheckUpdate === 2) {
              // show modal force profile
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
          if (data.wasTapped) {
            // Received in background
            if (data.target === 'url') {
              // Handle redirect to URL
              const meta = JSON.parse(data.meta);
              this.platform.ready().then(() => {
                this.inAppBrowser.create(meta.url, '_system');
              });
            } else {
              // Handle redirect to app
              const routingTarget = [data.target];
              if (data.target === 'broadcast') {
                this.broadcastService.setNotification(false);
                routingTarget.push(data.id);
              }
              this.router.navigate(routingTarget, {
                queryParams: data
              });
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
