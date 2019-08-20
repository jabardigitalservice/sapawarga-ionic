import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';
import { Dictionary } from '../../helpers/dictionary';
import { LoadingController } from '@ionic/angular';
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

  constructor(
    private newsService: NewsService,
    private loadingCtrl: LoadingController,
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
    });

    if (this.idKabKota) {
      this.getListFeatured(this.idKabKota);
      this.getListNews(null, this.idKabKota);
    } else {
      this.getListFeatured();
      this.getListNews();
    }
  }

  ionViewWillLeave() {
    this.currentPage = 1;
  }

  getListFeatured(idKabKota?: number) {
    this.newsService.getNewsFeatured(null, idKabKota).subscribe(
      res => {
        if (res['status'] === 200 && res['data']['items'].length) {
          this.dataFeatured = res['data']['items'];

          // set count page
          this.maximumPages = res['data']['_meta'].pageCount;
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

  async getListNews(infiniteScroll?, idKabKota?: number) {
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });

    if (!infiniteScroll) {
      loader.present();
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
            msg: Dictionary.empty_aspirasi
          };
        }
        loader.dismiss();
        // stop infinite scroll
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
      },
      err => {
        loader.dismiss();
        if (err) {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }
      }
    );
  }

  goToDetailNews(id: number) {
    this.router.navigate(['/news', id]);
  }

  // infinite scroll
  doInfinite(event) {
    if (this.currentPage === this.maximumPages) {
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
