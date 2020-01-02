import { Component, OnInit } from '@angular/core';
import { UserPostService } from '../../services/user-post.service';
import { UserPost } from '../../interfaces/user-post';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activity-rw-detail',
  templateUrl: './activity-rw-detail.page.html',
  styleUrls: ['./activity-rw-detail.page.scss']
})
export class ActivityRwDetailPage implements OnInit {
  dataUserPost: UserPost;
  dataUserPostComents: UserPost[];
  dataEmpty = false;
  isLoading = false;
  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(
    private userPostService: UserPostService,
    private route: ActivatedRoute,
    private util: UtilitiesService,
    private constants: Constants
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.getDetailUserPost(id);
      this.getListComments(id);
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

  getListComments(id: number) {
    // check internet
    if (!navigator.onLine) {
      return;
    }

    this.dataEmpty = false;

    this.isLoading = true;

    this.userPostService.getListComments(id).subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataUserPostComents = res['data']['items'];
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
}
