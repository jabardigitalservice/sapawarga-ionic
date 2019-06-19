import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notifikasi } from '../interfaces/notifikasi';

const NOTIFIKASI = 'notifikasi';
@Injectable({
  providedIn: 'root'
})
export class NotifikasiService {
  notifikasiState = new BehaviorSubject(false);

  constructor() {}

  saveLocalNotifikasi(data: string) {
    localStorage.setItem(NOTIFIKASI, data);
  }

  getLocalNotifikasi() {
    let localNotifikasi = localStorage.getItem(NOTIFIKASI);
    if (!localNotifikasi) {
      this.saveLocalNotifikasi('[]');
      localNotifikasi = '[]';
    }
    return JSON.parse(localNotifikasi);
  }

  setNotifikasiBadge(data: boolean) {
    this.notifikasiState.next(data);
  }

  getNotifikasiBadge() {
    return this.notifikasiState.value;
  }

  saveReceivedNotifikasi(data: any) {
    const newNotif: Notifikasi = {
      target: data.target,
      title: data.title,
      meta: data.meta,
      push_notification: data.push_notification,
      read: false
    };

    const notifData = this.getLocalNotifikasi();
    notifData.unshift(newNotif);
    this.saveLocalNotifikasi(JSON.stringify(notifData));
    this.updateNotifikasiBadge();
  }

  updateNotifikasiBadge() {
    const dataNotif = this.getLocalNotifikasi();
    if (dataNotif.length > 0) {
      const readCount = dataNotif.reduce(
        (count: number, notif: Notifikasi) =>
          notif.read === true ? ++count : count,
        0
      );
      if (readCount === dataNotif.length) {
        this.setNotifikasiBadge(false);
      } else {
        this.setNotifikasiBadge(true);
      }
    }
  }
}
