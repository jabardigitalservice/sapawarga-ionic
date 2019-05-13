import { Component, OnInit } from '@angular/core';
import records from '../../../assets/aspirasi-list';

@Component({
  selector: 'app-aspirasi',
  templateUrl: './aspirasi.page.html',
  styleUrls: ['./aspirasi.page.scss'],
})
export class AspirasiPage implements OnInit {
  records: [];

  constructor() {
    this.records = records;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    console.log(this.records);
  }
}
