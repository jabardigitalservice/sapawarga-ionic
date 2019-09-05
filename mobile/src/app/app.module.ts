import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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

// Components
import { TokenInterceptor } from './helpers/token.interceptor';
import { MenuNavbarComponent } from './components/menu-navbar/menu-navbar.component';
import { MenuNavbarAspirasiComponent } from './components/menu-navbar-aspirasi/menu-navbar-aspirasi.component';

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
import { ModalComponent } from './shared/modal/modal.component';
import { AppVersion } from '@ionic-native/app-version/ngx';
@NgModule({
  declarations: [
    AppComponent,
    MenuNavbarComponent,
    MenuNavbarAspirasiComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  entryComponents: [
    MenuNavbarComponent,
    MenuNavbarAspirasiComponent,
    ModalComponent
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
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    InAppBrowser,
    Constants,
    HTTP,
    ScreenOrientation,
    AppVersion
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
