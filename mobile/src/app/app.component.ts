import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Pages } from './interfaces/pages';
import { AuthService } from './services/auth.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';
import { BroadcastService } from './services/broadcast.service';

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
    private broadcastService: BroadcastService
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
            // this.payloadNotification = data;
            this.broadcastService.setNotification(false);
            const routingTarget = [data.target];
            if (data.target === 'broadcast') {
              routingTarget.push(data.id);
            }
            this.router.navigate(routingTarget, {
              queryParams: data
            });
          } else {
            // Received in foreground
            // set notification true to call state
            this.broadcastService.setNotification(true);
          }
        });
      })
      .catch(() => {});
  }

  logout() {
    this.navCtrl.navigateRoot('/');
  }
}
