import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from '../../helpers/dictionary';
import { LoadingController, NavController } from '@ionic/angular';
import { UtilitiesService } from '../../services/utilities.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Constants } from 'src/app/helpers/constants';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss']
})
export class NewsDetailPage implements OnInit {
  isLoading = false;
  idNews: number;
  dataNews: News;
  dataFeatured: News[];
  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private loadingCtrl: LoadingController,
    public util: UtilitiesService,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    public constants: Constants
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idNews = params['id'];
      this.getDetailNews(this.idNews);
    });

    this.getNewsList();
  }

  async getDetailNews(id: number) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    this.dataNews = null;

    this.newsService.getDetailNews(id).subscribe(
      res => {
        if (res['status'] === 200) {
          this.dataNews = res['data'];
        }
        loader.dismiss();
      },
      err => {
        loader.dismiss();
      }
    );
  }

  getNewsList() {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    this.isLoading = true;

    this.newsService.getListRelated(this.idNews, 2).subscribe(
      res => {
        if (res['status'] === 200) {
          this.dataFeatured = res['data']['items'];
        }
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  goToListNews() {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }
    this.navCtrl.navigateForward('news');
  }

  goToDetail(id: number) {
    this.idNews = id;
    this.getDetailNews(id);
    this.getNewsList();
  }

  source_url(url: string) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    const target = '_self';
    this.iab.create(url, target, this.constants.inAppBrowserOptions);
  }
}
