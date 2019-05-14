import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import records from '../../../assets/data/administrasi';

@Component({
  selector: 'app-administrasi-detail',
  templateUrl: './administrasi-detail.page.html',
  styleUrls: ['./administrasi-detail.page.scss'],
})
export class AdministrasiDetailPage implements OnInit {
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
