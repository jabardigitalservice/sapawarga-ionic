import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { HomeResultsPage } from './home-results.page';

// plugin app browser
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: HomeResultsPage
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
  providers: [YoutubeVideoPlayer],
  declarations: [HomeResultsPage]
})
export class HomeResultsPageModule {}
