import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { Constants } from 'src/app/helpers/constants';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-did-not-register',
  templateUrl: './did-not-register.component.html',
  styleUrls: ['./did-not-register.component.scss']
})
export class DidNotRegisterComponent implements OnInit {
  message: string;
  constructor(
    private util: UtilitiesService,
    private constants: Constants,
    private navParams: NavParams
  ) {
    this.message = this.navParams.get('message');
  }

  ngOnInit() {}

  dismiss() {
    this.util.dismissModal();
  }

  callAdmin(name: string) {
    this.util.trackEvent(
      this.constants.pageName.help,
      `tapped_view_${name}_admin_Bantuan`,
      '',
      1
    );
  }
}
