import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewsDetailPage } from './news-detail.page';

// plugin in app browser
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SharedModule } from '../../shared/shared.module';

// plugin sosial sharing
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

const routes: Routes = [
  {
    path: '',
    component: NewsDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [NewsDetailPage],
  providers: [InAppBrowser, SocialSharing]
})
export class NewsDetailPageModule {}
