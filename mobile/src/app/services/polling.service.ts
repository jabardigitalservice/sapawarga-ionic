import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Polling } from '../interfaces/polling';
import { environment } from '../../environments/environment';
import { UtilitiesService } from './utilities.service';

const POLLING = 'data-polling';
@Injectable({
  providedIn: 'root'
})
export class PollingService {
  constructor(private http: HttpClient, private util: UtilitiesService) {}

  getListPolling(page: number): Observable<Polling[]> {
    return this.http
      .get<Polling[]>(`${environment.API_URL}/polling?page=${page}`)
      .pipe(catchError(this.util.handleError));
  }

  getDetailPolling(id: number): Observable<Polling> {
    return this.http
      .get<Polling>(`${environment.API_URL}/polling/${id}`)
      .pipe(catchError(this.util.handleError));
  }

  getCheckPolling(id: number): Observable<Polling> {
    return this.http
      .get<Polling>(`${environment.API_URL}/polling/${id}/vote`)
      .pipe(catchError(this.util.handleError));
  }

  putPollingAnswer(id: number, answerId: string): Observable<any> {
    return this.http
      .put(`${environment.API_URL}/polling/${id}/vote`, { id: answerId })
      .pipe(catchError(this.util.handleError));
  }

  // save Broadcast into local storage
  saveLocalPolling(data: object) {
    localStorage.setItem(POLLING, JSON.stringify(data));
  }

  // get Polling into local storage
  getLocalPolling() {
    return JSON.parse(localStorage.getItem(POLLING));
  }
}
