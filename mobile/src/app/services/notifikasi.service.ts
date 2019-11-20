import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observer, Observable, throwError, BehaviorSubject } from 'rxjs';
import { Notifikasi } from '../interfaces/notifikasi';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UtilitiesService } from './utilities.service';

const NOTIFIKASI = 'notifikasi';
@Injectable({
  providedIn: 'root'
})
export class NotifikasiService {
  notifikasiState = new BehaviorSubject(false);

  constructor(private http: HttpClient, private util: UtilitiesService) {}

  getAPINotifikasi(): Observable<Notifikasi[]> {
    return this.http
      .get<Notifikasi[]>(`${environment.API_URL}/notifications`)
      .pipe(catchError(this.util.handleError));
  }

  getNotifikasi(): Observable<Notifikasi[]> {
    return Observable.create((observer: Observer<Notifikasi[]>) => {
      this.getAPINotifikasi().subscribe(
        res => {
          let result = null;
          const localNotifikasi = this.getLocalNotifikasi();

          const listNotifikasi = res['data']['items'];
          if (listNotifikasi.length) {
            // Update API data with local data
            result = listNotifikasi.map(notifikasi => {
              const oldNotifikasi = localNotifikasi.find(
                elmt => elmt.title === notifikasi.title
              );
              notifikasi['read'] = oldNotifikasi ? oldNotifikasi.read : false;
              return notifikasi;
            });

            // save to local
            this.saveLocalNotifikasi(JSON.stringify(result));

            observer.next(result);
            observer.complete();
          } else {
            observer.next([]);
            observer.complete();
          }
        },
        err => {
          observer.error(err);
        }
      );
    });
  }

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

  /**
   *
   *
   * @param {*} data
   * @param {boolean} [isRead]
   * @memberof NotifikasiService
   */
  saveReceivedNotifikasi(data: any, isRead?: boolean) {
    const newNotif: Notifikasi = {
      target: data.target,
      title: data.title,
      meta: JSON.parse(data.meta),
      push_notification: data.push_notification,
      read: isRead ? isRead : false
    };

    const notifData = this.getLocalNotifikasi();
    notifData.unshift(newNotif);
    this.saveLocalNotifikasi(JSON.stringify(notifData));
    this.updateNotifikasiBadge();
  }

  setNotifikasiBadge(data: boolean) {
    this.notifikasiState.next(data);
  }

  getNotifikasiBadge() {
    return this.notifikasiState.value;
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

  getNotifikasiNumber() {
    const dataNotif = this.getLocalNotifikasi();
    const unreadCount = dataNotif.reduce(
      (count: number, notif: Notifikasi) =>
        notif.read === false ? ++count : count,
      0
    );
    return unreadCount;
  }
}
