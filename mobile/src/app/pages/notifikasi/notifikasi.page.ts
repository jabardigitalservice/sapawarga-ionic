import { ActivatedRoute } from '@angular/router';
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
  interval: any;

  constructor(
    private notifikasiService: NotifikasiService,
    private route: ActivatedRoute,
    public navCtrl: NavController
  ) {
    this.records = records;
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.dataNotifikasi = this.notifikasiService.getLocalNotifikasi() || [];

    // listen and render component
    this.interval = setInterval(() => {
      this.dataNotifikasi = this.notifikasiService.getLocalNotifikasi() || [];
    }, 3000);
  }

  ionViewWillLeave() {
    window.clearInterval(this.interval);
  }

  goToDetail(target) {
    this.navCtrl.navigateForward(target);
  }
}
