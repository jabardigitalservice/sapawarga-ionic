import { Component, ChangeDetectorRef } from '@angular/core';
import { BroadcastService } from '../services/broadcast.service';
import { Broadcast } from '../interfaces/broadcast';

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
    private ref: ChangeDetectorRef
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
}
