import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { Broadcast } from '../interfaces/broadcast';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UtilitiesService } from './utilities.service';

const BROADCAST_KEY = 'broadcast';
const BROADCAST = 'broadcast-data';
@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  notificationState = new BehaviorSubject(false);

  constructor(private http: HttpClient, private util: UtilitiesService) {}

  getListBroadCasts(): Observable<Broadcast[]> {
    return this.http
      .get<Broadcast[]>(`${environment.API_URL}/user-messages`)
      .pipe(catchError(this.util.handleError));
  }

  // save token into local storage
  saveBroadcast(data: string) {
    localStorage.setItem(BROADCAST_KEY, data);
  }

  // save token into local storage
  getBroadcast() {
    return JSON.parse(localStorage.getItem(BROADCAST_KEY));
  }

  // save Broadcast into local storage
  saveLocalBroadcast(data: object) {
    localStorage.setItem(BROADCAST, JSON.stringify(data));
  }

  // get Broadcast into local storage
  getLocalBroadcast() {
    return JSON.parse(localStorage.getItem(BROADCAST));
  }

  setNotification(data: boolean) {
    this.notificationState.next(data);
  }

  getNotification() {
    return this.notificationState.value;
  }

  deleteBroadcast(data): Observable<any> {
    return this.http
      .post(`${environment.API_URL}/user-messages/bulk-delete`, { ids: data })
      .pipe(catchError(this.util.handleError));
  }
}
