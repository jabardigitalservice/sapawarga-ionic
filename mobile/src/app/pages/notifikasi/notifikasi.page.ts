import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import records from '../../../assets/data/notifikasi';

@Component({
  selector: 'app-notifikasi',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss']
})
export class NotifikasiPage implements OnInit {
  records: [];

  constructor(public navCtrl: NavController) {
    this.records = records;
  }
  ngOnInit() {}

  goToDetail(target) {
    this.navCtrl.navigateForward(target);
  }
}
