import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Profile } from '../interfaces/profile';

const PROFILE = 'PROFILE';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${environment.API_URL}/user/me`).pipe(
      catchError(e => {
        const status = e.status;
        if (status === 401) {
          console.log('You are not authorized for this!');
          // this.logout();
        }
        throw new Error(status);
      })
    );
  }

  editProfile(data): Observable<any> {
    return this.http
      .post(`${environment.API_URL}/user/me`, { UserEditForm: data })
      .pipe(catchError(this.handleError));
  }

  editPhotoProfile(image) {
    const input = new FormData();
    input.append('image', image);
    const HttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    };
    return this.http
      .post(`${environment.API_URL}/user/photo`, input, HttpOptions)
      .pipe(catchError(this.handleError));
  }

  // save data into local storage
  saveProfile(data: object) {
    localStorage.setItem(PROFILE, JSON.stringify(data));
  }

  // save data into local storage
  getLocalProfile() {
    if (localStorage.getItem(PROFILE)) {
      return JSON.parse(localStorage.getItem(PROFILE));
    } else {
      return;
    }
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
