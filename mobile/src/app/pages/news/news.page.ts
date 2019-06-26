import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss']
})
export class NewsPage implements OnInit {
  dummyData = [
    {
      id: 1,
      title: 'Pose Ridwan Kamil Mejeng ',
      image: 'assets/img/aspirasi/aspirasi2.jpg'
    },
    {
      id: 2,
      title: 'Pose Ridwan Kamil Mejeng ',
      image: 'assets/img/aspirasi/aspirasi2.jpg'
    },
    {
      id: 3,
      title: 'Pose Ridwan Kamil Mejeng ',
      image: 'assets/img/aspirasi/aspirasi2.jpg'
    },
    {
      id: 4,
      title: 'Pose Ridwan Kamil Mejeng ',
      image: 'assets/img/aspirasi/aspirasi2.jpg'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
