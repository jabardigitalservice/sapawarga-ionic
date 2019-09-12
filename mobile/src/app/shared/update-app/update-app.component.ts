import { Component, OnInit } from '@angular/core';
import { Dictionary } from '../../helpers/dictionary';
import { Constants } from '../../helpers/constants';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-update-app',
  templateUrl: './update-app.component.html',
  styleUrls: ['./update-app.component.scss']
})
export class UpdateAppComponent implements OnInit {
  msgApdate = Dictionary.msg_update_app;

  constructor(private constants: Constants) {}

  ngOnInit() {}

  updateApp() {
    window.open(`market://details?id=${this.constants.appID}`, '_system');
    navigator['app'].exitApp();
  }
}
