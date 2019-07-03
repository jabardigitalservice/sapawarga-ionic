import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from '../../helpers/dictionary';
import { LoadingController } from '@ionic/angular';

// plugin moment date
import * as moment from 'moment';
// import 'moment/locale/pt-br';

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
  dataListNews: News[];
  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    const date = '2019-04-09 02:57:00';
    console.log(moment(date).fromNow()); // pt-BR

    this.route.params.subscribe(params => {
      this.getDetailNews(params['id']);
    });

    this.getNewsList();
  }

  async getDetailNews(id: number) {
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

    this.newsService.getListNews(1).subscribe(
      res => {
        if (res['status'] === 200) {
          this.dataListNews = res['data']['items'];
        }
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  goToDetail(id: number) {
    this.getDetailNews(id);
  }
}
