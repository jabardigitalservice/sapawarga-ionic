import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import records from '../../../assets/data/aspirasi-list';

@Component({
  selector: 'app-aspirasi',
  templateUrl: './aspirasi.page.html',
  styleUrls: ['./aspirasi.page.scss'],
})
export class AspirasiPage implements OnInit {
  records: [];

  constructor(
      private router: Router
  ) {
    this.records = records;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    console.log(this.records);
  }

  // go to detail broadcast with param id
  goDetail(id: number) {
    this.router.navigate(['/aspirasi', id]);
  }
}
