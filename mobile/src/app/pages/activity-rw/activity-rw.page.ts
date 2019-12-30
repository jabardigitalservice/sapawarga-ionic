import { Component, OnInit } from '@angular/core';
import { UserPost } from 'src/app/interfaces/user-post';
import { UserPostService } from '../../services/user-post.service';
import { Dictionary } from 'src/app/helpers/dictionary';

@Component({
  selector: 'app-activity-rw',
  templateUrl: './activity-rw.page.html',
  styleUrls: ['./activity-rw.page.scss']
})
export class ActivityRwPage implements OnInit {
  dataEmpty = false;
  isLoading = false;
  msgResponse = {
    type: '',
    msg: ''
  };
  dataUserPosts: UserPost[];
  currentPage = 1;
  maximumPages: number;
  isNewUserPost = false;

  constructor(private userPostService: UserPostService) {}

  ngOnInit() {
    this.getListUserPosts();
  }

  getListUserPosts(infiniteScroll?) {
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

    this.userPostService.getListUserPosts(this.currentPage).subscribe(
      res => {
        if (res['data']['items'].length) {
          if (infiniteScroll) {
            this.dataUserPosts = this.dataUserPosts.concat(
              res['data']['items']
            );
          } else {
            this.dataUserPosts = res['data']['items'];
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

  // infinite scroll
  doInfinite(event: any) {
    if (this.currentPage === this.maximumPages) {
      event.target.disabled = true;
      return;
    }
    // increase page
    this.currentPage++;

    setTimeout(() => {
      this.getListUserPosts(event);
    }, 2000);
  }
}
