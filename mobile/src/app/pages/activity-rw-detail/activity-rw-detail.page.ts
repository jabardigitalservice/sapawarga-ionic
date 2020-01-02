import { Component, OnInit } from '@angular/core';
import { UserPostService } from '../../services/user-post.service';
import { UserPost } from 'src/app/interfaces/user-post';
import { Dictionary } from 'src/app/helpers/dictionary';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Constants } from 'src/app/helpers/constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activity-rw-detail',
  templateUrl: './activity-rw-detail.page.html',
  styleUrls: ['./activity-rw-detail.page.scss']
})
export class ActivityRwDetailPage implements OnInit {
  dataUserPost: UserPost;
  // dataCommentsQnA: UserPost[];
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
      // this.getListCommentsQnA(id);
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

          console.log(this.dataUserPost);
          // google event analytics
          // this.util.trackEvent(
          //   this.constants.pageName.QnA,
          //   'view_detail_tanya_jawab',
          //   this.dataUserPost.text,
          //   1
          // );
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
}
