import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { VideoPost } from '../interfaces/video-post';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideoPostService {
  constructor(private http: HttpClient) {}

  getListvideoPost(param: string): Observable<VideoPost[]> {
    return this.http
      .get<VideoPost[]>(`${environment.API_URL}/videos?${param}`)
      .pipe(catchError(this.handleError));
  }

  // save data headlines into local storage
  saveLocal(name: string, data: object) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  // get data headlines into local storage
  getLocal(name: string) {
    return localStorage.getItem(name) ? localStorage.getItem(name) : '';
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
    return throwError(error);
  }
}
