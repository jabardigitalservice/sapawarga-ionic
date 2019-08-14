import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../interfaces/news';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import { UtilitiesService } from './utilities.service';

const URL_HUMAS = 'http://humas.jabarprov.go.id/api/berita-terkini';
@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(
    private http: HttpClient,
    private nativeHttp: HTTP,
    private util: UtilitiesService
  ) {}

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
      .pipe(catchError(this.util.handleError));
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
      .pipe(catchError(this.util.handleError));
  }

  getDetailNews(id: number): Observable<News> {
    return this.http
      .get<News>(`${environment.API_URL}/news/${id}`)
      .pipe(catchError(this.util.handleError));
  }

  getListRelated(id: number, limit: number): Observable<News[]> {
    return this.http
      .get<News[]>(
        `${environment.API_URL}/news/related?id=${id}&limit=${limit}`
      )
      .pipe(catchError(this.util.handleError));
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
}
