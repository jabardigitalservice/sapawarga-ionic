import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';
import { Dictionary } from '../../helpers/dictionary';
import { Profile } from '../../interfaces/profile';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { Constants } from '../../helpers/constants';
import { NavController, IonSlides } from '@ionic/angular';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-news-featured',
  templateUrl: './news-featured.component.html',
  styleUrls: ['./news-featured.component.scss']
})
export class NewsFeaturedComponent implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  NEWS = 'news-headlines';
  NEWS_KABKOTA = 'news-kabkota-headlines';

  data_profile: Profile;
  dataNews: News[];
  dataNewsKabkota: News[];

  sliderConfigNews = {
    slidesPerView: 1.3,
    spaceBetween: 5,
    zoom: false
  };

  isLoading = {
    news: false,
    newsKabkota: false
  };

  msgResponse = {
    type: '',
    msg: ''
  };
  constructor(
    private newsService: NewsService,
    private profileService: ProfileService,
    private router: Router,
    private constants: Constants,
    private util: UtilitiesService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.getNewsFeatured();

    // get data user using BehaviorSubject
    this.profileService.currentUser.subscribe((state: Profile) => {
      this.data_profile = state;
      this.getNewsFeatured(this.data_profile.kabkota_id);
    });
  }

  getNewsFeatured(idkabkota?: number) {
    // check internet
    if (!navigator.onLine) {
      // get local
      if (this.newsService.getLocal(this.NEWS) && !idkabkota) {
        this.dataNews = JSON.parse(this.newsService.getLocal(this.NEWS));
      } else if (this.newsService.getLocal(this.NEWS_KABKOTA) && idkabkota) {
        this.dataNewsKabkota = JSON.parse(
          this.newsService.getLocal(this.NEWS_KABKOTA)
        );
      } else {
        alert(Dictionary.offline);
      }
      return;
    }

    if (idkabkota) {
      this.isLoading.newsKabkota = true;
    } else {
      this.isLoading.news = true;
    }

    this.newsService.getNewsFeatured(3, idkabkota).subscribe(
      res => {
        if (res['status'] === 200 && res['data'].length) {
          if (idkabkota) {
            this.dataNewsKabkota = res['data'];
          } else {
            this.dataNews = res['data'];
          }

          // save to local
          if (idkabkota) {
            this.newsService.saveLocal(this.NEWS_KABKOTA, this.dataNewsKabkota);
          } else {
            this.newsService.saveLocal(this.NEWS, this.dataNews);
          }

          if (idkabkota) {
            this.isLoading.newsKabkota = false;
          } else {
            this.isLoading.news = false;
          }
        }
      },
      err => {
        // get local
        if (this.newsService.getLocal(this.NEWS) && !idkabkota) {
          this.dataNews = JSON.parse(this.newsService.getLocal(this.NEWS));
        } else if (this.newsService.getLocal(this.NEWS_KABKOTA) && idkabkota) {
          this.dataNewsKabkota = JSON.parse(
            this.newsService.getLocal(this.NEWS_KABKOTA)
          );
        } else {
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
        }

        if (idkabkota) {
          this.isLoading.newsKabkota = false;
        } else {
          this.isLoading.news = false;
        }
      }
    );
  }

  goToNews(id?: number, kabkota?: string) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    if (this.isLoading.news) {
      alert(Dictionary.terjadi_kesalahan);
      return;
    }
    if (id) {
      this.router.navigate(['news'], {
        queryParams: { id: id }
      });

      // transform Kabkota remove whitespace & transform to lower case
      const transformKabkota = kabkota.replace(/\s/g, '').toLowerCase();

      // google event analytics
      this.util.trackEvent(
        this.constants.pageName.news,
        `view_list_${transformKabkota}_news`,
        '',
        1
      );

      this.util.trackEvent(
        this.constants.pageName.home_pages,
        `tapped_view_all_${transformKabkota}_news`,
        '',
        1
      );
    } else {
      this.navCtrl.navigateForward('news');

      // google event analytics
      this.util.trackEvent(
        this.constants.pageName.news,
        'view_list_jabar_news',
        '',
        1
      );

      this.util.trackEvent(
        this.constants.pageName.home_pages,
        'tapped_view_all_jabar_news',
        '',
        1
      );
    }
  }

  goToDetailNews(id: number, title: string) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }
    this.router.navigate(['/news', id]);

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_detail_news',
      title,
      1
    );
  }

  swipeSlide() {
    const action = 'swipe_news';

    this.slides.getActiveIndex().then(_ => {
      // google event analytics
      this.util.trackEvent(this.constants.pageName.home_pages, action, '', 1);
    });
  }
}
