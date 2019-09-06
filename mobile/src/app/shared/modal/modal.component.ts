import { Component, OnInit } from '@angular/core';
import { Dictionary } from '../../helpers/dictionary';
import { Constants } from '../../helpers/constants';
// import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  msgApdate = Dictionary.msg_update_app;

  constructor(
    private constants: Constants // private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  updateApp() {
    // this.util.launchApp(this.constants.appID);
    // this.modalCtrl.dismiss({ dismissed: true });
  }
}
