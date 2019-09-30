import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageControlComponent } from './message-control/message-control.component';
import { AspirasiListComponent } from './aspirasi-list/aspirasi-list.component';
import { MyAspirasiComponent } from './my-aspirasi/my-aspirasi.component';
import { IonicModule } from '@ionic/angular';
import { NewsFeaturedComponent } from './news-featured/news-featured.component';
import { VideoListComponent } from './video-list/video-list.component';

@NgModule({
  declarations: [
    MessageControlComponent,
    AspirasiListComponent,
    MyAspirasiComponent,
    NewsFeaturedComponent,
    VideoListComponent
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    MessageControlComponent,
    AspirasiListComponent,
    MyAspirasiComponent,
    NewsFeaturedComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
