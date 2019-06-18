import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
    return JSON.parse(localStorage.getItem(NOTIFIKASI));
  }

  setNotifikasiBadge(data: boolean) {
    this.notifikasiState.next(data);
  }

  getNotifikasiBadge() {
    return this.notifikasiState.value;
  }
}
