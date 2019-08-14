import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Aspirasi } from '../interfaces/aspirasi';
import { environment } from '../../environments/environment';
import { UtilitiesService } from './utilities.service';

const ASPIRASI = 'aspirasi';
const ASPIRASI_USER = 'aspirasi-user';
const ASPIRASI_LIKES = 'aspirasi-likes';

@Injectable({
  providedIn: 'root'
})
export class AspirasiService {
  constructor(private http: HttpClient, private util: UtilitiesService) {}

  getListAspirasi(page: number): Observable<Aspirasi[]> {
    return this.http
      .get<Aspirasi[]>(`${environment.API_URL}/aspirasi?page=${page}`)
      .pipe(catchError(this.util.handleError));
  }

  getMyListAspirasi(page: number): Observable<Aspirasi[]> {
    return this.http
      .get<Aspirasi[]>(`${environment.API_URL}/aspirasi/me?page=${page}`)
      .pipe(catchError(this.util.handleError));
  }

  PostAspirasi(data: any): Observable<Aspirasi> {
    return this.http
      .post<Aspirasi>(`${environment.API_URL}/aspirasi`, data)
      .pipe(catchError(this.util.handleError));
  }

  editAspirasi(id: number, data: any): Observable<Aspirasi> {
    return this.http
      .put<Aspirasi>(`${environment.API_URL}/aspirasi/${id}`, data)
      .pipe(catchError(this.util.handleError));
  }

  uploadFormData(formData) {
    const HttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http.post<any>(
      `${environment.API_URL}/attachments`,
      formData,
      HttpOptions
    );
  }

  getDetailAspirasi(id: number): Observable<Aspirasi> {
    return this.http
      .get<Aspirasi>(`${environment.API_URL}/aspirasi/${id}`)
      .pipe(catchError(this.util.handleError));
  }

  likeAspirasi(id: number): Observable<any> {
    return this.http
      .post(`${environment.API_URL}/aspirasi/likes/${id}`, {})
      .pipe(catchError(this.util.handleError));
  }

  deleteAspirasi(id: number): Observable<Aspirasi> {
    return this.http
      .delete<Aspirasi>(`${environment.API_URL}/aspirasi/${id}`)
      .pipe(catchError(this.util.handleError));
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

  // save Aspirasi into local storage
  saveLocalLikes(data: object) {
    localStorage.setItem(ASPIRASI_LIKES, JSON.stringify(data));
  }

  // get Aspirasi into local storage
  getLocalLikes() {
    return localStorage.getItem(ASPIRASI_LIKES)
      ? localStorage.getItem(ASPIRASI_LIKES)
      : '';
  }

  // get categories aspirasi
  getCategories() {
    return this.http
      .get<Aspirasi[]>(`${environment.API_URL}/categories?type=aspirasi`)
      .pipe(catchError(this.util.handleError));
  }
}
