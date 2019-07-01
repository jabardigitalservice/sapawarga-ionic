import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { News } from '../interfaces/news';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HumasJabar } from '../interfaces/humas-jabar';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private http: HttpClient) {}

  getListNews(): Observable<News[]> {
    return this.http
      .get<News[]>(`${environment.API_URL}/news`)
      .pipe(catchError(this.handleError));
  }

  getNewsFeatured(limit: number): Observable<News[]> {
    return this.http
      .get<News[]>(`${environment.API_URL}/news`)
      .pipe(catchError(this.handleError));
  }

  getNewsHumas(): Observable<HumasJabar[]> {
    return this.http
      .get<HumasJabar[]>(`${environment.API_MOCK}/news-jabar`)
      .pipe(catchError(this.handleError));
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
