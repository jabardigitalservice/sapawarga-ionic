import { NgModule, LOCALE_ID } from '@angular/core';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG
} from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Constants } from './helpers/constants';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { TokenInterceptor } from './helpers/token.interceptor';
import { MenuNavbarComponent } from './components/menu-navbar/menu-navbar.component';
import { MenuNavbarAspirasiComponent } from './components/menu-navbar-aspirasi/menu-navbar-aspirasi.component';
import { ForceChangePasswordComponent } from './shared/force-change-password/force-change-password.component';
import { ForceChangeProfileComponent } from './shared/force-change-profile/force-change-profile.component';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';

// plugin
import { FCM } from '@ionic-native/fcm/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { UpdateAppComponent } from './shared/update-app/update-app.component';
import { SMS } from '@ionic-native/sms/ngx';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { InformationPopupComponent } from './shared/information-popup/information-popup.component';
import { GestureConfig } from './helpers/GestureConfig';
import { IntroConstants } from './helpers/introConstants';

registerLocaleData(localeId);
@NgModule({
  declarations: [
    AppComponent,
    MenuNavbarComponent,
    MenuNavbarAspirasiComponent,
    UpdateAppComponent,
    ForceChangePasswordComponent,
    ForceChangeProfileComponent,
    ForgotPasswordComponent,
    InformationPopupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    MenuNavbarComponent,
    MenuNavbarAspirasiComponent,
    UpdateAppComponent,
    ForceChangePasswordComponent,
    ForceChangeProfileComponent,
    ForgotPasswordComponent,
    InformationPopupComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FCM,
    Network,
    GoogleAnalytics,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'id' },
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    InAppBrowser,
    Constants,
    IntroConstants,
    HTTP,
    AppVersion,
    ScreenOrientation,
    SMS,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
