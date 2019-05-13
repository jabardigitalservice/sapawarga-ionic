import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifikasi',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss']
})
export class NotifikasiPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  goToDetail() {
    console.log('masuk');
  }
}
