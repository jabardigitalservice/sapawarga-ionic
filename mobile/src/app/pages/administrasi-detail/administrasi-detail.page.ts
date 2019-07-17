import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import records from '../../../assets/data/administrasi';

@Component({
  selector: 'app-administrasi-detail',
  templateUrl: './administrasi-detail.page.html',
  styleUrls: ['./administrasi-detail.page.scss']
})
export class AdministrasiDetailPage implements OnInit {
  id: number;
  record = {};

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.getData(this.id);
  }

  getData(id) {
    this.record = records[id - 1];
  }

  goToInstantion(name: string) {
    this.router.navigate([
      '/nomor-penting',
      `by-user-location?instansi=${name}`
    ]);
  }
}
