import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';

// plugin
import { Downloader } from '@ionic-native/downloader/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { SharedModule } from '../../shared/shared.module';
import { DidNotRegisterComponent } from '../../shared/did-not-register/did-not-register.component';

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
  providers: [Downloader, InAppBrowser, Keyboard],
  declarations: [LoginPage],
  entryComponents: [DidNotRegisterComponent]
})
export class LoginPageModule {}
