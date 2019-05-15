import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Pages } from './interfaces/pages';
import { AuthService } from './services/auth.service';
import { FCM } from '@ionic-native/fcm/ngx';

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
    private fcm: FCM
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform
      .ready()
      .then(() => {
        this.statusBar.styleBlackTranslucent();
        this.splashScreen.hide();

        this.fcm.onNotification().subscribe(data => {
          console.log(data);
          if (data.wasTapped) {
            console.log('Received in background');
          } else {
            console.log('Received in foreground');
          }
        });

        this.authService.authenticationState.subscribe(state => {
          if (state) {
            this.navCtrl.navigateRoot('/');
          } else {
            this.navCtrl.navigateRoot('/login');
          }
        });
      })
      .catch(() => {});
  }

  logout() {
    this.navCtrl.navigateRoot('/');
  }
}
