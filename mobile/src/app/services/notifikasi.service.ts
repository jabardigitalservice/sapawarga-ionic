import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { Notifikasi } from '../interfaces/notifikasi';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const NOTIFIKASI = 'notifikasi';
@Injectable({
  providedIn: 'root'
})
export class NotifikasiService {
  notifikasiState = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  getListNotifikasi(): Observable<Notifikasi[]> {
    return this.http
      .get<Notifikasi[]>(`${environment.API_URL}/notifications`)
      .pipe(catchError(this.handleError));
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
      meta: JSON.parse(data.meta),
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

  getNotifikasiNumber() {
    const dataNotif = this.getLocalNotifikasi();
    const unreadCount = dataNotif.reduce(
      (count: number, notif: Notifikasi) =>
        notif.read === false ? ++count : count,
      0
    );
    return unreadCount;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(error.error);
  }
}
