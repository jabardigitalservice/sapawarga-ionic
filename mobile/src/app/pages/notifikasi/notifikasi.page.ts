import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Notifikasi } from '../../interfaces/notifikasi';
import { NotifikasiService } from '../../services/notifikasi.service';
import records from '../../../assets/data/notifikasi';

@Component({
  selector: 'app-notifikasi',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss']
})
export class NotifikasiPage implements OnInit {
  dataNotifikasi: Notifikasi[];
  records: [];

  constructor(
    private notifikasiService: NotifikasiService,
    public navCtrl: NavController
  ) {
    this.records = records;
  }

  ngOnInit() {
    this.dataNotifikasi = this.notifikasiService.getLocalNotifikasi() || [];
  }

  goToDetail(target) {
    this.navCtrl.navigateForward(target);
  }
}
