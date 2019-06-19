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

  saveNewNotifikasi(data: any) {
    let newNotif = data;
    newNotif['read'] = false;
    newNotif = <Notifikasi> newNotif;

    const notifData = this.getLocalNotifikasi();
    notifData.unshift(newNotif);
    this.saveLocalNotifikasi(JSON.stringify(notifData));
  }
}
