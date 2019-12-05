import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QuestionAndAnswerFormComponent } from '../../shared/question-and-answer-form/question-and-answer-form.component';
import { QuestionAndAnswerService } from '../../services/question-and-answer.service';

@Component({
  selector: 'app-question-and-answer',
  templateUrl: './question-and-answer.page.html',
  styleUrls: ['./question-and-answer.page.scss']
})
export class QuestionAndAnswerPage implements OnInit {
  constructor(
    private modalController: ModalController,
    private questionAndAnswerService: QuestionAndAnswerService
  ) {}

  ngOnInit() {}

  ionViewWillLeave() {
    // this.events.unsubscribe('chat:received');
    this.questionAndAnswerService.clearNewLocalQnA();
  }

  async showModalAddQnA() {
    const modal = await this.modalController.create({
      component: QuestionAndAnswerFormComponent
    });
    return await modal.present();
  }
}
