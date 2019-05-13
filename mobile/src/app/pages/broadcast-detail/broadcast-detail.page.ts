import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-broadcast-detail',
  templateUrl: './broadcast-detail.page.html',
  styleUrls: ['./broadcast-detail.page.scss']
})
export class BroadcastDetailPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  // Called when view is left
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.navCtrl.navigateForward('/tabs/broadcasts');
  }

  backButton() {
    this.navCtrl.navigateForward('/tabs/broadcasts');
  }
}
