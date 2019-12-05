import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuestionAndAnswerPage } from './question-and-answer.page';
import { SharedModule } from '../../shared/shared.module';
import { QuestionAndAnswerFormComponent } from '../../shared/question-and-answer-form/question-and-answer-form.component';

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
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [QuestionAndAnswerPage, QuestionAndAnswerFormComponent],
  entryComponents: [QuestionAndAnswerFormComponent]
})
export class QuestionAndAnswerPageModule {}
