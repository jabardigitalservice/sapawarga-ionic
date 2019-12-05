import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageControlComponent } from './message-control/message-control.component';
import { AspirasiListComponent } from './aspirasi-list/aspirasi-list.component';
import { MyAspirasiComponent } from './my-aspirasi/my-aspirasi.component';
import { IonicModule } from '@ionic/angular';
import { NewsFeaturedComponent } from './news-featured/news-featured.component';
import { VideoListComponent } from './video-list/video-list.component';
import { HumasJabarComponent } from './humas-jabar/humas-jabar.component';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { QuestionAndAnswerListComponent } from './question-and-answer-list/question-and-answer-list.component';
import { QuestionAndAnswerFormComponent } from './question-and-answer-form/question-and-answer-form.component';

@NgModule({
  declarations: [
    MessageControlComponent,
    AspirasiListComponent,
    MyAspirasiComponent,
    NewsFeaturedComponent,
    VideoListComponent,
    HumasJabarComponent,
    SkeletonComponent,
    QuestionAndAnswerListComponent
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    MessageControlComponent,
    AspirasiListComponent,
    MyAspirasiComponent,
    NewsFeaturedComponent,
    VideoListComponent,
    HumasJabarComponent,
    SkeletonComponent,
    QuestionAndAnswerListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
