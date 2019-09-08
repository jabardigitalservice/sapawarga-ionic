import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';

// plugin
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Downloader } from '@ionic-native/downloader/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [AppVersion, Downloader, InAppBrowser],
  declarations: [LoginPage]
})
export class LoginPageModule {}
