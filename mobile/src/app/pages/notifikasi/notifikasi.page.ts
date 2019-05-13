import { Component, OnInit } from '@angular/core';
import records from '../../../assets/data/notifikasi';

@Component({
  selector: 'app-notifikasi',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss']
})
export class NotifikasiPage implements OnInit {
  records: [];

  constructor() {
    this.records = records;
  }
  ngOnInit() {}

  goToDetail() {
    console.log('masuk');
  }
}
