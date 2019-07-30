import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageControlComponent } from './message-control/message-control.component';
import { VideoListComponent } from './video-list/video-list.component';

// plugin
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@NgModule({
  declarations: [MessageControlComponent, VideoListComponent],
  imports: [CommonModule],
  providers: [YoutubeVideoPlayer],
  exports: [MessageControlComponent, VideoListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
