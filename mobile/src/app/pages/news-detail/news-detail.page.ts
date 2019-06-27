import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';
import { ActivatedRoute } from '@angular/router';

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

  dataNews: News;
  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getDetailNews(params['id']);
    });
  }

  getDetailNews(id: number) {
    this.newsService.getDetailNews(id).subscribe(
      res => {
        if (res['status'] === 200) {
          this.dataNews = res['data'];
          console.log(this.dataNews);
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
