import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss']
})
export class NewsPage implements OnInit {
  dummyData = [
    {
      id: 1,
      title: 'Pose Ridwan Kamil Mejeng terus ',
      image: 'assets/img/aspirasi/aspirasi2.jpg'
    },
    {
      id: 2,
      title: 'Pose Ridwan Kamil Mejeng terus',
      image: 'assets/img/aspirasi/aspirasi2.jpg'
    },
    {
      id: 3,
      title: 'Pose Ridwan Kamil Mejeng terus',
      image: 'assets/img/aspirasi/aspirasi2.jpg'
    },
    {
      id: 4,
      title: 'Pose Ridwan Kamil Mejeng terus',
      image: 'assets/img/aspirasi/aspirasi2.jpg'
    }
  ];
  dataFeatured: News[];
  dataNews: News[];

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.getListFeatured();
    this.getListNews();
  }

  getListFeatured() {
    this.newsService.getNewsFeatured().subscribe(
      res => {
        if (res['status'] === 200) {
          this.dataFeatured = res['data']['items'];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getListNews() {
    this.newsService.getListNews().subscribe(
      res => {
        if (res['status'] === 200) {
          this.dataNews = res['data']['items'];
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
