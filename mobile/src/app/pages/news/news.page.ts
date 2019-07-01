import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';
import { Dictionary } from '../../helpers/dictionary';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss']
})
export class NewsPage implements OnInit {
  dataFeatured: News[];
  dataNews: News[];

  msgResponse = {
    type: '',
    msg: ''
  };

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.getListFeatured();
    this.getListNews();
  }

  getListFeatured() {
    this.newsService.getNewsFeatured().subscribe(
      res => {
        if (res['status'] === 200 && res['data']['items'].length) {
          this.dataFeatured = res['data']['items'];
        } else {
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty_aspirasi
          };
        }
      },
      err => {
        if (err) {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
      }
    );
  }

  getListNews() {
    this.newsService.getListNews().subscribe(
      res => {
        if (res['status'] === 200 && res['data']['items'].length) {
          this.dataNews = res['data']['items'];
        } else {
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.empty_aspirasi
          };
        }
      },
      err => {
        if (err) {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
      }
    );
  }
}
