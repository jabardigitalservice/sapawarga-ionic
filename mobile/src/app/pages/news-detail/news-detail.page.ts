import { Component, OnInit } from '@angular/core';

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
  constructor() {}

  ngOnInit() {}
}
