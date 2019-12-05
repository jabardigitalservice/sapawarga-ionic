import { Component, OnInit } from '@angular/core';
import { QuestionAndAnswerService } from '../../services/question-and-answer.service';
import { Dictionary } from '../../helpers/dictionary';
import { QuestionAndAnswer } from '../../interfaces/question-and-answer';
import { Router } from '@angular/router';

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
  isNewQnA = false;
  dataNewQnA: QuestionAndAnswer;

  constructor(
    private questionAndAnswerService: QuestionAndAnswerService,
    private router: Router
  ) {
    // get data user using BehaviorSubject
    this.questionAndAnswerService.isNewQnA.subscribe(
      (state: QuestionAndAnswer) => {
        this.dataNewQnA = state;
      }
    );
  }

  ngOnInit() {
    this.getListQnA();
  }

  ionViewWillLeave() {
    // this.events.unsubscribe('chat:received');
  }

  getListQnA(infiniteScroll?) {
    // check internet
    if (!navigator.onLine) {
      if (infiniteScroll) {
        infiniteScroll.target.complete();
      }
      return;
    }

    this.dataEmpty = false;

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

  detailQnA(id: number) {
    this.router.navigate(['/question-and-answer', id]);
  }

  // infinite scroll
  doInfinite(event: any) {
    if (this.currentPage === this.maximumPages) {
      event.target.disabled = true;
      return;
    }
    // increase page
    this.currentPage++;

    setTimeout(() => {
      this.getListQnA(event);
    }, 2000);
  }
}
