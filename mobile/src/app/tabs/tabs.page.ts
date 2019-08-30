import { Component, ChangeDetectorRef } from '@angular/core';
import { BroadcastService } from '../services/broadcast.service';
import { Broadcast } from '../interfaces/broadcast';
import { UtilitiesService } from '../services/utilities.service';
import { Constants } from '../helpers/constants';
import { ProfileService } from '../services/profile.service';
import { Profile } from '../interfaces/profile';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  notification = false;
  dataRead = [];
  dataBroadcast: Broadcast[];
  idUser: number;

  constructor(
    private broadcastService: BroadcastService,
    private ref: ChangeDetectorRef,
    private util: UtilitiesService,
    public constants: Constants,
    private profileService: ProfileService
  ) {
    // get id user using BehaviorSubject
    this.profileService.currentUser.subscribe((state: Profile) => {
      this.idUser = state.id;
    });

    // get data broadcast
    this.getBroadcasts();

    // listen and render component
    setInterval(() => {
      this.ref.markForCheck();
    }, 2000);

    this.broadcastService.notificationState.subscribe(state => {
      this.notification = state;
    });
  }

  ionViewDidEnter() {
    // check if length data broadCast === dataRead
    this.checkLenghtRead();
  }

  checkLenghtRead() {
    // get data read broadcast from local
    const readBroastcast = this.broadcastService.getBroadcast() || [];

    // get data broadcast from local
    this.dataBroadcast = this.broadcastService.getLocalBroadcast() || [];

    if (readBroastcast.length) {
      readBroastcast.forEach((dataRead: any) => {
        if (dataRead.iduser === this.idUser) {
          // check is current user
          this.dataRead.push(dataRead);

          // active icon notification when data read is empty
          if (this.dataRead.length === this.dataBroadcast.length) {
            this.broadcastService.setNotification(false);
          } else {
            // active icon notification true
            this.broadcastService.setNotification(true);
          }
        } else {
          // data read local != iduser
          this.broadcastService.setNotification(false);
        }
      });
    } else if (!this.dataRead.length && this.dataBroadcast.length) {
      // active icon notification when data read is empty
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

  // get data broadcasts
  async getBroadcasts() {
    // check internet
    if (!navigator.onLine) {
      return;
    }
    this.broadcastService.getListBroadCasts().subscribe(
      res => {
        if (res['data']['items'].length) {
          this.dataBroadcast = res['data']['items'];

          // save to local
          this.broadcastService.saveLocalBroadcast(this.dataBroadcast);
        }
      },
      _ => {}
    );
  }
}
