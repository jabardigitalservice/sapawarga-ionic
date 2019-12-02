import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuestionAndAnswerDetailPage } from './question-and-answer-detail.page';

const routes: Routes = [
  {
    path: '',
    component: QuestionAndAnswerDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QuestionAndAnswerDetailPage]
})
export class QuestionAndAnswerDetailPageModule {}
