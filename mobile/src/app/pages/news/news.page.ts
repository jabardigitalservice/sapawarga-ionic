import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';
import { Dictionary } from '../../helpers/dictionary';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
  ) {
    this.dataNews = [];
  }

  ngOnInit() {
    // get data id kab kota
    this.route.queryParamMap.subscribe(params => {
      console.log(params);
    });

    this.getListFeatured();
    this.getListNews();
  }

  ionViewWillLeave() {
    this.currentPage = 1;
  }

  getListFeatured() {
    this.newsService.getNewsFeatured().subscribe(
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

  async getListNews(infiniteScroll?) {
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

    this.newsService.getListNews(this.currentPage).subscribe(
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
