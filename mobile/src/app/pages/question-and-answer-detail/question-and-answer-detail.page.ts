import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Events, IonContent } from '@ionic/angular';
import { QuestionAndAnswer } from '../../interfaces/question-and-answer';
import { Dictionary } from '../../helpers/dictionary';
import { QuestionAndAnswerService } from '../../services/question-and-answer.service';
import { Constants } from '../../helpers/constants';
import { UtilitiesService } from '../../services/utilities.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question-and-answer-detail',
  templateUrl: './question-and-answer-detail.page.html',
  styleUrls: ['./question-and-answer-detail.page.scss']
})
export class QuestionAndAnswerDetailPage implements OnInit {
  @ViewChild('content') content: IonContent;
  @ViewChild('chat_input') messageInput: ElementRef;

  dataQnA: QuestionAndAnswer;
  dataCommentsQnA: QuestionAndAnswer[];
  dataEmpty = false;
  isLoading = false;
  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    private events: Events,
    private questionAndAnswerService: QuestionAndAnswerService,
    private constants: Constants,
    private util: UtilitiesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.getDetailQnA(id);
      this.getListCommentsQnA(id);
    });
  }

  scrollToBottom() {
    this.content.scrollToBottom(100);
  }

  ionViewWillLeave() {
    this.events.unsubscribe('chat:received');
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  logScrollStart() {
    document.getElementById('chat-parent');
  }

  logScrolling(event) {}

  async getDetailQnA(id: number) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    this.dataQnA = null;
    this.isLoading = true;

    this.questionAndAnswerService.getDetailQnA(id).subscribe(
      res => {
        if (res['status'] === 200) {
          this.dataQnA = res['data'];

          // google event analytics
          this.util.trackEvent(
            this.constants.pageName.QnA,
            'view_detail_tanya_jawab',
            this.dataQnA.text,
            1
          );
        }
        this.isLoading = false;
      },
      err => {
        if (err.status === 404) {
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty
          };
        } else if (err.name === 'TimeoutError') {
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

  getListCommentsQnA(id: number) {
    // check internet
    if (!navigator.onLine) {
      return;
    }

    this.dataEmpty = false;

    this.isLoading = true;

    this.questionAndAnswerService.getListCommentQnA(id).subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataCommentsQnA = res['data']['items'];
        } else {
          this.dataEmpty = true;
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.polling_empty
          };
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

  doLike(id: number, isLiked: boolean) {
    if (isLiked === true) {
      this.dataQnA.likes_count = this.dataQnA.likes_count - 1;
      this.dataQnA.is_liked = false;

      // google analytics
      this.util.trackEvent(
        this.constants.pageName.QnA,
        'unlike_tanya_jawab',
        this.dataQnA.text,
        1
      );
    } else {
      this.dataQnA.likes_count = this.dataQnA.likes_count + 1;
      this.dataQnA.is_liked = true;

      // google analytics
      this.util.trackEvent(
        this.constants.pageName.QnA,
        'like_tanya_jawab',
        this.dataQnA.text,
        1
      );
    }

    // save like to server
    this.questionAndAnswerService.PostLiked(id).subscribe();
  }
}
