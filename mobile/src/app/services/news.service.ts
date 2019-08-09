import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { News } from '../interfaces/news';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HTTP } from '@ionic-native/http/ngx';

const URL_HUMAS = 'http://humas.jabarprov.go.id/api/berita-terkini';
@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private http: HttpClient, private nativeHttp: HTTP) {}

  getListNews(page: number, idkabkota?: number): Observable<News[]> {
    let URL: string;
    // check param limit
    if (idkabkota) {
      URL = `&kabkota_id=${idkabkota}`;
    } else {
      URL = '';
    }

    return this.http
      .get<News[]>(`${environment.API_URL}/news?page=${page + URL}`)
      .pipe(catchError(this.handleError));
  }

  getNewsFeatured(limit?: number, idkabkota?: number): Observable<News[]> {
    let URL: string;
    // check param limit
    if (limit && !idkabkota) {
      URL = `?limit=${limit}`;
    } else if (idkabkota) {
      URL = `?limit=${limit}&kabkota_id=${idkabkota}`;
    } else {
      URL = '';
    }

    return this.http
      .get<News[]>(`${environment.API_URL}/news/featured${URL}`)
      .pipe(catchError(this.handleError));
  }

  getDetailNews(id: number): Observable<News> {
    return this.http
      .get<News>(`${environment.API_URL}/news/${id}`)
      .pipe(catchError(this.handleError));
  }

  getDataNativeHttp() {
    return this.nativeHttp.get(
      URL_HUMAS,
      {},
      { 'Content-Type': 'application/json' }
    );
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
