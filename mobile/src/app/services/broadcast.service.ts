import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Broadcast } from '../interfaces/broadcast';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const BROADCAST_KEY = 'broadcast';
@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  constructor(private http: HttpClient) {}

  getListBroadCasts(): Observable<Broadcast[]> {
    return this.http
      .get<Broadcast[]>(`${environment.API_URL}/broadcasts`)
      .pipe(catchError(this.handleError));
  }

  getDetailBroadCast(id: number): Observable<Broadcast> {
    return this.http
      .get<Broadcast>(`${environment.API_URL}/broadcasts/${id}`)
      .pipe(catchError(this.handleError));
  }

  // save token into local storage
  saveBroadcast(data: string) {
    localStorage.setItem(BROADCAST_KEY, data);
  }

  // save token into local storage
  getlocalBroadcast() {
    return JSON.parse(localStorage.getItem(BROADCAST_KEY));
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
