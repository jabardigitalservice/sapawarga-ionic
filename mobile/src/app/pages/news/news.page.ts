import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';
import { Dictionary } from '../../helpers/dictionary';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from '../../helpers/constants';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss']
})
export class NewsPage implements OnInit {
  dataFeatured: News[];
  dataNews: News[];
  currentPage = 1;
  maximumPages: number;
  idKabKota = null;

  msgResponse = {
    type: '',
    msg: ''
  };
  isPushNotification = false;
  isLoading = false;

  constructor(
    private newsService: NewsService,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilitiesService,
    private constants: Constants
  ) {
    this.dataNews = [];
  }

  ngOnInit() {
    // google analytics
    this.util.trackPage(this.constants.pageName.news);

    // get data id kab kota
    this.route.queryParamMap.subscribe(params => {
      this.idKabKota = params['params']['id'] ? params['params']['id'] : null;
      this.isPushNotification = params['params']['isPushNotification'];
    });

    if (this.idKabKota) {
      this.getListFeatured(this.idKabKota);
      this.getListNews(null, this.idKabKota);
    } else {
      this.getListFeatured();
      this.getListNews();
    }
  }

  backButton() {
    this.util.backButton(this.isPushNotification);
  }

  ionViewWillLeave() {
    this.currentPage = 1;
  }

  getListFeatured(idKabKota?: number) {
    this.isLoading = true;
    this.newsService.getNewsFeatured(null, idKabKota).subscribe(
      res => {
        if (res['status'] === 200 && res['data'].length) {
          this.dataFeatured = res['data'];
        } else {
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.msg_news
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

  getListNews(infiniteScroll?, idKabKota?: number) {
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    if (!infiniteScroll) {
      this.isLoading = true;
    }

    this.newsService.getListNews(this.currentPage, idKabKota).subscribe(
      res => {
        if (res['data']['items'].length) {
          if (infiniteScroll) {
            this.dataNews = this.dataNews.concat(res['data']['items']);
          } else {
            this.dataNews = res['data']['items'];
          }
        } else {
          this.msgResponse = {
            type: 'empty',
            msg: Dictionary.msg_news
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

  goToDetailNews(id: number) {
    this.router.navigate(['/news', id]);
  }

  // infinite scroll
  doInfinite(event) {
    if (this.currentPage === this.maximumPages || this.maximumPages === 0) {
      event.target.disabled = true;
      return;
    }
    // increase page
    this.currentPage++;

    setTimeout(() => {
      this.getListNews(event);
    }, 2000);
  }
}
