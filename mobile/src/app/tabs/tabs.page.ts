import { Component, ChangeDetectorRef } from '@angular/core';
import { BroadcastService } from '../services/broadcast.service';
import { Broadcast } from '../interfaces/broadcast';
import { UtilitiesService } from '../services/utilities.service';
import { Constants } from '../helpers/constants';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  notification = false;
  dataRead = [];
  dataBroadcast: Broadcast[];
  constructor(
    private broadcastService: BroadcastService,
    private ref: ChangeDetectorRef,
    private util: UtilitiesService,
    public constants: Constants
  ) {
    // check if length data broadCast === dataRead
    this.checkLenghtRead();

    // listen and render component
    setInterval(() => {
      this.ref.markForCheck();
    }, 2000);

    this.broadcastService.notificationState.subscribe(state => {
      this.notification = state;
    });
  }

  checkLenghtRead() {
    // get data read broadcast
    this.dataRead = this.broadcastService.getBroadcast() || [];

    // get data broadcast from local
    this.dataBroadcast = this.broadcastService.getLocalBroadcast() || [];

    if (this.dataRead.length === this.dataBroadcast.length) {
      this.broadcastService.setNotification(false);
    } else {
      this.broadcastService.setNotification(true);
    }
  }

  eventTapped(name: string) {
    let action: string;

    switch (name) {
      case 'home':
        action = 'tapped_home';
        break;
      case 'broadcast':
        action = 'tapped_broadcast';
        break;
      case 'help':
        action = 'tapped_bantuan';
        break;
      case 'account':
        action = 'tapped_akun';
        break;
      default:
        return;
        break;
    }

    // google event analytics
    this.util.trackEvent(this.constants.pageName.home_pages, action, '', 1);
  }
}
