import { Component, OnInit, ViewChild } from '@angular/core';
import { UserPostService } from '../../services/user-post.service';
import { UserPost } from '../../interfaces/user-post';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';
import { ActivatedRoute } from '@angular/router';
import { Profile } from '../../interfaces/profile';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-activity-rw-detail',
  templateUrl: './activity-rw-detail.page.html',
  styleUrls: ['./activity-rw-detail.page.scss']
})
export class ActivityRwDetailPage implements OnInit {
  @ViewChild('content') private content: any;
  dataUserPost: UserPost;
  dataUserPostComents: UserPost[];
  dataProfile: Profile;
  dataEmpty = false;
  isLoading = false;
  msgResponse = {
    type: '',
    msg: ''
  };
  inputComment: string;

  currentPage = 1;
  maximumPages: number;
  idUserPost: number;

  constructor(
    private userPostService: UserPostService,
    private route: ActivatedRoute,
    private util: UtilitiesService,
    private constants: Constants,
    private profileService: ProfileService
  ) {
    this.profileService.currentUser.subscribe((state: Profile) => {
      this.dataProfile = state;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idUserPost = params['id'];

      this.getDetailUserPost(this.idUserPost);
      this.getListComments(this.idUserPost);
    });
  }

  async getDetailUserPost(id: number) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    this.dataUserPost = null;
    this.isLoading = true;

    this.userPostService.getDetailUserPost(id).subscribe(
      res => {
        if (res['status'] === 200) {
          this.dataUserPost = res['data'];

          // google event analytics
          this.util.trackEvent(
            this.constants.pageName.postRW,
            'view_detail_post_rw',
            this.dataUserPost.text,
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

  getListComments(id: number, infiniteScroll?) {
    // check internet
    if (!navigator.onLine) {
      if (infiniteScroll) {
        infiniteScroll.target.complete();
      }
      return;
    }

    if (!infiniteScroll) {
      this.isLoading = true;
    } else {
      this.dataEmpty = false;
    }

    this.userPostService.getListComments(id, this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          if (infiniteScroll) {
            this.dataUserPostComents = this.dataUserPostComents.concat(
              res['data']['items']
            );
          } else {
            this.dataUserPostComents = res['data']['items'];
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

  /**
   *
   *
   * @param {number} id
   * @param {boolean} isLiked
   * @memberof ActivityRwDetailPage
   */
  doLike(id: number, isLiked: boolean) {
    if (isLiked === true) {
      this.dataUserPost.likes_count = this.dataUserPost.likes_count - 1;
      this.dataUserPost.is_liked = false;

      // google analytics
      this.util.trackEvent(
        this.constants.pageName.postRW,
        'unlike_post_rw',
        this.dataUserPost.text,
        1
      );
    } else {
      this.dataUserPost.likes_count = this.dataUserPost.likes_count + 1;
      this.dataUserPost.is_liked = true;

      // google analytics
      this.util.trackEvent(
        this.constants.pageName.postRW,
        'like_post_rw',
        this.dataUserPost.text,
        1
      );
    }

    // save like to server
    this.userPostService.PostLiked(id).subscribe();
  }

  sendComment() {
    if (!this.inputComment) {
      return;
    }

    // data send to server
    const bodyPost = {
      user_post_id: this.dataUserPost.id,
      text: this.inputComment,
      status: 10
    };

    // data local
    const dataNewComment: any = {
      id: this.dataUserPost.id,
      text: this.inputComment,
      user: {
        id: this.dataProfile.id,
        name: this.dataProfile.name,
        photo_url_full: this.dataProfile.photo_url
      },
      created_at: Date.now().valueOf() / 1000
    };

    // insert new comment to list comments
    this.dataUserPostComents.push(dataNewComment);

    // set null input text
    this.inputComment = null;
    setTimeout(() => {
      this.content.scrollToBottom(100);
    }, 10);

    this.userPostService.PostComment(bodyPost).subscribe(
      res => {
        if (res['success'] === true) {
          // google event analytics
          this.util.trackEvent(
            this.constants.pageName.postRW,
            'create_comment_post_rw',
            `${this.dataProfile.name}: ${this.inputComment}`,
            1
          );
        } else {
          this.util.alertConfirmation(Dictionary.terjadi_kesalahan, ['OK']);
        }
      },
      _ => {
        this.util.alertConfirmation(Dictionary.terjadi_kesalahan, ['OK']);
      }
    );
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
      this.getListComments(this.idUserPost, event);
    }, 2000);
  }
}
