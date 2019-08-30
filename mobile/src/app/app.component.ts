import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, IonRouterOutlet } from '@ionic/angular';
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
    private profileService: ProfileService
  ) {
    this.initializeApp();
    this.platform.backButton.subscribe(() => {
      if (
        this.routerOutlet &&
        this.routerOutlet.canGoBack() &&
        this.router.url !== '/aspirasi-form'
      ) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/tabs') {
        navigator['app'].exitApp();
      } else if (this.router.url === '/aspirasi-form') {
        return;
      } else {
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
    });
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

        // check update
        this.util.presentModal();

        // integrasi google analytics
        this.googleAnalytics
          .startTrackerWithId(this.constants.trackIdGoogleAnalytics)
          .then(() => {})
          .catch(e => console.log('GoogleAnalytics == ' + e));

        this.authService.authenticationState.subscribe(state => {
          if (state) {
            this.navCtrl.navigateRoot('/');

            //  get ID user
            const idUser = this.profileService.getLocalProfile()
              ? this.profileService.getLocalProfile().id.toString()
              : null;

            if (idUser) {
              // set user ID google analytics
              this.googleAnalytics.setUserId(idUser);
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
}
