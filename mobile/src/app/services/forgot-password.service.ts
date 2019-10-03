import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../helpers/constants';
import { UtilitiesService } from './utilities.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  constructor(private http: HttpClient, private util: UtilitiesService) {}

  requestForgotPassword(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.API_URL}/password-reset-request`, data)
      .pipe(catchError(this.util.handleError));
  }
}
