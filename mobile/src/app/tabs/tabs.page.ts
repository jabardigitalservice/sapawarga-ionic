import { Component, ChangeDetectorRef } from '@angular/core';
import { BroadcastService } from '../services/broadcast.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  notification = false;
  constructor(
    private broadcastService: BroadcastService,
    private ref: ChangeDetectorRef
  ) {
    // listen and render component
    setInterval(() => {
      this.ref.markForCheck();
    }, 2000);

    this.broadcastService.notificationState.subscribe(state => {
      this.notification = state;
    });
  }
}
