import { Component } from '@angular/core';
import { BroadcastService } from '../services/broadcast.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  notification = false;
  constructor(private broadcastService: BroadcastService) {
    this.notification = this.broadcastService.getNotification();

    this.broadcastService.notificationState.subscribe(state => {
      this.notification = state;
    });
  }
}
