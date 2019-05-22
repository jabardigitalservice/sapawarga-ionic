import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Aspirasi } from '../interfaces/aspirasi';
import { environment } from '../../environments/environment';

const ASPIRASI = 'aspirasi';
const ASPIRASI_USER = 'aspirasi-user';

@Injectable({
  providedIn: 'root'
})
export class AspirasiService {
  constructor(private http: HttpClient) {}

  getListAspirasi(page: number): Observable<Aspirasi[]> {
    return this.http
      .get<Aspirasi[]>(`${environment.API_URL}/aspirasi?page=${page}`)
      .pipe(catchError(this.handleError));
  }

  getMyListAspirasi(page: number): Observable<Aspirasi[]> {
    return this.http
      .get<Aspirasi[]>(`${environment.API_URL}/aspirasi/me?page=${page}`)
      .pipe(catchError(this.handleError));
  }

  getDetailAspirasi(id: number): Observable<Aspirasi> {
    return this.http
      .get<Aspirasi>(`${environment.API_URL}/aspirasi/${id}`)
      .pipe(catchError(this.handleError));
  }

  likeAspirasi(id: number): Observable<any> {
    return this.http
      .post(`${environment.API_URL}/aspirasi/likes/${id}`, {})
      .pipe(catchError(this.handleError));
  }

  // save Aspirasi into local storage
  saveLocalAspirasi(data: object) {
    localStorage.setItem(ASPIRASI, JSON.stringify(data));
  }

  // get Aspirasi into local storage
  getLocalAspirasi() {
    return localStorage.getItem(ASPIRASI) ? localStorage.getItem(ASPIRASI) : '';
  }

  // save Aspirasi user into local storage
  saveLocalAspirasiUser(data: object) {
    localStorage.setItem(ASPIRASI_USER, JSON.stringify(data));
  }

  // get Aspirasi user into local storage
  getLocalAspirasiUser() {
    return localStorage.getItem(ASPIRASI_USER)
      ? localStorage.getItem(ASPIRASI_USER)
      : '';
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
