import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Dictionary } from '../../helpers/dictionary';
import { QuestionAndAnswer } from '../../interfaces/question-and-answer';
import { Router } from '@angular/router';
import { QuestionAndAnswerService } from '../../services/question-and-answer.service';
import { Constants } from '../../helpers/constants';
import { UtilitiesService } from '../../services/utilities.service';
import { IntroConstants } from '../../helpers/introConstants';
import { ShowIntroService } from '../../services/show-intro.service';

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
  isIntro = false;

  constructor(
    private modalController: ModalController,
    private questionAndAnswerService: QuestionAndAnswerService,
    private router: Router,
    private constants: Constants,
    private util: UtilitiesService,
    private introConstants: IntroConstants,
    private showIntroService: ShowIntroService
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

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.QnA);

    // google analytics
    this.util.trackEvent(
      this.constants.pageName.QnA,
      'view_list_general_tanya_jawab',
      '',
      1
    );
  }

  ionViewDidEnter() {
    this.isIntro = JSON.parse(
      localStorage.getItem(this.introConstants.introStorages.questionAndAnswer)
    );

    if (!this.isIntro) {
      this.showIntro();
    }
  }

  private showIntro() {
    this.showIntroService.finalStepQnA.subscribe((state: boolean) => {
      if (state === true) {
        this.showIntroService.showIntroQnA(
          3,
          this.introConstants.stepQuestionAndAnswer3,
          'app-question-and-answer',
          this.introConstants.introStorages.questionAndAnswer
        );
      } else {
        this.showIntroService.showIntroQnA(
          1,
          this.introConstants.stepQuestionAndAnswer1,
          'app-question-and-answer'
        );
      }
    });
  }

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
    this.questionAndAnswerService.showModalAddQnA();
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

      // google analytics
      this.util.trackEvent(
        this.constants.pageName.QnA,
        'unlike_tanya_jawab',
        this.dataQnA[index].text,
        1
      );
    } else {
      this.dataQnA[index].likes_count = this.dataQnA[index].likes_count + 1;
      this.dataQnA[index].is_liked = true;

      // google analytics
      this.util.trackEvent(
        this.constants.pageName.QnA,
        'like_tanya_jawab',
        this.dataQnA[index].text,
        1
      );
    }

    // save like to server
    this.questionAndAnswerService.PostLiked(id).subscribe();
  }
}
