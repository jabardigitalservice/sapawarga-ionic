import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Events, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-question-and-answer',
  templateUrl: './question-and-answer.page.html',
  styleUrls: ['./question-and-answer.page.scss']
})
export class QuestionAndAnswerPage implements OnInit {
  userName = 'Agus tatto';
  constructor() {}

  ngOnInit() {}

  ionViewWillLeave() {
    // this.events.unsubscribe('chat:received');
  }
}
