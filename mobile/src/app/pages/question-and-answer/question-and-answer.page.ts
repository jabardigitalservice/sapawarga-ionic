import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Dictionary } from '../../helpers/dictionary';
import { QuestionAndAnswer } from '../../interfaces/question-and-answer';
import { Router } from '@angular/router';
import { QuestionAndAnswerFormComponent } from '../../shared/question-and-answer-form/question-and-answer-form.component';
import { QuestionAndAnswerService } from '../../services/question-and-answer.service';

@Component({
  selector: 'app-question-and-answer',
  templateUrl: './question-and-answer.page.html',
  styleUrls: ['./question-and-answer.page.scss']
})
export class QuestionAndAnswerPage implements OnInit {
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
    private modalController: ModalController,
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

  ionViewWillEnter() {
    this.getListQnA();
  }

  ngOnInit() {}

  ionViewWillLeave() {
    this.dataEmpty = false;
    this.isLoading = false;
    this.msgResponse = {
      type: '',
      msg: ''
    };
    this.currentPage = 1;
    this.isNewQnA = false;

    this.questionAndAnswerService.clearNewLocalQnA();
  }

  async showModalAddQnA() {
    const modal = await this.modalController.create({
      component: QuestionAndAnswerFormComponent
    });
    return await modal.present();
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
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

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

  doLike(index: number, id: number, isLiked: boolean) {
    if (isLiked === true) {
      this.dataQnA[index].likes_count = this.dataQnA[index].likes_count - 1;
      this.dataQnA[index].is_liked = false;
    } else {
      this.dataQnA[index].likes_count = this.dataQnA[index].likes_count + 1;
      this.dataQnA[index].is_liked = true;
    }

    // save like to server
    this.questionAndAnswerService.PostLiked(id).subscribe(
      res => {},
      err => {}
    );
  }
}
