import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuestionAndAnswerPage } from './question-and-answer.page';

const routes: Routes = [
  {
    path: '',
    component: QuestionAndAnswerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QuestionAndAnswerPage]
})
export class QuestionAndAnswerPageModule {}
