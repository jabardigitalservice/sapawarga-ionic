import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NomorPenting } from '../interfaces/nomor-penting';
import { UtilitiesService } from './utilities.service';

const NOMORPENTING = 'nomor-penting';
@Injectable({
  providedIn: 'root'
})
export class NomorPentingService {
  constructor(private http: HttpClient, private util: UtilitiesService) {}

  getNomorPenting(page: number): Observable<NomorPenting[]> {
    return this.http
      .get<NomorPenting[]>(`${environment.API_URL}/phone-books?page=${page}`)
      .pipe(catchError(this.util.handleError));
  }

  getNomorPentingByNearby(
    latitude: number,
    longitude: number
  ): Observable<NomorPenting[]> {
    return this.http
      .get<NomorPenting[]>(
        `${
          environment.API_URL
        }/phone-books?latitude=${latitude}&longitude=${longitude}`
      )
      .pipe(catchError(this.util.handleError));
  }

  filterNomorPenting(type: string, id: number): Observable<NomorPenting[]> {
    return this.http
      .get<NomorPenting[]>(`${environment.API_URL}/phone-books?${type}=${id}`)
      .pipe(catchError(this.util.handleError));
  }

  getDetailNomorPenting(id: string): Observable<NomorPenting> {
    return this.http
      .get<NomorPenting>(`${environment.API_URL}/phone-books/${id}`)
      .pipe(catchError(this.util.handleError));
  }

  CariNomorPenting(value: string): Observable<NomorPenting> {
    return this.http
      .get<NomorPenting>(`${environment.API_URL}/phone-books?search=${value}`)
      .pipe(catchError(this.util.handleError));
  }

  // save token into local storage
  saveLocalNomoPenting(data: object) {
    localStorage.setItem(NOMORPENTING, JSON.stringify(data));
  }

  // get token into local storage
  getLocalNomorPenting() {
    return localStorage.getItem(NOMORPENTING)
      ? localStorage.getItem(NOMORPENTING)
      : '';
  }
}
