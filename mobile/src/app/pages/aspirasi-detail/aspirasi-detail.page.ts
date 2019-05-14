import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import records from '../../../assets/data/aspirasi-list';

@Component({
  selector: 'app-aspirasi-detail',
  templateUrl: './aspirasi-detail.page.html',
  styleUrls: ['./aspirasi-detail.page.scss'],
})
export class AspirasiDetailPage implements OnInit {
  id: number;
  record = {};

  constructor(
      private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.getData(this.id);
  }

  getData(id) {
    this.record = records[id - 1];
  }
}
