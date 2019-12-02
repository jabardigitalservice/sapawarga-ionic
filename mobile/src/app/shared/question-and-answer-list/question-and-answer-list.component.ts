import { Component, OnInit } from '@angular/core';
import { QuestionAndAnswerService } from '../../services/question-and-answer.service';
import { Dictionary } from '../../helpers/dictionary';
import { QuestionAndAnswer } from '../../interfaces/question-and-answer';

@Component({
  selector: 'app-question-and-answer-list',
  templateUrl: './question-and-answer-list.component.html',
  styleUrls: ['./question-and-answer-list.component.scss']
})
export class QuestionAndAnswerListComponent implements OnInit {
  userName = 'Agus tatto';
  dataEmpty = false;
  isLoading = false;
  msgResponse = {
    type: '',
    msg: ''
  };
  dataQnA: QuestionAndAnswer[];
  currentPage = 1;
  maximumPages: number;

  constructor(private questionAndAnswerService: QuestionAndAnswerService) {}

  ngOnInit() {
    this.getListQnA();
  }

  ionViewWillLeave() {
    // this.events.unsubscribe('chat:received');
  }

  getListQnA(infiniteScroll?) {
    // check internet
    if (!navigator.onLine) {
      return;
    }

    this.dataEmpty = false;

    this.isLoading = true;

    if (!infiniteScroll) {
      this.isLoading = true;
    }

    this.questionAndAnswerService.getListQnA(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          if (infiniteScroll) {
            this.dataQnA = this.dataQnA.concat(res['data']['items']);
          } else {
            this.dataQnA = res['data']['items'];
          }

          console.log(this.dataQnA);
          // save to local
          // this.pollingService.saveLocalPolling(this.dataQnA);
        } else {
          this.dataEmpty = true;
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.polling_empty
          };
        }
        // set count page
        this.maximumPages = res['data']['_meta'].pageCount;
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
        this.isLoading = false;
      },
      err => {
        if (err.name === 'TimeoutError') {
          this.msgResponse = {
            type: 'offline',
            msg: Dictionary.offline
          };
        } else {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }

        this.isLoading = false;
      }
    );
  }
}
