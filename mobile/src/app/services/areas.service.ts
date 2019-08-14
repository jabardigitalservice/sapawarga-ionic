import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Areas } from './../interfaces/areas';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  constructor(private http: HttpClient, private util: UtilitiesService) {}

  getKabKota(): Observable<Areas[]> {
    return this.http
      .get<Areas[]>(`${environment.API_URL}/areas?depth=2&all=true`)
      .pipe(catchError(this.util.handleError));
  }

  getKecamatan(kabkota: number): Observable<Areas[]> {
    return this.http
      .get<Areas[]>(
        `${environment.API_URL}/areas?parent_id=${kabkota}&depth=3&all=true`
      )
      .pipe(catchError(this.util.handleError));
  }

  getKelurahan(kecamatan): Observable<Areas[]> {
    return this.http
      .get<Areas[]>(
        `${environment.API_URL}/areas?parent_id=${kecamatan}&depth=4&all=true`
      )
      .pipe(catchError(this.util.handleError));
  }
}
