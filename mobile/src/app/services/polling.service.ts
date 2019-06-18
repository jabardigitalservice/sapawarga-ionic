import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Polling } from '../interfaces/polling';
import { environment } from '../../environments/environment';

const POLLING = 'data-polling';
@Injectable({
  providedIn: 'root'
})
export class PollingService {
  constructor(private http: HttpClient) {}

  getListPolling(page: number): Observable<Polling[]> {
    return this.http
      .get<Polling[]>(`${environment.API_URL}/polling?page=${page}`)
      .pipe(catchError(this.handleError));
  }

  getDetailPolling(id: number): Observable<Polling> {
    return this.http
      .get<Polling>(`${environment.API_URL}/polling/${id}`)
      .pipe(catchError(this.handleError));
  }

  // save Broadcast into local storage
  saveLocalPolling(data: object) {
    localStorage.setItem(POLLING, JSON.stringify(data));
  }

  // get Polling into local storage
  getLocalPolling() {
    return JSON.parse(localStorage.getItem(POLLING));
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
