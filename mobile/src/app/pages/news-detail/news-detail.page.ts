import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from '../../helpers/dictionary';
import { LoadingController, NavController } from '@ionic/angular';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss']
})
export class NewsDetailPage implements OnInit {
  dummyHeadlines = [
    {
      id: 1,
      title: 'Pose Ridwan Kamil Mejeng di Depan Mobil klasik VW',
      image: 'assets/img/aspirasi/aspirasi2.jpg',
      source: 'detik.com'
    },
    {
      id: 2,
      title: 'Pose Ridwan Kamil Mejeng di Depan Mobil klasik VW',
      image: 'assets/img/aspirasi/aspirasi1.jpg',
      source: 'detik.com'
    },
    {
      id: 3,
      title: 'Pose Ridwan Kamil Mejeng di Depan Mobil klasik VW',
      image: 'assets/img/aspirasi/aspirasi3.jpg',
      source: 'detik.com'
    }
  ];

  isLoading = false;

  dataNews: News;
  dataFeatured: News[];
  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private loadingCtrl: LoadingController,
    public util: UtilitiesService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getDetailNews(params['id']);
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

    this.newsService.getNewsFeatured(2).subscribe(
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
    this.getDetailNews(id);
  }
}
