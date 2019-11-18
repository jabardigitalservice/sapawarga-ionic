import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from '../../helpers/dictionary';
import { NavController } from '@ionic/angular';
import { UtilitiesService } from '../../services/utilities.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Constants } from 'src/app/helpers/constants';

// plugin sosial media
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

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
  isPushNotification = false;
  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    public util: UtilitiesService,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    public constants: Constants,
    private socialSharing: SocialSharing
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idNews = params['id'];
      this.getDetailNews(this.idNews);
    });

    this.route.queryParamMap.subscribe(params => {
      this.isPushNotification = params['params']['isPushNotification'];
    });

    this.getNewsList();
  }

  backButton() {
    this.util.backButton(this.isPushNotification);
  }

  getDetailNews(id: number) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    this.dataNews = null;

    this.newsService.getDetailNews(id).subscribe(
      res => {
        // check if status respon 200 and status news not equal 0
        if (res['status'] === 200 && res['data']['status'] !== 0) {
          this.dataNews = res['data'];

          // google event analytics
          this.util.trackEvent(
            this.constants.pageName.news,
            'view_detail_news',
            this.dataNews.title,
            1
          );
        } else if (res['data']['status'] === 0) {
          this.util.showToast(Dictionary.news_not_found);

          // go back to previous page
          this.backButton();
        }
      },
      err => {}
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

  // open native share social media
  openSosialSharing() {
    this.socialSharing
      .share(
        `${this.dataNews.title}\nBaca selengkapnya: ${this.dataNews.source_url}`,
        '',
        '',
        ''
      )
      .then(() => {
        // google event analytics
        this.util.trackEvent(
          this.constants.pageName.news,
          'share_news',
          this.dataNews.title,
          1
        );
      })
      .catch(() => {
        this.util.showToast(Dictionary.terjadi_kesalahan);
      });
  }
}
