import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { Pages } from './interfaces/pages';
import { AuthService } from './services/auth.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';
import { BroadcastService } from './services/broadcast.service';
import { NotifikasiService } from './services/notifikasi.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showSplash = true; // <-- show animation
  public appPages: Array<Pages>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private authService: AuthService,
    private fcm: FCM,
    private router: Router,
    private broadcastService: BroadcastService,
    private notifikasiService: NotifikasiService,
    private inAppBrowser: InAppBrowser
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform
      .ready()
      .then(() => {
        this.statusBar.styleBlackTranslucent();
        this.splashScreen.hide();

        this.authService.authenticationState.subscribe(state => {
          if (state) {
            this.navCtrl.navigateRoot('/');
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
